import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import Web3 from 'web3'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { ETHPresaleModel, BTCPresaleModel, FIATPresaleModel } from "./presaleModel"
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

class Presale extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMozoAddress: null,
            showAddress: false,
            contract: null,
            btcRequestID: null,
            title: "",
            typeContract: ""
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        self.ethForm = new FormModel({ ...ETHPresaleModel }, { name: 'TransferTokenModel' })

        self.ethForm.onSuccess = function(form) {
            var formData = form.values()
            NetworkService.updatePresaleData(formData.amount, "ethereum", formData.description).subscribe(
                function onNext(response) {
                    self.notifyUpdate("Update successfully.")
                },
                function onError(e) {
                    console.log(e)
                },
                function onCompleted() {

                }
            )
        }

        self.ethForm = new FormModel({ ...ETHPresaleModel }, { name: 'ETHPresaleModel' })

        self.ethForm.onSuccess = function(form) {
            var formData = form.values()
            NetworkService.updatePresaleData(formData.amount, "ethereum", formData.description).subscribe(
                function onNext(response) {
                    self.notifyUpdate("Update successfully.")
                },
                function onError(e) {
                    console.log(e)
                },
                function onCompleted() {

                }
            )
        }

        self.btcForm = new FormModel({ ...BTCPresaleModel }, { name: 'BTCPresaleModel' })

        self.btcForm.onSuccess = function(form) {
            var formData = form.values()
            NetworkService.updatePresaleData(formData.amount, "bitcoin", formData.description).subscribe(
                function onNext(response) {
                    self.notifyUpdate("Update successfully.")
                },
                function onError(e) {
                    console.log(e)
                },
                function onCompleted() {

                }
            )
        }

        self.fiatForm = new FormModel({ ...FIATPresaleModel }, { name: 'FIATPresaleModel' })

        self.fiatForm.onSuccess = function(form) {
            var formData = form.values()
            NetworkService.updatePresaleData(formData.amount, "USD", formData.description).subscribe(
                function onNext(response) {
                    self.notifyUpdate("Update successfully.")
                },
                function onError(e) {
                    console.log(e)
                },
                function onCompleted() {

                }
            )
        }
    }

    initData() {
        var self = this
        NetworkService.getPresaleData().subscribe(
            function onNext(response) {
                if(response) {
                    if(response.length) {
                        self.btcForm.$("amount").value = response[0].amount
                        self.btcForm.$("description").value = response[0].description

                        self.ethForm.$("amount").value = response[1].amount
                        self.ethForm.$("description").value = response[1].description

                        self.fiatForm.$("amount").value = response[2].amount
                        self.fiatForm.$("description").value = response[2].description
                    }
                }

            },
            function onError(e) {
                console.log(e)
            },
            function onCompleted() {

            }
        )

    }

    componentDidMount() {
        this.initData()
    }

    notifyUpdate(text) {

        toast.info(<div>
            <FormattedMessage id={text} />
        </div>,
            {
                autoClose: true,
                closeButton: false,
                className: "top-info"
            })
    }

    returnAddress(address) {
        this.form.$("fromAddress").value = address
        this.setState({ showAddress: true })

    }

    render() {
        var self = this
        var { isMozoAddress, showAddress, title } = self.state
        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ bottom: "0", width: "auto", padding: "20px" }} />
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title"> <FormattedMessage id="Update Presale" /></h2>
                    </div>
                    <Form>
                        <Row>
                            <Col xs="12">
                                <FormattedMessage id="Update ETH Value" />
                            </Col>
                        </Row>
                        <Row className="mt-sm">
                            <Col xs="12" sm="3">
                                <TextField hidelabel={true} thousandSeparator={true} field={self.ethForm.$("amount")} />
                            </Col>
                            <Col xs="12" sm="7">
                                <TextField className="text-box" hidelabel={true} field={self.ethForm.$("description")} />
                            </Col>
                            <Col xs="12" sm="2">
                                <Button color="info"
                                    onClick={self.ethForm.onSubmit.bind(this)} ><FormattedMessage id="Update" /></Button>
                            </Col>
                        </Row>
                        <Row className="mt-md">
                            <Col xs="12">
                                <FormattedMessage id="Update BTC Value" />
                            </Col>
                        </Row>
                        <Row className="mt-sm">
                            <Col xs="12" sm="3">
                                <TextField hidelabel={true} thousandSeparator={true} field={self.btcForm.$("amount")} />
                            </Col>
                            <Col xs="12" sm="7">
                                <TextField className="text-box" hidelabel={true} field={self.btcForm.$("description")} />
                            </Col>
                            <Col xs="12" sm="2">
                                <Button color="info"
                                    onClick={self.btcForm.onSubmit.bind(this)} ><FormattedMessage id="Update" /></Button>
                            </Col>
                        </Row>
                        <Row className="mt-md">
                            <Col xs="12">
                                <FormattedMessage id="Update FIAT Value" />
                            </Col>
                        </Row>
                        <Row className="mt-sm">
                            <Col xs="12" sm="3">
                                <TextField hidelabel={true} thousandSeparator={true} field={self.fiatForm.$("amount")} />
                            </Col>
                            <Col xs="12" sm="7">
                                <TextField className="text-box" hidelabel={true} field={self.fiatForm.$("description")} />
                            </Col>
                            <Col xs="12" sm="2">
                                <Button color="info"
                                    onClick={self.fiatForm.onSubmit.bind(this)} ><FormattedMessage id="Update" /></Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

        )
    }

}


Presale.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3 || new Web3(Web3.givenProvider)
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(Presale)))
