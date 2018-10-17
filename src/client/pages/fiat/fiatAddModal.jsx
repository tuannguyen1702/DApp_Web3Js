import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { FIATModel } from "./fiatModel"
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Popover } from 'reactstrap';
import { TextField, Table, Select } from '../../components'
import { Observable } from 'rxjs/Observable'
import { Url } from '../../commons/consts/config';
import { browserHistory } from "react-router";
import Rx from 'rxjs/Rx';
import moment from 'moment'
import copy from 'copy-to-clipboard';
import Web3 from 'web3'
import QRCode from 'qrcode-react'

class FIATAddModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showBTC: false,
            tooltipOpen: false,
            requestHistory: [],
            checkedPending: false,
            disabledRequest: false,
            rateConfig: null,
            emailExists: true,
            bankList: [
                { value: "Development Bank of Singapore", text: "Development Bank of Singapore" },
                { value: "Hong Kong Bank", text: "Hong Kong Bank" }
            ]
        }

        this.initFormModel()

    }

    initFormModel() {
        var self = this
        //FIATModel.fields.email.validators = [self.checkEmailExists("aaaa")]
        self.form = new FormModel({ ...FIATModel }, { name: 'FIATModel' })

        self.form.onSuccess = function (form) {
            var { emailExists } = self.state
            if (emailExists) {
                NetworkService.addFIATTransaction(form.values()).subscribe(
                    function onNext(response) {
                        console.log(response)
                        self.callBackHandle()
                    },
                    function onError(e) {
                        console.log("onError")
                    },
                    function onCompleted() {

                    }
                )
            } else {
                self.form.$("email").invalidate("The Email does not exists.")
            }
        }
    }

    componentDidMount() {
        var self = this

        self.getRateConfig()

        self.form.$('amount').observe({
            key: 'value',
            call: data => {
                self.form.$('token').value = self.convertToMozo(data.field.value)
            },
        });
    }

    getRateConfig() {
        var self = this
        NetworkService.getConfig("token-calculation").subscribe(
            function onNext(response) {

                if (response) {
                    var rateConfig = {}

                    response.map((x) => {
                        if (x.key == "eth-rate") {
                            rateConfig.rateETH = parseFloat(x.value)
                        }

                        if (x.key == "btc-rate") {
                            rateConfig.rateBTC = parseFloat(x.value)
                        }

                        if (x.key == "crowdsale-bonus") {
                            rateConfig.bonusPackages = JSON.parse(x.value)
                        }
                    })

                    self.setState({ rateConfig: rateConfig })
                }

            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    convertToMozo(value) {
        var { rateConfig } = this.state
        var bonus = 0
        var match = _.find(rateConfig.bonusPackages, function (x) {
            return x.minUsd <= value.toString(10);
        });

        var mozoToken = (value) / 0.0009

        if (match && match.bonus != 0) {
            bonus = match.bonus
        }

        mozoToken = mozoToken + mozoToken * bonus

        return (mozoToken / 100).toFixed(2)
    }

    callBackHandle() {
        this.props.callBackHandle();
        this.props.removeModal();
    }

    cancel() {
        this.props.removeModal();
    }

    checkEmailExists(e) {
        var self = this
        NetworkService.checkEmail(e.target.value).subscribe(
            function onNext(response) {
                if (!response) {
                    self.form.$("email").invalidate("The Email does not exists.")
                }

                self.setState({ emailExists: response })
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    render() {
        var self = this
        var { userInfo } = self.props
        var { showBTC, requestHistory, disabledRequest, bankList } = self.state
        return (
            <div>
                <div>

                    <Form>
                        <Row>
                            <Col xs="12">
                                <TextField onBlur={(e) => {
                                    self.checkEmailExists(e)
                                }} field={self.form.$("email")} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField thousandSeparator={true} field={self.form.$("amount")} />
                            </Col>
                            <Col xs="12" sm="6">
                                <TextField thousandSeparator={true} field={self.form.$("token")} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <Select field={self.form.$("bankAccount")} options={bankList} />
                            </Col>
                        </Row>
                        <Row className="mt-md">
                            <Col xs="12" className="text-right">
                                <Button color="secondary" onClick={() => self.cancel()} ><FormattedMessage id="Cancel" /></Button>
                                <Button color="info" onClick={self.form.onSubmit.bind(this)} ><FormattedMessage id="Save" /></Button>
                            </Col>
                        </Row>
                    </Form>

                </div>
            </div>

        )
    }

}

FIATAddModal.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(FIATAddModal)))
