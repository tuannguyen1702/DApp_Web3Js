import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from "lodash";
import { injectIntl, FormattedMessage } from 'react-intl';
import { FormGroup, Row, Col, Button, Form } from 'reactstrap'
import { Langs } from '../../commons/consts/config';
import { RadioButton } from '../../components'
import FormModel from '../../commons/forms/_.extend'

const LangModel = {
    fields: {
        lang: {
            value: 'en',
            type: 'radio',
            label: '',
            placeholder: '',
            options: {
                validateOnChange: true,
            },
        }
    }
}

class ChooseLang extends Component {
    constructor(props) {
        super(props)

        this.state = {
            time: 10
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this

        self.form = new FormModel({ ...LangModel }, { name: 'LangModel' })

        self.form.onSuccess = function (form) {
            self.chooseLang(form.values().lang)
        }
    }

    chooseLang(code) {
        localStorage.setItem("lang", code)
        this.props.removeModal();

        window.location = window.location.pathname
    }

    componentDidMount(){
        var self = this
        var langCount = setInterval(()=>{
            var newTime = self.state.time - 1
            
            if(newTime == 0) {
                clearInterval(langCount)
                self.chooseLang(self.form.$("lang").value)
            } else{
                self.setState({time: newTime})
            }
            
        }, 1000)
    }

    render() {
        var self = this

        var langs = []
        _.map(Langs, (item) => {
            langs.push({ value: item.code, text: item.text })
        })


        return (
            <div style={{ padding: "0 40px" }}>
                <Col className="email">
                    <Row>
                        <Col className="sub-title-container text-center" >
                            <h2 className="sub-title"><FormattedMessage id="Choose language" /></h2>
                        </Col>
                    </Row>
                    <Form className="box">

                        <Row>
                            <Col>
                                <RadioButton hidelabel={true} className="md-circle-check text-center mobile-style check-right border-checked md-circle-check hide-uncheck" field={self.form.$("lang")} options={langs}
                                    onChange={(e) => {
                                        setTimeout(() => { self.chooseLang(e) }, 300)
                                    }}
                                />
                            </Col>
                        </Row>
                        <FormGroup className="text-center">

                        </FormGroup>
                        <Row>
                            <Col className="sub-title-container text-center" >
                                <a href="" className="primary-text"
                                    onClick={self.form.onSubmit.bind(this)} ><FormattedMessage id="Continue" /></a>

                            </Col>
                        </Row>
                        <FormGroup className="text-center">
                            You will be redirected in {this.state.time} seconds.
                        </FormGroup>
                    </Form>
                </Col>

            </div>
        )
    }
}
export default injectIntl(observer(ChooseLang))