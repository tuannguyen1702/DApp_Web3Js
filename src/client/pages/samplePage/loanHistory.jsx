import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { BaseInfoModel, BankModel, EmailModel, PhoneModel } from "./userProfileModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'

class LoanHistoryComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

        this.initFormModel()
    }

    componentDidMount() {
        var self = this

        NetworkService.getUserInfo().subscribe(
            function onNext(response) {

            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    initFormModel() {
        var self = this
        self.baseInfoForm = new FormModel({ ...BaseInfoModel }, { name: 'User Profile' })

        self.baseInfoForm.onSuccess = function (form) {
            NetworkService.updateCustomer(self.state.userInfo.userId, form.values()).subscribe(
                function onNext(response) {
                    self.baseInfoForm.setValueForReset()
                    self.notify()
                    self.setState({ isCloseEditBaseForm: true })
                    if (response.Result) {
                        console.log(response)
                    } else {
                        console.log("Failed")
                    }
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }
    }

    notify() { toast.info("Update success.") }

    changeState(objState) {
        this.setState(objState)
    }

    render() {
        var self = this
        var { hideVerifyMobile, hideVerifyEmail, isCloseEditBaseForm, isCloseEditEmailForm, isCloseEditPhoneForm, isCloseEditBankForm } = self.state
        return (
            <div>
                <ToastContainer hideProgressBar={true} closeButton={false} style={{ top: "85px", textAlign: "center" }} />
                <div className="common-form">
                    <div className="main-title-container">
                        <h2 className="main-title"><FormattedMessage id="loan_history" /></h2>
                    </div>
                </div>
            </div>

        )
    }

}


export default injectIntl(observer(LoanHistoryComponent))