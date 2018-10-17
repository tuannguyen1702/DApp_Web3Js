import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import Web3 from 'web3'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { SetCoOwnerModel, SingleCoOwnerModel, AddCoOwnerModel } from "./setCoOwnerModel"
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

class SetCoOwner extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMozoAddress: null,
            showAddress: false,
            contract: null,
            btcRequestID: null,
            title: "",
            actionTypeState: "",
            contractType: "",
            dataTable: [],
            amountArr: [],
            receiveAddress: [],
            txnId: []
        }

        this.initFormModel()

        this.col = [
            {
                name: <FormattedMessage id="ETH Address" />,
                mapData: "receiveAddress",
                // style: { width: "70%" },
                binding: (data) => {
                    return <span>{data.receiveAddress}</span>
                }
            },
            // {
            //     name: <FormattedMessage id="Total Bonus Token" />,
            //     mapData: "totalBonusToken",
            //     binding: (data) => {
            //         return <span>{parseInt(data.totalBonusToken) / 100} MOZO</span>
            //     }
            // }
        ]
    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...SetCoOwnerModel }, { name: 'SetCoOwnerModel' })
        self.singleCoOwnerForm = new FormModel({ ...SingleCoOwnerModel }, { name: 'SingleCoOwnerModel' })
        self.addCoOwnerModel = new FormModel({ ...AddCoOwnerModel }, { name: 'AddCoOwnerModel' })

        self.form.onSuccess = function (form) {
            var { web3 } = self.props
            var values = form.values()
            var { contract, recipientArr } = self.state
            var contractAddress = contract.contracts.address

            var myContract = new web3.eth.Contract(contract.abi, contractAddress);

            if (!web3.currentProvider.isMetaMask) {
                self.props.showMessgageModal({ id: "Please press the confirmation button on your wallet." })
            }



            myContract.methods.addCoOwners(recipientArr).send({
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

    addTransferToken(hash) {
        NetworkService.addTransferToken(hash, "add-co-owner", null, null).subscribe(
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

        NetworkService.getContractByType("ico-contract").subscribe(
            function onNext(response) {
                self.setState({ contract: response })
            },
            function onError(e) {
                console.log(e)
            },
            function onCompleted() {

            }
        )
        var { coOwnerAddress } = this.props.params
        if (coOwnerAddress != undefined) {
            self.singleCoOwnerForm.$("address").value = coOwnerAddress
            self.setState({ recipientArr: [coOwnerAddress] })

        } 

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

        self.addCoOwnerModel.$("addressList").observe({
            key: 'value',
            call: (data) => {
                console.log(data.field.value)
                self.setState({ recipientArr: data.field.value })
            },
        });
    }

    resettransactionFee() {
        var self = this
        self.form.$("transactionFee").value = self.form.$("gasPrice").value * self.form.$("gas").value / 1000000000
    }

    estimateGas() {
        var self = this
        var { contract, recipientArr } = this.state
        var { web3 } = this.props
        var myContract = new web3.eth.Contract(contract.abi, contract.contracts.address);

        myContract.methods.addCoOwners(recipientArr).estimateGas({
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
            self.addAddressToList()
        }
    }

    onBlurAddress(e) {
        var self = this
        e.preventDefault()
        self.addAddressToList()
    }

    addAddressToList(){
        var self = this
        var newValue = self.addCoOwnerModel.$("address").value
        if (!self.addCoOwnerModel.$("address").error && !_.isEmpty(newValue)) {
            var text = self.addCoOwnerModel.$("addressList").value
            if (text.indexOf(newValue) < 0) {
                text.push(self.addCoOwnerModel.$("address").value)
                self.addCoOwnerModel.$("addressList").value = text
                self.addCoOwnerModel.$("address").value = ""
            }
            else {
                self.addCoOwnerModel.$("address").invalidate("This address already exists.")
            }
        }
    }

    render() {
        var self = this
        var { coOwnerAddress } = this.props.params
        var { showAddress, recipientArr } = self.state
        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ bottom: "0", width: "auto", padding: "20px" }} />
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title"><FormattedMessage id="Set Co-Owner" /></h2>
                    </div>
                    <Form>
                        {/* <Row>
                            <Col xs="12" sm="6" className={isMozoAddress == false ? "check-fail" : ""}>
                                <TextField field={self.form.$("toAddress")} />
                                {isMozoAddress != null && <div className="message-for-text">
                                    {isMozoAddress ? <span className="success-message"><i className="success-icon"></i> <FormattedMessage id="Your contract address is correct!" /></span> : <span className="fail-message"><i className="fail-icon"></i> <FormattedMessage id="This address does not exist." /></span>}
                                </div>}
                            </Col>
                        </Row>*/}
                        {coOwnerAddress != undefined ? <Row>
                            <Col xs="12" sm="6">
                                <TextField disabled field={self.singleCoOwnerForm.$("address")} />
                            </Col>
                        </Row> : <Row>
                                {/* <Col style={{ maxWidth: "800px" }} xs="12">
                                <Table tableData={dataTable} colData={self.col} />
                            </Col> */}
                                <Col xs="12" sm="6">
                                    {_.isEmpty(recipientArr) ? <div className="form-group"><label>Address List</label><div className="label-box-container"><span className="label-box form-control">No Address</span></div></div> :
                                        <MultiTextField field={self.addCoOwnerModel.$("addressList")} />}
                                    <TextField field={self.addCoOwnerModel.$("address")}
                                        onKeyPress={(e) => {
                                            self.onKeyPressAddress(e)
                                        }}
                                        onBlur={(e) => {
                                            self.onBlurAddress(e)
                                        }} />
                                </Col>
                            </Row>}
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


SetCoOwner.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3 || new Web3(Web3.givenProvider)
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(SetCoOwner)))
