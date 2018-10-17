import React, { Component } from "react";
import _ from 'lodash'
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { BaseInfoModel, BankModel, EmailModel, PhoneModel } from "./smartContractModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import { MozoToken, MozoSaleToken, TimelineBonus, InvestmentDiscount, Referral, Treasury, TimeLock, VestedToken } from '../../components/smartContractTemplates'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { Url, Common } from '../../commons/consts/config';
import Web3 from 'web3'
import { deploySmartContract } from "../../commons/smartContractFunctions"
import { browserHistory } from "react-router";

const CloseButton = ({ YouCanPassAnyProps, closeToast }) => (
    <span onClick={closeToast}>×&nbsp;</span>
);

class CreateSmartContractComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collapse: {},
            contractList: [],
            gasLimit: 0,
            data: "",
            abi: [],
            contractType: "",
            address: "",
            smartContractName: ""
        }

        this.initFormModel()
    }

    componentDidMount() {
        var self = this
        self.props.backHeader("/" + Url.smartContract, "Back to Smart Contract List")
        var { type } = self.props.params
        var { web3 } = this.props

        NetworkService.getContractByType(type).subscribe(
            function onNext(response) {

                console.log(response)
                if (web3) {

                    var estimateGasErr = setTimeout(() => {
                        self.setState({ gasLimit: Common.gasDefault, abi: response.abi, data: response.code, contractType: response.type, smartContractName: response.name })
                    }, 1000)

                    web3.eth.estimateGas({
                        data: response.code
                    }).then((result) => {
                        clearTimeout(estimateGasErr)
                        self.setState({ gasLimit: parseInt(result + result * 0.1), abi: response.abi, data: response.code, contractType: response.type, smartContractName: response.name })
                    })

                }
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    initFormModel() {
        var self = this
        self.baseInfoForm = new FormModel({ ...BaseInfoModel }, { name: 'User Profile' })

        self.baseInfoForm.onSuccess = function (form) {

        }
    }

    addSmartContract(hash, address, type, submitData) {
        var self = this
        var { contractID, createType } = self.props.params
        var agencyAddress = null, coFounders = null
        var { contractType } = self.state

        switch (contractType) {
            case "mozo-token-contract":
                coFounders = submitData.from || null
                break
            case "ico-contract":
                coFounders = submitData.coOwnerList || null
                break
            case "referral-contract":
                agencyAddress = submitData.agency || null
                break
        }

        const createSmartContract = () => {
            NetworkService.addSmartContract(hash, address, type, agencyAddress, coFounders).subscribe(
                function onNext(response) {
                    if(contractType == "timelock-contract" || contractType == "vested-token-contract") {
                        self.notify(hash)
                    } else {
                        browserHistory.push({
                            pathname: "/" + Url.smartContractDetail + "/" + type
                        });
                    }
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }

        if (createType == "create") {
            createSmartContract()
        } else {
            NetworkService.deleteSmartContract(contractID).subscribe(
                function onNext(response) {
                    createSmartContract()
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }


    }

    submitHandle(submitData) {
        var self = this
        var { web3 } = this.props
        var { abi, data, contractType } = self.state
        var argumentArr = submitData.argumentArr;

        var transactionObject = {
            gas: submitData.gas,
            gasPrice: submitData.gasPrice,
            to: submitData.to,
            value: submitData.value,
            data: data,
            chainId: Common.chainId
        }

        if (submitData.privateKey == null) {
            transactionObject.from = submitData.from
        }

        var deploy = new Promise((resolve, reject) => {
            var deployResult = deploySmartContract(web3, transactionObject, abi, argumentArr, submitData.privateKey)
            resolve(deployResult)
        })

        if (!web3.currentProvider.isMetaMask) {
            self.props.showMessgageModal({ id: "Please press the confirmation button on your wallet." })
        }

        deploy.then((hash) => {
            //self.notify(hash)
            console.log(hash)
            if (hash != "error") {
                self.props.closeModal(() => {
                    console.log("contract hash", hash)
                    self.addSmartContract(hash, "", contractType, submitData)
                })
            } else {
                self.notifyError()
            }

        })
    }

    submitHandleTreasury(submitData) {
        var self = this
        var { contractType } = self.state
        self.addSmartContract("", submitData.address, contractType, submitData)
    }


    notify(hash) {

        toast.info(<div className="toast-content">
            <FormattedMessage id="Your TX has been broadcast to the network" values={{ br: <br />, hash: hash }} />
            <br /><br /><a target="_blank" href={Common.ethNetworkUrl + "/tx/" + hash}><i><FormattedMessage id="View your transaction" /></i></a>
        </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: false,
                closeButton: <CloseButton YouCanPassAnyProps="close" />
            })
    }

    notifyError() {

        toast.info(<div className="toast-content">
            <FormattedMessage id="Sign transaction fail." />
        </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: true,
                closeButton: <CloseButton YouCanPassAnyProps="close" />
            })
    }

    changeState(objState) {
        this.setState(objState)
    }

    renderSmartContractForm() {
        var self = this
        var { web3 } = self.props
        var { gasLimit, contractType, address } = self.state
        var smartContract = <div>No smart contract map with this type</div>
        switch (contractType) {
            case "mozo-token-contract":
                smartContract = <MozoToken gasLimit={gasLimit} web3={web3} submitHandle={(data) => {
                    self.submitHandle(data)
                }} />
                break
            case "ico-contract":
                smartContract = <MozoSaleToken mozoToken={address} gasLimit={gasLimit} web3={web3} submitHandle={(data) => {
                    self.submitHandle(data)
                }} />
                break
            case "treasury-contract":
                smartContract = <Treasury submitHandle={(data) => {
                    self.submitHandleTreasury(data)
                }} />
                break
            case "presale-timeline-bonus-contract":
            case "crowdsale-timeline-bonus-contract":
                smartContract = <TimelineBonus mozoToken={address} gasLimit={gasLimit} web3={web3} submitHandle={(data) => {
                    self.submitHandle(data)
                }} />
                break
            case "investment-discount-contract":
                smartContract = <InvestmentDiscount mozoToken={address} gasLimit={gasLimit} web3={web3} submitHandle={(data) => {
                    self.submitHandle(data)
                }} />
                break
            case "referral-contract":
                smartContract = <Referral mozoToken={address} gasLimit={gasLimit} web3={web3} submitHandle={(data) => {
                    self.submitHandle(data)
                }} />
                break
            case "vested-token-contract":
                smartContract = <VestedToken mozoToken={address} gasLimit={gasLimit} web3={web3} submitHandle={(data) => {
                    self.submitHandle(data)
                }} />
                break
            case "timelock-contract":
                smartContract = <TimeLock mozoToken={address} gasLimit={gasLimit} web3={web3} submitHandle={(data) => {
                    self.submitHandle(data)
                }} />
                break
        }

        return smartContract
    }

    render() {
        var self = this
        var { gasLimit, smartContractName } = self.state

        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ bottom: "0", width: "auto", padding: "20px" }} />
                <div>
                    <div className="main-title-container">
                        {smartContractName != "" && <h2 className="main-title"><FormattedMessage id="Create Smart Contract Title" values={{ name: smartContractName }} /></h2>}
                    </div>
                    {gasLimit != 0 ? self.renderSmartContractForm() : <div id="loader"></div>}
                </div>
            </div >

        )
    }
}

CreateSmartContractComponent.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3 || new Web3(Web3.givenProvider)
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(CreateSmartContractComponent)))
