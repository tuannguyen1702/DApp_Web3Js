import React, {Component} from "react";
import _ from 'lodash'
import {connect} from 'react-redux'
import PropTypes from "prop-types";
import Web3 from 'web3'
import FormModel from '../../commons/forms/_.extend'
import {observer} from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import {AirdropTransactionModel} from "./airdropTransactionModel"
import {injectIntl, FormattedMessage} from 'react-intl';
import {Col, Row, Button, Form, FormGroup} from 'reactstrap';
import {TextField, Table, Select, WalletOption} from '../../components'
import {ToastContainer, toast} from 'react-toastify'
import {Common} from '../../commons/consts/config';
import {modal} from "react-redux-modal";
import AirdropAddModal from './airdropAddModal'
import moment from "moment/moment";

const CloseButton = ({YouCanPassAnyProps, closeToast}) => (
    <span onClick={closeToast}>×&nbsp;</span>
);

class AirdropComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMozoAddress: null,
            showAddress: false,
            contract: null,
            actionTypeState: "",
            dataTable: [],
            amountArr: [],
            receiveAddress: [],
            txnId: [],
        };

        this.initFormModel();

        this.col = [
            {
                name: <FormattedMessage id="ETH Address"/>,
                mapData: "receiveAddress",
                style: {width: "70%"},
                binding: (data) => {
                    return <span>{data.receiveAddress}</span>
                }
            },
            {
                name: <FormattedMessage id="Amount"/>,
                mapData: "amount",
                binding: (data) => {
                    return <span>{parseInt(data.amount) / 100} MOZO</span>
                }
            },
            {
                name: <FormattedMessage id="Date"/>,
                mapData: "updatedAt",
                binding: (data) => {
                    return moment(data.updatedAt).format("MM/DD/YYYY hh:mm:ss")
                }
            }
        ];
    }

    initFormModel() {
        const self = this;
        self.form = new FormModel({...AirdropTransactionModel}, {name: 'AirdropTransactionModel'});

        self.form.onSuccess = function (form) {
            const {web3} = self.props;
            const values = form.values();
            const {contract, recipientArr, amountArr} = self.state;
            const contractAddress = contract.contracts.address;
            const myContract = new web3.eth.Contract(contract.abi, contractAddress);

            !web3.currentProvider.isMetaMask && self.props.parentProps.showMessgageModal({id: "Please press the confirmation button on your wallet."});
            myContract.methods.airdrop(recipientArr, amountArr).send({
                from: values.fromAddress,
                gas: values.gas,
                gasPrice: (values.gasPrice * 1000000000).toString(),
            })
                .on('transactionHash', function (hash) {
                    self.props.parentProps.closeModal(() => {
                        self.notify(hash);
                        self.addTransferToken(hash)
                    })
                })
                .on('receipt', console.log)
                .on('confirmation', function (confirmationNumber, receipt) {
                    console.log(receipt)
                })
                .on('error', console.error); // If a out of gas error, the second parameter is the receipt.

        }
    }

    addTransferToken(hash) {
        const {txnId} = this.state;

        NetworkService.addTransferToken(hash, "airdrop-token", txnId.toString(), 'airdrop').subscribe(
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

    getGasPrice() {
        const self = this;
        const {web3} = self.props;
        self.form.$("gas").observe({
            key: 'value', call: () => {
                self.resetTransactionFee()
            }
        });
        self.form.$("gasPrice").observe({
            key: 'value', call: () => {
                self.resetTransactionFee()
            }
        });
        NetworkService.getGasPrice().subscribe(
            function onNext(response) {
                if (!response || !response["result"])
                    return;

                let gasPrice = parseInt(web3.utils.hexToNumber(response["result"]) / 1000000000);

                gasPrice = gasPrice + 5;
                gasPrice = gasPrice < 10 ? 10 : gasPrice;
                self.form.$("gasPrice").value = gasPrice;
                self.form.$("transactionFee").value = gasPrice * self.form.$("gas").value / 1000000000
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {
            }
        );
    }

    initData() {
        const self = this;
        const {contractType} = self.props;

        self.getGasPrice();
        NetworkService.getContractByType(contractType).subscribe(
            function onNext(response) {
                self.setState({contract: response})
            }, function onError(e) {
                console.log(e)
            }, function onCompleted() {
            }
        );

        self.getAirdropTnxs();
    }

    componentDidMount() {
        this.initData()
    }

    resetTransactionFee() {
        const self = this;
        self.form.$("transactionFee").value = self.form.$("gasPrice").value * self.form.$("gas").value / 1000000000
    }

    estimateGas() {
        const self = this;
        const {contract, recipientArr, amountArr} = this.state;
        const {web3} = this.props;
        const myContract = new web3.eth.Contract(contract.abi, contract.contracts.address);

        myContract.methods.airdrop(recipientArr, amountArr).estimateGas({
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

    notify(hash) {

        toast.info(<div className="toast-content">
                <FormattedMessage id="Your TX has been broadcast to the network" values={{br: <br/>, hash: hash}}/>
                <br/><br/><a target="_blank" href={Common.ethNetworkUrl + "/tx/" + hash}><i><FormattedMessage
                id="View your transaction"/></i></a>
            </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: false,
                closeButton: <CloseButton YouCanPassAnyProps="close"/>
            })
    }

    returnAddress(address) {
        this.form.$("fromAddress").value = address;
        this.setState({showAddress: true})

    }

    getAirdropTnxs() {
        const self = this;
        const {coin} = self.props;
        NetworkService.getAirdropTnxToTransfer(coin).subscribe(
            function onNext(response) {
                console.log(response);
                if (!response.picking)
                    return;

                const recipientArr = [];
                const amountArr = [];
                const txnId = [];
                _.map(response.picking, (x) => {
                    recipientArr.push(x.receiveAddress);
                    amountArr.push(x.amount);
                    txnId.push(x.id)
                });

                self.setState({
                    dataTable: response.picking,
                    amountArr: amountArr,
                    recipientArr: recipientArr,
                    txnId: txnId,
                })

            },
            function onError(e) {
                self.setState({isMozoAddress: false})
            },
            function onCompleted() {
            }
        )
    }

    callback(responseData) {

        this.getAirdropTnxs();
    }

    openAddingModal() {
        const self = this;
        const {coin} = self.props;
        modal.add(AirdropAddModal, {
            title: "Add Airdrop Transactions",
            size: 'large', // large, medium or small,
            closeOnOutsideClick: false,
            hideTitleBar: false,
            hideCloseButton: false,
            coin: coin,
            callback: (response) => {
                self.callback(response);
            }
        });
    }

    render() {
        const self = this;
        const {showAddress, dataTable} = self.state;
        const {title} = self.props;
        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true}
                                style={{bottom: "0", width: "auto", padding: "20px"}}/>
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title">{title}</h2>
                    </div>
                    <FormGroup>
                        <Row>
                            <Col xs="12" sm="6">
                                <h3 className="sub-title"><FormattedMessage id="Current picking airdrop transactions"/>
                                    {dataTable && <span> ({dataTable.length})</span>}</h3>
                            </Col>
                            <Col xs="12" sm="6" className="text-right">
                                <Button className="min-w-md" color="info"
                                        onClick={() => self.openAddingModal()}><FormattedMessage
                                    id="Add Airdrop Transaction"/></Button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <Form>
                        <Row>
                            <Col style={{maxWidth: "800px"}} xs="12">
                                <Table tableData={dataTable} colData={self.col}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField thousandSeparator={true} field={self.form.$("gas")}/>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs="12" sm="6">
                                <TextField append={<span style={{minWidth: "50px"}}>GWEI</span>}
                                           field={self.form.$("gasPrice")}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField disabled append={<span style={{minWidth: "50px"}}>ETH</span>}
                                           field={self.form.$("transactionFee")}/>
                            </Col>
                        </Row>

                        {!showAddress && <Row>
                            <Col xs="12" sm="6">
                                <WalletOption returnAddress={(address) => {
                                    self.returnAddress(address);
                                    self.estimateGas()
                                }} field={self.form.$("wallet")}/>
                            </Col>
                            <Col xs="12" sm="6">

                            </Col>
                        </Row>}
                        {showAddress && <div>
                            <Row>
                                <Col xs="12" sm="6">
                                    <TextField disabled field={self.form.$("fromAddress")}/>
                                </Col>
                                <Col xs="12" sm="6">

                                </Col>
                            </Row>
                            <Row className="mt-md">
                                <Col xs="6">
                                    <Button color="info"
                                            onClick={self.form.onSubmit.bind(this)}><FormattedMessage id="Submit Form"/></Button>
                                </Col>
                            </Row>
                        </div>}

                    </Form>
                </div>
            </div>

        )
    }

}


AirdropComponent.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3 || new Web3(Web3.givenProvider)
    };
};

export default connect(mapStateToProps, dispatch => ({dispatch}))(injectIntl(observer(AirdropComponent)))
