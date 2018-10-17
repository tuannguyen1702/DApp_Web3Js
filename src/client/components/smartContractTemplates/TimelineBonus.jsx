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
            label: 'Mozo Token',
            placeholder: 'Mozo Token',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
        minContribution: {
            value: "50000000000000000000",
            type: 'text',
            label: 'Min Contribution',
            placeholder: 'Min Contribution',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        minContributionAfterBonus: {
            value: "50000000000000000000",
            type: 'text',
            label: 'Min Contribution After Bonus',
            placeholder: 'Min Contribution After Bonus',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        duration: {
            value: '',
            type: 'text',
            label: 'Duration',
            placeholder: 'Duration',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        bonusPercentage: {
            value: '',
            type: 'text',
            label: 'Bonus Percentage',
            placeholder: 'Bonus Percentage',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        total: {
            value: '',
            type: 'text',
            label: 'Total',
            placeholder: 'Total',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        startTime: {
            value: '',
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


export default class TimelineBonus extends Component {
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
            argumentArr.push(parseInt(formData.minContribution))
            argumentArr.push(parseInt(formData.minContributionAfterBonus))
            argumentArr.push(moment.duration(parseInt(formData.duration), "days").asSeconds())
            argumentArr.push(parseInt(formData.bonusPercentage))
            argumentArr.push(parseInt(formData.total))
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
                        <TextField field={self.form.$("minContribution")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField field={self.form.$("minContributionAfterBonus")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField field={self.form.$("duration")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField field={self.form.$("bonusPercentage")} />
                    </Col>
                    <Col xs="12" sm="6">
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField field={self.form.$("total")} />
                    </Col>
                    <Col xs="12" sm="6">
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
                        <TextField field={self.form.$("gasLimit")} />
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
