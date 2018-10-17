import React, { Component } from "react";
import PropTypes from "prop-types"
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { ForgotPasswordModel } from "./forgotPasswordModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import { browserHistory } from "react-router";
import { modal } from 'react-redux-modal'
import { setUserInfo } from '../../actions'

class ForgotPasswordModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resetPassFail: false
        }

        this.initFormModel()
    }

    removeThisModal() {
        this.props.removeModal();
    }

    initFormModel() {
        var self = this

        self.form = new FormModel({ ...ForgotPasswordModel }, { name: 'ForgotPasswordModel' })

        self.form.onSuccess = function (form) {
            var { token } = self.props
            NetworkService.resetPassword(form.values().password, token).subscribe(
                function onNext(response) {
                    if (response) {
                        localStorage.setItem("token", response.token)
                        self.goToPage(response)
                    }
                },
                function onError(e) {
                    self.setState({resetPassFail: true})
                },
                function onCompleted() {

                }
            )
        }

    }
    componentDidMount() {
        var self = this
        // if (self.props.isSuccess) {
        //     setTimeout(() => {
        //         self.goHomePage()
        //     }, 3000)
        // }
    }

    goToPage(response) {
        var self = this
        self.removeThisModal()
        // browserHistory.push({
        //     pathname: "/"
        // })
        if (response.origin == "referral" || response.origin == "investor") {
            window.location = "/referral"
        } else {
            window.location = "/"
        }

    }

    handleKeyPress(e, formName) {
        var self = this
        if (e.key == "Enter") {
            e.preventDefault()
            self[formName].onClick(e)
        }
    }

    render() {
        var self = this
        var { isSuccess } = self.props
        var {resetPassFail} = self.state
        return (
            <Row>
                <Col>
                    <Row className={"login-container"}>
                        {!resetPassFail ? <Col className="sign-up">
                            <Row>
                                <Col className="sub-title-container text-center" >
                                    <h2 className="sub-title"><FormattedMessage id="Reset Password" /></h2>
                                    {/* <div><FormattedMessage id="The email address that you've entered doesn't match any account. Sign up for a new account." /></div> */}
                                </Col>
                            </Row>
                            <Form className="box">
                                <FormGroup>
                                    <TextField hidelabel={true} ref="txtPasswordSignUp" field={self.form.$("password")} />
                                </FormGroup>
                                <FormGroup>
                                    <TextField hidelabel={true} field={self.form.$("confirmPassword")} onKeyPress={(e) => this.handleKeyPress(e, "btnSunmmitSignup")} />
                                </FormGroup>
                                {/* <FormGroup>
                                    <FormattedMessage id="Your reset-password url is expired. Click here to resend new url" values={{
                                        br: <br />, clickHere: <a style={{ textDecoration: "underline" }} onClick={(e) => {
                                            self.forgotPassword(e)
                                        }}><b><FormattedMessage id="Click here" /></b></a>
                                    }} />

                                </FormGroup> */}
                                <FormGroup className="action-block">
                                    <Button ref={input => self.btnSunmmitSignup = input} color="primary" className="full-width"
                                        onClick={self.form.onSubmit.bind(this)} ><FormattedMessage id="Reset Password" /></Button>
                                </FormGroup>
                            </Form>
                        </Col> : <Col className="sign-up">
                            <Row>
                                <Col className="sub-title-container text-center" >
                                    <h2 className="sub-title"><FormattedMessage id="Reset password failed" /></h2>
                                </Col>
                            </Row>
                            <Form className="box text-center">
                                <FormGroup className="text-center">
                                    <FormattedMessage id="Your reset-password link is expired. Login to resend new link." values={{ br: <br /> }} />
                                </FormGroup>
                                <FormGroup className="action-block text-center">
                                    <Button color="primary"
                                        onClick={() => {
                                            window.location = "/login"
                                        }}
                                    ><FormattedMessage id="Log in to your account" /></Button>
                                </FormGroup>
                            </Form>
                        </Col>}
                    </Row>
                </Col>
            </Row>
        );
    }
}

class ForgotPassWord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            name: "",
            verified: false,
            error: false,
            activeName: ""
        }
    }

    componentDidMount() {
        var self = this
        var token = this.props.location.query["token"]

        var showForgotPasswordModal = setTimeout(() => {
            modal.add(ForgotPasswordModal, {
                title: "Forgot Password",
                size: 'medium', // large, medium or small,
                isSuccess: true,
                token: token,
                closeOnOutsideClick: false,
                hideTitleBar: true,
                hideCloseButton: true
            });
            clearTimeout(showForgotPasswordModal)
        }, 300)

        // NetworkService.confirmEmail(token).subscribe(
        //     function onNext(response) {
        //         console.log(response)
        //         localStorage.setItem("token", response.token)
        //         self.props.dispatch(setUserInfo(response))

        //         modal.add(ForgotPassWordModal, {
        //             title: "Login",
        //             size: 'medium', // large, medium or small,
        //             isSuccess: true,
        //             origin: response.origin,
        //             closeOnOutsideClick: false,
        //             hideTitleBar: true,
        //             hideCloseButton: true
        //         });
        //     },
        //     function onError(e) {
        //         modal.add(ConfirmModal, {
        //             title: "Login",
        //             size: 'medium', // large, medium or small,
        //             isSuccess: false,
        //             closeOnOutsideClick: false,
        //             hideTitleBar: true,
        //             hideCloseButton: true
        //         });
        //     },
        //     function onCompleted() {

        //     }
        // )
    }



    render() {
        var self = this
        return (
            <div>
            </div>

        )
    }

}

ForgotPassWord.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(ForgotPassWord)))
