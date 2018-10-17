import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import Web3 from 'web3'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { IcoActionModel } from "./icoActionModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { TextField, DatePicker, Select, WalletOption } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { Common } from '../../commons/consts/config';

const CloseButton = ({ YouCanPassAnyProps, closeToast }) => (
    <span onClick={closeToast}>×&nbsp;</span>
);

class IcoAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMozoAddress: null,
            showAddress: false,
            contract: null,
            btcRequestID: null,
            title: "",
            actionTypeState: "",
            contractType: ""
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...IcoActionModel }, { name: 'IcoActionModel' })
        var { actionType } = this.props.params

        self.form.onSuccess = function (form) {
            var { web3 } = self.props
            var values = form.values()
            var { contract } = self.state
            var contractAddress = contract.contracts.address
            var myContract = new web3.eth.Contract(contract.abi, contractAddress);
            if (!web3.currentProvider.isMetaMask) {
                self.props.showMessgageModal({ id: "Please press the confirmation button on your wallet." })
            }

           
            var methods = null
            if (actionType == "stop-ico") {
                methods = myContract.methods.setStop()
            }

            if (actionType == "stop-investment-bonus") {
                methods = myContract.methods.close()
            }

            if (actionType == "set-reach-capped") {
                methods = myContract.methods.setReachCapped()
            }

            if (actionType == "release-investment-bonus" || actionType == "release-ico-contract") {
                methods = myContract.methods.release()
            }

            if (methods) {
                methods.send({
                    from: values.fromAddress,
                    gas: values.gas,
                    gasPrice: (values.gasPrice * 1000000000).toString()
                })
                    .on('transactionHash', function (hash) {
                        self.props.closeModal(() => {
                            self.notify(hash)
                            self.addTransferToken(hash)
                        })
                    })
                    .on('receipt', function (receipt) {
                        console.log(receipt)
                    })
                    .on('confirmation', function (confirmationNumber, receipt) { console.log(receipt) })
                    .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
            }
        }
    }

    addTransferToken(hash) {
        var { txnId } = this.state

        var actionType = ""

        if (actionType == "stop-ico") {
            actionType = "ico-stopped"
        }

        if (actionType == "release-ico-contract") {
            actionType = "ico-release"
        }

        if (actionType == "release-investment-bonus") {
            actionType = "investment-bonus-release"
        }

        if(!_.isEmpty(actionType)) {
            NetworkService.addTransferToken(hash, actionType, null, null).subscribe(
                function onNext(response) {
                    console.log(response)
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {
    
                }
            )
        }

        
    }

    initData() {
        var self = this
        var { type, actionType } = this.props.params
        var { web3 } = this.props

        var title = <FormattedMessage id="Set Reach Capped" />

        if (actionType == "stop-ico") {
            title = <FormattedMessage id="Stop Mozo ICO" />
        }

        if (actionType == "stop-investment-bonus") {
            title = <FormattedMessage id="Stop Investment Bonus" />
        }

        if (actionType == "release-ico-contract") {
            title = <FormattedMessage id="Release ICO Contract" />
        }

        if (actionType == "release-investment-bonus") {
            title = <FormattedMessage id="Release Investment Bonus Contract" />
        }

        NetworkService.getContractByType(type).subscribe(
            function onNext(response) {
                console.log(response)
                self.setState({ contract: response, title: title })

                // var myContract = new web3.eth.Contract(response.abi, response.contracts.address);

                // myContract.methods.isReachCapped().call({
                //     from: self.form.$("fromAddress").value
                // })
                // .then(function (result) {
                //     console.log("result", result)
                // })
                // .catch(function (error) {
                //     console.log(error)
                // });

            },
            function onError(e) {
                self.setState({ isMozoAddress: false })
            },
            function onCompleted() {

            }
        )

    }

    componentDidMount() {
        var self = this 
        var { web3 } = self.props

        this.initData()

        self.form.$("gas").observe({
            key: 'value',
            call: () => {
                self.resettransactionFee()
            },
        });

        self.form.$("gasPrice").observe({
            key: 'value',
            call: () => {
                self.resettransactionFee()
            },
        });

        NetworkService.getGasPrice().subscribe(
            function onNext(response) {
                if (response) {
                    if (response["result"]) {
                        var gasPrice = parseInt(web3.utils.hexToNumber(response["result"]) / 1000000000)
                        self.form.$("gasPrice").$rules = 'required|integer|min:' + gasPrice
                        gasPrice = gasPrice + 5
                        
                        gasPrice = gasPrice < 10 ? 10 : gasPrice
                        self.form.$("gasPrice").value = gasPrice

                        self.form.$("transactionFee").value = gasPrice * self.form.$("gas").value / 1000000000
                    }
                }
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    resettransactionFee() {
        var self = this
        self.form.$("transactionFee").value = self.form.$("gasPrice").value * self.form.$("gas").value / 1000000000
    }

    estimateGas() {
        var self = this
        var { contract } = this.state
        var { web3 } = this.props
        var { actionType } = this.props.params
        var myContract = new web3.eth.Contract(contract.abi, contract.contracts.address);
        var methodsToEstimate = null
        if (actionType == "stop-ico") {
            methodsToEstimate = myContract.methods.setStop()
        }

        if (actionType == "stop-investment-bonus") {
            methodsToEstimate = myContract.methods.close()
        }

        if (actionType == "set-reach-capped") {
            methodsToEstimate = myContract.methods.setReachCapped()
        }

        if (actionType == "release-investment-bonus" || actionType == "release-ico-contract") {
            methodsToEstimate = myContract.methods.release()
        }

        if (methodsToEstimate) {
            methodsToEstimate.estimateGas({
                from: self.form.$("fromAddress").value
            }).then(function (gasAmount) {
                self.form.$("gas").value = gasAmount + parseInt(gasAmount * 0.2)
            }).catch(function (error) {
                console.log(error)
            });
        }

    }

    changeState(objState) {
        this.setState(objState)
    }

    getContractForType(e) {
        var self = this
        if (e.target.value.trim() == "" || !(/^(0x)?[0-9a-fA-F]{40}$/.test(e.target.value.trim()))) {
            self.setState({ isMozoAddress: null })
            console.log("faile")
            return
        }
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

    returnAddress(address) {
        this.form.$("fromAddress").value = address
        this.setState({ showAddress: true })

    }

    render() {
        var self = this
        var { showAddress, title } = self.state
        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ bottom: "0", width: "auto", padding: "20px" }} />
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title">{title}</h2>
                    </div>
                    <Form>
                        {/* <Row>
                            <Col xs="12" sm="6" className={isMozoAddress == false ? "check-fail" : ""}>
                                <TextField field={self.form.$("toAddress")} />
                                {isMozoAddress != null && <div className="message-for-text">
                                    {isMozoAddress ? <span className="success-message"><i className="success-icon"></i> <FormattedMessage id="Your contract address is correct!" /></span> : <span className="fail-message"><i className="fail-icon"></i> <FormattedMessage id="This address does not exist." /></span>}
                                </div>}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField thousandSeparator={true} field={self.form.$("amount")} />
                            </Col>
                        </Row>
                        */}
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField thousandSeparator={true} field={self.form.$("gas")} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField append={<span style={{ minWidth: "50px" }}>GWEI</span>} field={self.form.$("gasPrice")} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField disabled append={<span style={{ minWidth: "50px" }}>ETH</span>} field={self.form.$("transactionFee")} />
                            </Col>
                        </Row>

                        {!showAddress && <Row>
                            <Col xs="12" sm="6">
                                <WalletOption returnAddress={(address) => {
                                    self.returnAddress(address)
                                    self.estimateGas()
                                }} field={self.form.$("wallet")} />
                            </Col>
                            <Col xs="12" sm="6">

                            </Col>
                        </Row>}
                        {showAddress && <div>
                            <Row>
                                <Col xs="12" sm="6">
                                    <TextField disabled field={self.form.$("fromAddress")} />
                                </Col>
                                <Col xs="12" sm="6">

                                </Col>
                            </Row>
                            <Row className="mt-md">
                                <Col xs="6">
                                    <Button color="info"
                                        onClick={self.form.onSubmit.bind(this)} ><FormattedMessage id="Submit Form" /></Button>
                                </Col>
                            </Row>
                        </div>}

                    </Form>
                </div>
            </div>

        )
    }

}


IcoAction.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3 || new Web3(Web3.givenProvider)
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(IcoAction)))
