import React, { Component } from "react";
import PropTypes from "prop-types"
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { ChangePasswordModel } from "./changePasswordModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import { browserHistory } from "react-router";
import { modal } from 'react-redux-modal'
import { setUserInfo } from '../../actions'
import { toast } from 'react-toastify'

class ChangePasswordModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changePassFail: false
        }

        this.initFormModel()
    }

    removeThisModal() {
        this.props.removeModal();
    }

    showMessage(messageId) {
      toast.info(<div>
        <FormattedMessage id={messageId} />
      </div>,
        {
          autoClose: true,
          closeButton: false,
          className: "top-info"
        })
    }

    initFormModel() {
        var self = this

        self.onClose = () => {
            console.log("onClose")
        }

        self.form = new FormModel({ ...ChangePasswordModel }, { name: 'ChangePasswordModel' })

        self.form.onSuccess = function (form) {
            // var { token } = self.props
            NetworkService.changePassword(form.values().oldpassword, form.values().password ).subscribe(
                function onNext(response) {
                    if (response) {
                        // localStorage.setItem("token", response.token)
                        self.showMessage("Update password successfully!")
                        self.removeThisModal();
                        // self.goToPage(response)
                        // window.location = "/"
                    }
                },
                function onError(e) {
                    self.setState({changePassFail: true})
                },
                function onCompleted() {

                }
            )
        }

    }
    componentDidMount() {
        var self = this
        this.onClear = () => {
            console.log("onClear")
        }
        // if (self.props.isSuccess) {
        //     setTimeout(() => {
        //         self.goHomePage()
        //     }, 3000)
        // }
    }

    // goToPage(response) {
    //     var self = this
    //     self.removeThisModal()
    //     // browserHistory.push({
    //     //     pathname: "/"
    //     // })
    //     if (response.origin == "referral" || response.origin == "investor") {
    //         window.location = "/referral"
    //     } else {
    //         window.location = "/"
    //     }
    //
    // }

    removeThisModal() {
        this.props.removeModal();
        // window.location = "/"
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
        console.log(modal)
        var { isSuccess } = self.props
        var {changePassFail} = self.state
        return (
            <Row>
                <Col>
                    <Row className={"login-container"}>

                        {!changePassFail ? <Col className="sign-up">
                            <Row>
                                <Col className="text-right" >
                                    <a
                                        onClick={this.removeThisModal.bind(this)}>
                                        &#10006;
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="sub-title-container text-center" >
                                    <h2 className="sub-title">
                                        <FormattedMessage id="ChangePassword" />
                                    </h2>
                                </Col>
                            </Row>

                            <Form className="box">
                                <FormGroup>
                                    <TextField hidelabel={true} ref="txtOldPasswordSignUp" field={self.form.$("oldpassword")} />
                                </FormGroup>
                                <FormGroup>
                                    <TextField hidelabel={true} ref="txtPasswordSignUp" field={self.form.$("password")} />
                                </FormGroup>
                                <FormGroup>
                                    <TextField hidelabel={true} field={self.form.$("confirmPassword")}
                                        onKeyPress={(e) => this.handleKeyPress(e, "btnSunmmitSignup")} />
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
                                        onClick={self.form.onSubmit.bind(this)} ><FormattedMessage id="ChangePassword" /></Button>
                                </FormGroup>
                            </Form>
                        </Col> : <Col className="sign-up">
                            <Row>
                                <Col className="text-right" >
                                    <a
                                        onClick={this.removeThisModal.bind(this)}>
                                        &#10006;
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="sub-title-container text-center" >
                                    <h2 className="sub-title"><FormattedMessage id="Change Password Failed" /></h2>
                                </Col>
                            </Row>
                            <Form className="box text-center">
                                <FormGroup className="text-center">
                                    <FormattedMessage id="Your old-password not match." values={{ br: <br /> }} />
                                </FormGroup>
                                <FormGroup className="action-block text-center">
                                    <Button color="primary"
                                        onClick={() => {
                                            self.initFormModel()
                                            self.setState({ changePassFail: false })
                                        }}
                                    ><FormattedMessage id="Back to change Password" /></Button>
                                </FormGroup>
                            </Form>
                        </Col>}
                    </Row>
                </Col>
            </Row>
        );
    }
}

export const onChangePassword = () => {
    console.log("onChangePassword")
    modal.add(ChangePasswordModal, {
        title: "Change Password",
        size: 'medium', // large, medium or small,
        isSuccess: true,
        // token: token,
        closeOnOutsideClick: false,
        hideTitleBar: true,
        hideCloseButton: true,
    })
}

// class ForgotPassWord extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             id: null,
//             name: "",
//             verified: false,
//             error: false,
//             activeName: ""
//         }
//     }
//
//     componentDidMount() {
//         var self = this
//         // var token = this.props.location.query["token"]
//
//         var showChangePasswordModal = setTimeout(() => {
//             ;
//             clearTimeout(showChangePasswordModal)
//         }, 300)
//     }
//
//
//
//     render() {
//         var self = this
//         return (
//             <div>
//             </div>
//         )
//     }
//
// }
//
// ForgotPassWord.propTypes = {
//     userInfo: PropTypes.object,
//     dispatch: PropTypes.func.isRequired
// };
//
// const mapStateToProps = state => {
//     return {
//         userInfo: state.userInfo
//     };
// };
//
// export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(ForgotPassWord)))
