import React, { Component } from 'react'
import FormModel from '../../commons/forms/_.extend'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, WalletOption } from '../index'
import moment from "moment"

const model = {
    fields: {
        mozoToken: {
            value: '',
            type: 'text',
            label: 'Mozo Sale Token',
            placeholder: 'Mozo Sale Token',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
        ethNumber1: {
            value: 0.1,
            type: 'text',
            label: 'ETH Number',
            placeholder: 'Input ETH Number',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        bonusPercentage1: {
            value: 0,
            type: 'text',
            label: 'Bonus Percentage',
            placeholder: 'Bonus Percentage',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        ethNumber2: {
            value: 1,
            type: 'text',
            label: 'ETH Number',
            placeholder: 'Input ETH Number',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        bonusPercentage2: {
            value: 10,
            type: 'text',
            label: 'Bonus Percentage',
            placeholder: 'Bonus Percentage',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        ethNumber3: {
            value: 50,
            type: 'text',
            label: 'ETH Number',
            placeholder: 'Input ETH Number',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        bonusPercentage3: {
            value: 20,
            type: 'text',
            label: 'Bonus Percentage',
            placeholder: 'Bonus Percentage',
            rules: 'required|integer',
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
        endTime: {
            value: '',
            type: 'date',
            label: 'Closing Time',
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


export default class InvestmentDiscount extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showAddress: false
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        var {web3} = self.props
        self.form = new FormModel({ ...model }, { name: 'MozoSaleToken' })
        self.form.onSuccess = function (form) {
            var argumentArr = []
            var formData = form.values()
            argumentArr.push(formData.mozoToken)
            argumentArr.push([ web3.utils.toWei(formData.ethNumber1.toString(), 'ether'), web3.utils.toWei(formData.ethNumber2.toString(), 'ether'), web3.utils.toWei(formData.ethNumber3.toString(), 'ether')])
            argumentArr.push([formData.bonusPercentage1, formData.bonusPercentage2, formData.bonusPercentage3])
            argumentArr.push(formData.startTime.unix())
            argumentArr.push(formData.endTime.unix())

            var data = {
                argumentArr: argumentArr,
                gas: formData.gasLimit,
                gasPrice: "1000000000",
                to: "",
                value: "",
                from: form.values().address,
                privateKey: null
            }

            self.props.submitHandle(data)
        }
    }

    componentDidMount() {
        var self = this
        const { gasLimit } = self.props
        self.form.$("gasLimit").value = gasLimit
        self.form.$("mozoToken").value = localStorage.getItem("mozoSaleToken")
    }

    returnAddress(address) {
        this.form.$("address").value = address
        this.setState({ showAddress: true })

    }

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
                       <h6> <FormattedMessage id="Discount Package" /> </h6>
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="8" sm="4">
                        <TextField field={self.form.$("ethNumber1")} />
                    </Col>
                    <Col xs="4" sm="2">
                        <TextField field={self.form.$("bonusPercentage1")} />
                    </Col>
                </Row>
                <Row>
                    <Col xs="8" sm="4">
                        <TextField field={self.form.$("ethNumber2")} />
                    </Col>
                    <Col xs="4" sm="2">
                        <TextField field={self.form.$("bonusPercentage2")} />
                    </Col>
                </Row>
                <Row>
                    <Col xs="8" sm="4">
                        <TextField field={self.form.$("ethNumber3")} />
                    </Col>
                    <Col xs="4" sm="2">
                        <TextField field={self.form.$("bonusPercentage3")} />
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <DatePicker className="date-picker full-width" field={self.form.$("startTime")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <DatePicker className="date-picker full-width" field={self.form.$("endTime")} />
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
