import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import Web3 from 'web3'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { SetRateModel } from "./setRateModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { TextField, Table, Select, WalletOption, MultiTextField } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { Common } from '../../commons/consts/config';

const CloseButton = ({ YouCanPassAnyProps, closeToast }) => (
    <span onClick={closeToast}>×&nbsp;</span>
);

class SetWhitelist extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMozoAddress: null,
            showAddress: false,
            contract: null
        }

        this.initFormModel()


    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...SetRateModel }, { name: 'SetRateModel' })

        self.form.onSuccess = function (form) {
            var { web3 } = self.props
            var values = form.values()
            var { contract } = self.state
            var contractAddress = contract.contracts.address

            var myContract = new web3.eth.Contract(contract.abi, contractAddress);

            if (!web3.currentProvider.isMetaMask) {
                self.props.showMessgageModal({ id: "Please press the confirmation button on your wallet." })
            }

            myContract.methods.setRate(values.rate).send({
                from: values.fromAddress,
                gas: values.gas,
                gasPrice: (values.gasPrice * 1000000000).toString()
            })
                .on('transactionHash', function (hash) {
                    self.props.closeModal(() => {
                        self.notify(hash)
                        //self.addTransferToken(hash)
                    })
                })
                .on('receipt', function (receipt) {
                    console.log(receipt)
                })
                .on('confirmation', function (confirmationNumber, receipt) { console.log(receipt) })
                .on('error', console.error); // If a out of gas error, the second parameter is the receipt.

        }
    }

    addTransferToken(hash) {
        NetworkService.addTransferToken(hash, "add-whitelisting", null, null).subscribe(
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

    initData() {
        var self = this
        var { web3 } = this.props

        NetworkService.getContractByType("ico-contract").subscribe(
            function onNext(response) {
                self.setState({ contract: response })

                var myContract = new web3.eth.Contract(response.abi, response.contracts.address);

                myContract.methods.getRate().call()
                .then(function (result) {
                    self.form.$("rate").value = result
                })
                .catch(function (error) {
                    console.log(error)
                });
            },
            function onError(e) {
                console.log(e)
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
        var myContract = new web3.eth.Contract(contract.abi, contract.contracts.address);

        myContract.methods.setRate(self.form.$("rate").value).estimateGas({
            from: self.form.$("fromAddress").value
        }).then(function (gasAmount) {
            self.form.$("gas").value = gasAmount + parseInt(gasAmount * 0.2)
        }).catch(function (error) {
            console.log(error)
        });
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

    onKeyPressAddress(e) {
        var self = this
        if (e.key == "Enter" || e.key == " ") {
            e.preventDefault()
            var newValue = self.addWhitelistModel.$("address").value
            if (!self.addWhitelistModel.$("address").error && !_.isEmpty(newValue)) {
                var text = self.addWhitelistModel.$("addressList").value
                if (text.indexOf(newValue) < 0) {
                    text.push(self.addWhitelistModel.$("address").value)
                    self.addWhitelistModel.$("addressList").value = text
                    self.addWhitelistModel.$("address").value = ""
                }
                else {
                    self.addWhitelistModel.$("address").invalidate("This address already exists.")
                }
            }
        }
    }

    render() {
        var self = this
        var { investmentAddress } = this.props.params
        var { showAddress } = self.state
        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ bottom: "0", width: "auto", padding: "20px" }} />
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title"><FormattedMessage id="Set Rate" /></h2>
                    </div>
                    <Form>
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField thousandSeparator={true} field={self.form.$("rate")} />
                            </Col>
                        </Row>
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


SetWhitelist.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3 || new Web3(Web3.givenProvider)
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(SetWhitelist)))
