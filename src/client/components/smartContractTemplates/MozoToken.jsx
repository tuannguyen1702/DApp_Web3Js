import React, { Component } from 'react'
import FormModel from '../../commons/forms/_.extend'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, WalletOption } from '../index'

const model = {
    fields: {
        totalSupply: {
            value: 5000000000,
            type: 'text',
            label: 'Total Supply',
            placeholder: 'Total Supply',
            rules: 'required|integer',
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


export default class MozoToken extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showAddress: false
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...model }, { name: 'MozoToken' })
        self.form.onSuccess = function(form) {
            var data = {
                argumentArr: [parseInt(form.values().totalSupply) * 100],
                gas: form.values().gasLimit,
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
        const {gasLimit} = self.props
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
                        <TextField thousandSeparator={true} field={self.form.$("totalSupply")} />
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
