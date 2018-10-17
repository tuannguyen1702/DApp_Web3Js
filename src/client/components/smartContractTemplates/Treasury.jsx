import React, { Component } from 'react'
import FormModel from '../../commons/forms/_.extend'
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, WalletOption } from '../index'
import moment from "moment"

const model = {
    fields: {
        address: {
            value: '',
            type: 'text',
            label: 'Your ETH wallet',
            placeholder: 'Input your ETH wallet',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
    }
}


export default class Treasury extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showAddress: false
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...model }, { name: 'Treasury' })
        self.form.onSuccess = function (form) {
            self.props.submitHandle(form.values())
        }
    }

    // componentDidMount() {
    //     var self = this
    //     const { gasLimit } = self.props
    //     self.form.$("gasLimit").value = gasLimit
    // }
    render() {
        var self = this

        return (
            <Form>
                <Row>
                    <Col xs="12" sm="6">
                        <TextField field={self.form.$("address")} />
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
            </Form>
        )
    }
}
