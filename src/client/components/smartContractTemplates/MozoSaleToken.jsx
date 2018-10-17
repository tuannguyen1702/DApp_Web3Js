import React, { Component } from 'react'
import FormModel from '../../commons/forms/_.extend'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, WalletOption, MultiTextField } from '../index'
import moment from 'moment'

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
        coOwnerList: {
            value: [],
            type: 'label',
            label: 'Co-Owner',
            placeholder: 'Input multiple ETH address',
            options: {
                validateOnChange: true,
            },
        },
        coOwner: {
            value: '',
            type: 'text',
            label: 'Co-Owner',
            placeholder: 'Input multiple ETH address',
            rules: 'regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
        supply: {
            value: 700000000,
            type: 'text',
            label: 'Supply',
            placeholder: 'Supply',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        rate: {
            value: 1250000000000,
            type: 'text',
            label: 'Rate',
            placeholder: 'Rate',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        openingTime: {
            value: moment(new Date()).add(5, 'm'),
            type: 'date',
            label: 'Opening Time',
            placeholder: 'DD/MM/YYYY',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        closingTime: {
            value: moment(new Date()).add(7, 'd'),
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


export default class MozoSaleToken extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showAddress: false
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...model }, { name: 'MozoSaleToken' })
        self.form.onSuccess = function (form) {
            var argumentArr = []
            var formData = form.values()
            argumentArr.push(formData.mozoToken)
            argumentArr.push(formData.coOwnerList)
            argumentArr.push(parseInt(formData.supply) * 100)
            argumentArr.push(parseInt(formData.rate))
            argumentArr.push(formData.openingTime.unix())
            argumentArr.push(formData.closingTime.unix())

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
        self.form.$("mozoToken").value = localStorage.getItem("mozoToken")
    }

    returnAddress(address) {
        this.form.$("address").value = address
        this.setState({ showAddress: true })

    }

    onKeyPressCoOwner(e) {
        var self = this
        if (e.key == "Enter" || e.key == " ") {
            e.preventDefault()
            if (!self.form.$("coOwner").error) {
                var text = self.form.$("coOwnerList").value
                text.push(self.form.$("coOwner").value)
                self.form.$("coOwnerList").value = text
                self.form.$("coOwner").value = ""
            }
        }
    }

    onBlurCoOwner(e) {
        // const { onBlur } = this.props
        // if (typeof onBlur == 'function') {
        //     onBlur(e)
        // }
        // var self = this
        // self.props.field.value = self.state.text
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
                        <MultiTextField field={self.form.$("coOwnerList")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField hidelabel={true} field={self.form.$("coOwner")} 
                        onBlur={(e)=>{
                            self.onBlurCoOwner(e)
                        }}
                        onKeyPress={(e)=>{
                            self.onKeyPressCoOwner(e)
                        }} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField thousandSeparator={true} field={self.form.$("supply")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField thousandSeparator={true} field={self.form.$("rate")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <DatePicker className="date-picker full-width" field={self.form.$("openingTime")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <DatePicker className="date-picker full-width" field={self.form.$("closingTime")} />
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
