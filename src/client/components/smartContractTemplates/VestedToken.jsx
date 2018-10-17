import React, { Component } from 'react'
import FormModel from '../../commons/forms/_.extend'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, WalletOption, MultiTextField } from '..'
import moment from 'moment'
import NetworkService from "../../network/NetworkService"

const model = {
    fields: {
        mozoToken: {
            value: '',
            type: 'text',
            label: 'Mozo Token',
            placeholder: 'Mozo Token',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },

        beneficiaryAddress: {
            value: '',
            type: 'text',
            label: 'Beneficiary Address',
            placeholder: 'Beneficiary Address',
            rules: 'regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
        // total: {
        //     value: '',
        //     type: 'text',
        //     label: 'Total MOZO Tokens',
        //     placeholder: 'Total MOZO Tokens',
        //     rules: 'required|integer',
        //     options: {
        //         validateOnChange: true,
        //     },
        // },
        cliff: {
            value: 60,
            type: 'text',
            label: 'Cliff Duration',
            placeholder: 'Cliff Duration',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        vestedDuration: {
            value: 730,
            type: 'text',
            label: 'Vested Duration',
            placeholder: 'Vested Duration',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        startTime: {
            value: moment(new Date()).add(5, 'm'),
            type: 'date',
            label: 'Opening Time',
            placeholder: 'DD/MM/YYYY',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        gasLimit: {
            value: '',
            type: 'text',
            label: 'Gas Limit',
            placeholder: 'Gas Limit',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        gasPrice: {
            value: 10,
            type: 'text',
            label: 'Gas Price',
            placeholder: 'Gas Price',
            rules: 'required|integer|min: 5',
            options: {
                validateOnChange: true,
            },
        },
        transactionFee: {
            value: 10 * 300000 / 1000000000,
            type: 'text',
            label: 'Max Transaction Fee',
            placeholder: 'Max Transaction Fee',
            options: {
                validateOnChange: true,
            },
        },
        wallet: {
            value: -1,
            type: 'radio',
            label: 'How would you like to access your wallet?',
            placeholder: 'How would you like to access your wallet?',
            options: {
                validateOnChange: true,
            },
        },
        address: {
            value: '',
            type: 'text',
            label: 'Your wallet',
            placeholder: 'Your wallet',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
    }
}


export default class VestedToken extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showAddress: false
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...model }, { name: 'TimeLock' })
        self.form.onSuccess = function (form) {
            var argumentArr = []
            var formData = form.values()
            argumentArr.push(formData.mozoToken)
            argumentArr.push(formData.beneficiaryAddress)
            // argumentArr.push(parseInt(formData.total) * 100)
            argumentArr.push(formData.startTime.unix())
            argumentArr.push(parseFloat(formData.cliff) * 24 * 60 * 60)
            argumentArr.push(parseFloat(formData.vestedDuration) * 24 * 60 * 60)

            var data = {
                argumentArr: argumentArr,
                gas: formData.gasLimit,
                gasPrice: (formData.gasPrice * 1000000000).toString(),
                to: "",
                value: "",
                from: formData.address,
                privateKey: null
            }

            self.props.submitHandle(data)
        }
    }

    componentDidMount() {
        var self = this
        const { gasLimit, web3 } = self.props

        self.form.$("gasLimit").observe({
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

        self.form.$("gasLimit").value = gasLimit
        self.form.$("mozoToken").value = localStorage.getItem("mozoToken")

        NetworkService.getGasPrice().subscribe(
            function onNext(response) {
                if (response) {
                    if (response["result"]) {
                        var gasPrice = parseInt(web3.utils.hexToNumber(response["result"]) / 1000000000)
                        self.form.$("gasPrice").$rules = 'required|integer|min:' + gasPrice
                        gasPrice = gasPrice + 5

                        gasPrice = gasPrice < 10 ? 10 : gasPrice
                        self.form.$("gasPrice").value = gasPrice

                        self.form.$("transactionFee").value = gasPrice * self.form.$("gasLimit").value / 1000000000
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
        self.form.$("transactionFee").value = self.form.$("gasPrice").value * self.form.$("gasLimit").value / 1000000000
    }

    returnAddress(address) {
        this.form.$("address").value = address
        this.setState({ showAddress: true })

    }

    // onKeyPressCoOwner(e) {
    //     var self = this
    //     if (e.key == "Enter" || e.key == " ") {
    //         e.preventDefault()
    //         if (!self.form.$("coOwner").error) {
    //             var text = self.form.$("coOwnerList").value
    //             text.push(self.form.$("coOwner").value)
    //             self.form.$("coOwnerList").value = text
    //             self.form.$("coOwner").value = ""
    //         }
    //     }
    // }

    // onBlurCoOwner(e) {
    //     // const { onBlur } = this.props
    //     // if (typeof onBlur == 'function') {
    //     //     onBlur(e)
    //     // }
    //     // var self = this
    //     // self.props.field.value = self.state.text
    // }

    render() {
        var self = this
        var { showAddress } = self.state

        return (
            <Form>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField field={self.form.$("mozoToken")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField field={self.form.$("beneficiaryAddress")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                {/* <Row>
                    <Col xs="12" sm="6">
                        <TextField thousandSeparator={true} field={self.form.$("total")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row> */}
                <Row>
                    <Col xs="12" sm="6">
                        <DatePicker className="date-picker full-width" field={self.form.$("startTime")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField append={"Days"} field={self.form.$("cliff")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField append={"Days"} field={self.form.$("vestedDuration")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField thousandSeparator={true} field={self.form.$("gasLimit")} />
                    </Col>
                    <Col xs="12" sm="6">
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
                        <WalletOption returnAddress={(address) => self.returnAddress(address)} field={self.form.$("wallet")} />
                    </Col>
                    <Col xs="12" sm="6">

                    </Col>
                </Row>}
                {showAddress && <div>
                    <Row>
                        <Col xs="12" sm="6">
                            <TextField disabled field={self.form.$("address")} />
                        </Col>
                        <Col xs="12" sm="6">

                        </Col>
                    </Row>
                    <Row className="mt-md">
                        <Col xs="6">
                            <Button color="primary"
                                onClick={self.form.onSubmit.bind(this)} ><FormattedMessage id="Create Contract" /></Button>
                        </Col>
                    </Row>
                </div>}

            </Form>
        )
    }
}
