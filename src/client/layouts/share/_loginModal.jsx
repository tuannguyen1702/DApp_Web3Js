import React, { Component } from "react";
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { EmailModel, PasswordModel, SignUpModel } from "./_loginModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import { browserHistory } from "react-router";
import { setUserInfo } from '../../actions'
import { Url, Common, Origin } from '../../commons/consts/config';
import { Scrollbars } from 'react-custom-scrollbars';
import { utils } from '../../commons/utils';

import friendVerifyImg from "../../images/friend-verify.png";
import friendVerifiedImg from "../../images/friend-verified.png";

import { TermsConditionsContentEN, TermsConditionsContentKO } from './_termsConditionsContent';

class LoginModal extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            id: null,
            name: "",
            verified: false,
            error: false,
            activeName: "active-email",
            slide: "",
            userReferral: null,
            referralValue: 0,
            sendComplete: false,
            showPassword: false,
            buttonText: "Login",
            title: "Join Mozo",
            loginMode: true,
            termsAgree: false,
            termsAgreeErr: false,
            referralId: null,
            origin: props.origin || "user"
        }

        this.initFormModel()
        this.focusTextInput = this.focusTextInput.bind(this);
    }

    focusTextInput() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput.current.focus();
    }

    initFormModel() {
        var self = this
        self.userForm = new FormModel({ ...EmailModel }, { name: 'User Login' })

        self.userForm.onSuccess = function (form) {
            if (self.state.loginMode) {
                NetworkService.login(form.values().username, form.values().password).subscribe(
                    function onNext(response) {
                        localStorage.setItem("token", response.token)
                        if (response.role == "user" && (response.origin == Origin.user || response.origin == Origin.investor) && window.location.pathname == "/referral/login") {
                            NetworkService.changeUserOrigin("referral").subscribe(
                                function onNext(response2) {
                                    self.props.dispatch(setUserInfo(response2))
                                    self.props.removeModal();
                                    self.goToPage(response2)
                                },
                                function onError(e) {

                                },
                                function onCompleted() {

                                }
                            )
                        } else {
                            self.props.dispatch(setUserInfo(response))
                            self.props.removeModal();
                            self.goToPage(response)
                        }
                    },
                    function onError(e) {
                        self.userForm.$("password").invalidate("The Password is incorrect.")
                    },
                    function onCompleted() {

                    }
                )
            } else {

                if (!self.state.termsAgree) {
                    self.setState({ termsAgreeErr: true })

                    return false
                }

                const { referralId, origin } = self.state
                NetworkService.signUp(form.values().username, form.values().password, referralId, origin).subscribe(
                    function onNext(response) {
                        self.props.dispatch(setUserInfo(response))
                        localStorage.setItem("token", response.token)

                        if (self.state.userReferral != null) {
                            localStorage.setItem("userRef_" + form.values().username, self.state.userReferral)
                        }

                        self.props.removeModal();
                        self.goToPage(response)
                    },
                    function onError(e) {
                        console.log("onError")
                    },
                    function onCompleted() {

                    }
                )
            }
        }

        self.passwordForm = new FormModel({ ...PasswordModel }, { name: 'User Login' })

        self.passwordForm.onSuccess = function (form) {
            NetworkService.login(self.userForm.values().username, form.values().password).subscribe(
                function onNext(response) {
                    localStorage.setItem("token", response.token)
                    self.props.dispatch(setUserInfo(response))
                    self.props.removeModal();
                    self.goToPage(response)
                },
                function onError(e) {
                    self.passwordForm.$("password").invalidate("The Password is incorrect.")
                },
                function onCompleted() {

                }
            )
        }

        self.signUpForm = new FormModel({ ...SignUpModel }, { name: 'User Login' })

        self.signUpForm.onSuccess = function (form) {
            const { referralId, origin } = self.props
            NetworkService.signUp(self.userForm.values().username, form.values().password, referralId, origin).subscribe(
                function onNext(response) {
                    self.props.dispatch(setUserInfo(response))
                    localStorage.setItem("token", response.token)
                    localStorage.setItem("userRef_" + form.values().username, self.state.userReferral)
                    self.props.removeModal();
                    self.goToPage(response)
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }
    }

    termsAgree(e) {
        var self = this
        self.setState({ termsAgreeErr: !e.target.checked, termsAgree: e.target.checked })
    }

    checkEmail() {
        var self = this
        const username = self.userForm.$("username").value
        NetworkService.checkEmail(username).subscribe(
            function onNext(response) {
                if (response) {
                    self.setState({ title: "Login", buttonText: "Login", loginMode: true, emailChecked: true })
                } else {
                    self.setState({ title: "Sign Up", buttonText: "Sign Up", loginMode: false, emailChecked: true })
                }
                // if (response) {
                //     self.setState({ activeName: "active-pass", slide: "slide-left" })
                //     setTimeout(() => {
                //         const targetNode = ReactDOM.findDOMNode(self.refs["txtPassword"])
                //         targetNode.querySelectorAll("input")[0].focus()
                //     }, 200)

                // } else {
                //     //self.setState({ activeName: "active-terms", slide: "slide-left" })

                //     self.setState({ activeName: "active-sign-up", slide: "slide-left" })
                //     setTimeout(() => {
                //         const targetNode = ReactDOM.findDOMNode(self.refs["txtPasswordSignUp"])
                //         targetNode.querySelectorAll("input")[0].focus()
                //     }, 200)

                // }

                // setTimeout(() => {
                //     self.setState({ slide: "slide" })
                // }, 100)



            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    loginAsAnonymous() {
        var self = this
        NetworkService.loginAsAnonymous().subscribe(
            function onNext(response) {
                localStorage.setItem("token", response.token)
                self.props.dispatch(setUserInfo(response))
                self.goToPage(response)
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    emailValidation(email) {
        var rex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (rex.test(email)) {
            return true
        }

        return false
    }

    componentDidMount() {
        var self = this

        const referralId = localStorage.getItem("referCode")

        if (!_.isEmpty(referralId) && self.state.origin != Origin.referral) {
            self.setState({ referralId: referralId, origin: "user" })

            NetworkService.checkReferralLink(referralId).subscribe(
                function onNext(response) {
                    if (response.rate > 0) {
                        var referralRate = parseFloat(response.rate)
                        var userReferral = response.user || null
                        if (userReferral) {
                            userReferral.rate = referralRate

                            userReferral = JSON.stringify(userReferral)
                        }
                        self.setState({ referralValue: referralRate, userReferral: userReferral })
                    }
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }

        self.userForm.$("username").observe({
            key: 'value',
            call: data => {
                if (self.emailValidation(data.field.value)) {
                    self.setState({ showPassword: true, buttonText: "Password" })
                }

                if (_.isEmpty(data.field.value)) {
                    self.setState({ showPassword: false, buttonText: "Inter Your Email" })
                }

            },
        });

    }

    goToPage(user) {

        const { checkDate } = this.props

        utils.redirectAfterLogin(user.role, user.origin, checkDate)

        // if(!_.isEmpty(window.location.hash)) {
        //     window.location = "/" + window.location.hash.substring(1)
        //     return false
        // }

        // if (user.role == "user") {

        //     if (user.origin == Origin.referral){
        //         window.location = "/" + Url.referral + "/" + Url.referralInfo
        //     } else if ( user.origin == Origin.kyc) {
        //         var now = new Date()
        //         if( !checkDate["check-preopen-date"] ) {
        //         // if (now <= new Date(Common.ICOOpenDate)) {
        //             window.location = "/" + Url.kyc + "/" + Url.kycInfo 
        //         } else {
        //             window.location = "/"
        //         }
        //     } else {
        //         window.location = "/"
        //     }

        // } else {
        //     window.location = "/" + Url.smartContract
        // }

    }

    handleKeyPress(e, txtName) {
        var self = this
        if (e.key == "Enter") {
            e.preventDefault()
            if (txtName = "email") {
                if (self.emailValidation(e.target.value)) {
                    self.checkEmail()
                }
            }

            if (txtName = "password") {
                self["btnSunmmitEmail"].onClick(e)

            }
            //self[formName].onClick(e)
        }
    }

    onBlur(e, txtName) {
        var self = this
        e.preventDefault()
        if (txtName = "email") {
            if (self.emailValidation(e.target.value)) {
                self.checkEmail()
            }
        }
    }

    forgotPassword(e) {
        var self = this
        e.preventDefault()
        var username = this.userForm.$("username").value
        NetworkService.forgotPassword(username).subscribe(
            function onNext(response) {
                if (response) {
                    self.setState({ sendComplete: true })
                    self.props.showMessage("Send email successfully.")
                }
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    renderContent(activeName) {
        var self = this
        const { title, termsAgreeErr, sendComplete, showPassword, buttonText, loginMode, emailChecked } = self.state
        const { referralId } = self.props
        const currentLocale = self.props.intl.locale;
        if (activeName == "active-email") {
            return <Col className="email">
                <Row>
                    <Col className="sub-title-container text-center" >
                        <h2 className="sub-title"><FormattedMessage id={title} /></h2>
                    </Col>
                </Row>
                <Form className="box">
                    <FormGroup>
                        <TextField hidelabel={true} field={self.userForm.$("username")} onBlur={(e) => this.onBlur(e, "email")} />
                    </FormGroup>
                    {showPassword && <FormGroup>
                        <TextField hidelabel={true} ref="txtPassword" field={self.userForm.$("password")} onKeyPress={(e) => this.handleKeyPress(e, "password")} />
                    </FormGroup>}
                    {(showPassword && emailChecked) && (loginMode ? (!sendComplete ? <a onClick={(e) => {
                        self.forgotPassword(e)
                    }}> <small><FormattedMessage id="Forgot your password?" /> </small></a> : <small>
                            <FormattedMessage id="We just send an email to ...reset password" values={{
                                br: <br />, mailto: <b>{self.userForm.$("username").value}</b>, clickHere: <a style={{ textDecoration: "underline" }} onClick={(e) => {
                                    self.forgotPassword(e)
                                }}><b><FormattedMessage id="Click here" /></b></a>
                            }} />
                        </small>) : <FormGroup check>
                            <Label check>
                                <Input type="checkbox" onChange={(e) => self.termsAgree(e)} />{' '}
                                <small><FormattedMessage id="I agree to the Terms and Conditions and the Privacy Policy of Mozo." values={{ policyLink: <a className="info-text" target="_blank" href="/privacy-and-cookie-policy"><FormattedMessage id="Privacy Policy" /></a>, termsConditions: <a target="_blank" className="info-text" href="/term-and-condition"><FormattedMessage id="Terms and Conditions" /></a> }} /></small>
                            </Label>
                            {termsAgreeErr && <small className="error"><FormattedMessage id="Please agree to our privacy policy to proceed further." /></small>}
                        </FormGroup>)}
                    <FormGroup className="action-block">
                        <Button ref={input => self.btnSunmmitEmail = input} color="primary" className="text-uppercase full-width"
                            onClick={self.userForm.onSubmit.bind(this)} ><FormattedMessage id={buttonText} /></Button>
                    </FormGroup>

                    {/* <div className="action-block text-center">
                        <a onClick={()=> self.loginAsAnonymous()}><FormattedMessage id="Login as" /> <FormattedMessage id="anonymous" /></a>
                    </div> */}
                </Form>
                {/* <div className="action-block text-center">
                    <FormattedMessage id="Can’t log in?" />
                </div> */}
            </Col>
        } else if (activeName == "active-pass") {
            return <Col className="pass">
                <Row>
                    <Col className="sub-title-container text-center" >
                        <h2 className="sub-title"><FormattedMessage id="Login" /></h2>
                    </Col>
                </Row>
                <Form className="box">
                    <FormGroup>
                        <TextField disabled hidelabel={true} field={self.userForm.$("username")} onKeyPress={(e) => this.handleKeyPress(e, "btnSunmmitEmail")} />
                    </FormGroup>
                    <FormGroup>
                        <TextField hidelabel={true} ref="txtPassword" field={self.userForm.$("password")} onKeyPress={(e) => this.handleKeyPress(e, "btnSunmmitPass")} />
                    </FormGroup>
                    <FormGroup>
                        {!sendComplete ? <a onClick={(e) => {
                            self.forgotPassword(e)
                        }}><FormattedMessage id="Forgot your password?" /></a> : <span>
                                <FormattedMessage id="We just send an email to ...reset password" values={{
                                    br: <br />, mailto: <b>{self.userForm.$("username").value}</b>, clickHere: <a style={{ textDecoration: "underline" }} onClick={(e) => {
                                        self.forgotPassword(e)
                                    }}><b><FormattedMessage id="Click here" /></b></a>
                                }} />
                            </span>}
                    </FormGroup>
                    <FormGroup className="action-block">
                        <Button ref={input => self.btnSunmmitPass = input} color="primary" className="full-width"
                            onClick={self.passwordForm.onSubmit.bind(this)} ><FormattedMessage id="Login" /></Button>
                    </FormGroup>
                    <div className="action-block text-center">
                        <a onClick={() => {
                            self.setState({ activeName: "active-email", slide: "slide-right" })
                            setTimeout(() => { self.setState({ slide: "slide" }) }, 100)
                        }}><i className="fas fa-arrow-left"></i> &nbsp;&nbsp; <FormattedMessage id="Login with different account" /></a>
                    </div>
                </Form>
                {/* <div className="action-block text-center">
                    <FormattedMessage id="Forgot your password?" />
                </div> */}
            </Col>
        } else if (activeName == "active-terms") {
            return <Col className="terms">
                <Row>
                    <Col className="sub-title-container text-center" >
                        <h2 className="sub-title"><FormattedMessage id="Terms and Conditions of Mozo Token Generation Event" /></h2>
                        {/* <div><FormattedMessage id="The email address that you've entered doesn't match any account. Sign up for a new account." /></div> */}
                    </Col>
                </Row>
                <Form className="box">
                    <FormGroup className="pannel-scroll">
                        <Scrollbars
                            style={{ height: 300 }}>
                            {currentLocale == 'en' && <TermsConditionsContentEN />}
                            {currentLocale == 'ko' && <TermsConditionsContentKO />}
                        </Scrollbars>
                    </FormGroup>
                    <p className="red-small-notice">Note: If you intend to buy token with the amount greater than 20,000 SGD (or 15,000 USD), please use AML/KYC to process the payment.<br />
                        Otherwise, the invested amount will not be returned and you won’t receive any token.</p>
                    <div className="action-block">
                        <Button color="primary" className="full-width"
                            onClick={() => {
                                self.setState({ activeName: "active-sign-up", slide: "slide-left" })
                                setTimeout(() => {
                                    const targetNode = ReactDOM.findDOMNode(self.refs["txtPasswordSignUp"])
                                    targetNode.querySelectorAll("input")[0].focus()
                                }, 200)

                                setTimeout(() => {
                                    self.setState({ slide: "slide" })
                                }, 100)

                            }} ><FormattedMessage id="Agree" /></Button>
                    </div>
                    <div className="action-block text-center">
                        <a onClick={() => {

                        }}><FormattedMessage id="Cancel" /></a>
                    </div>
                </Form>
            </Col>
        } else {
            return <Col className="sign-up">
                <Row>
                    <Col className="sub-title-container text-center" >
                        <h2 className="sub-title"><FormattedMessage id="Sign Up" /></h2>
                        {/* <div><FormattedMessage id="The email address that you've entered doesn't match any account. Sign up for a new account." /></div> */}
                    </Col>
                </Row>
                <Form className="box">
                    <FormGroup>
                        <TextField disabled hidelabel={true} field={self.userForm.$("username")} onKeyPress={(e) => this.handleKeyPress(e, "btnSunmmitEmail")} />
                    </FormGroup>
                    <FormGroup>
                        <TextField hidelabel={true} ref="txtPasswordSignUp" field={self.signUpForm.$("password")} onKeyPress={(e) => this.handleKeyPress(e, "btnSunmmitSignup")} />
                    </FormGroup>
                    <FormGroup>
                        <a onClick={(e) => {
                            self.forgotPassword(e)
                        }}><small><FormattedMessage id="Please check the Privacy Policy regarding the collecting and using personal information of new members." /></small></a>
                    </FormGroup>
                    <div className="action-block">
                        <Button ref={input => self.btnSunmmitSignup = input} color="primary" className="full-width"
                            onClick={self.signUpForm.onSubmit.bind(this)} ><FormattedMessage id="Sign Up" /></Button>
                    </div>
                    <div className="action-block text-center">
                        <a onClick={() => {
                            self.setState({ activeName: "active-email", slide: "slide-right" })
                            setTimeout(() => { self.setState({ slide: "slide" }) }, 100)
                        }}><i className="fas fa-arrow-left"></i> &nbsp;&nbsp; <FormattedMessage id="Login with different account" /></a>
                    </div>
                </Form>
            </Col>
        }

    }

    render() {
        var self = this
        return (<div>
            <Row>
                <Col>
                    <Row className={"login-container " + self.state.slide}>
                        {self.renderContent(self.state.activeName)}
                    </Row>
                </Col>
            </Row>
        </div>
        )
    }

}

LoginModal.propTypes = {
    checkDate: PropTypes.object,
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        checkDate: state.checkDate,
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(LoginModal)))
