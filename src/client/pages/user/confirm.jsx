import React, { Component } from "react";
import PropTypes from "prop-types"
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { EmailModel, PasswordModel, SignUpModel } from "./loginModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import { browserHistory } from "react-router";
import { modal } from 'react-redux-modal'
import { setUserInfo } from '../../actions'
import { Url, Common, Origin } from '../../commons/consts/config';
import { utils } from '../../commons/utils';

class ConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count_down_value : 0
        }
    }

    removeThisModal() {
        this.props.removeModal();
    }

    componentDidMount() {
        var self = this
        self.setState({
            count_down_value: 5
        })
        const it = setInterval(() => {
            if(self.state.count_down_value){
                self.setState({
                    count_down_value: self.state.count_down_value - 1
                })
            }else {
                clearInterval(it)
            }
        }, 1000)
        if (self.props.isSuccess) {
            setTimeout(() => {
                self.goHomePage()
            }, 5000)
        }
        // $(document).ready(function() {
        //     console.log("ready")
        //     $("body").children().each(function() {
        //         $(this).html($(this).html().replace(/&#8232;/g," ")); // remove the space in front of the first semicolon!
        //     });
        // });
        self.container.innerHTML.replace(/&#8232;/g, " ")
    }

    goHomePage() {
        var self = this
        var { user, checkDate } = self.props
        self.removeThisModal()
        // browserHistory.push({
        //     pathname: "/"
        // })
        // if (user.role == "user") {

        utils.redirectAfterLogin(user.role, user.origin, checkDate)

        //     if (user.origin == Origin.referral){
        //         window.location = "/" + Url.referral + "/" + Url.referralInfo
        //     } else if ( user.origin == Origin.kyc) {
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
        // if (user.role == "user") {

        //     if (user.origin == Origin.referral || user.origin == Origin.investor || user.origin == Origin.kyc) {

        //         if (!icoIsOpened) {
        //             window.location = user.origin == Origin.kyc ? "/" + Url.kyc + "/" + Url.kycInfo : "/" + Url.referral + "/" + Url.referralInfo
        //         } else {
        //             window.location = "/"
        //         }
        //     } else {
        //         window.location = "/"
        //     }

        // } else {
        //     window.location = "/" + Url.smartContract
        // }

        // if (origin == "referral" || origin == "investor") {
        //     window.location = "/referral"
        // } else {
        //     window.location = "/"
        // }

    }

    render() {
        var self = this
        var { isSuccess } = self.props
        const { count_down_value } = self.state
        return (
            <div ref={ cn => self.container  = cn}>
                {isSuccess ?
                    <div className="text-center custom-modal-content">
                        <div className="verifired-email-icon"></div>
                        <h4 className="verifired-info-message"><FormattedMessage id="Your email is verified"/></h4>
                        <div className="verifired-info-content">
                            <FormattedMessage values={{ seconds: count_down_value }}
                                id="You will be re-directed automatically in 5 seconds"/>
                        </div>
                    </div>
                :
                    <div >
                        <Row>
                            <Col className="sub-title-container text-center" >
                                <h2 className="sub-title"><FormattedMessage id="Verification failed" /></h2>
                            </Col>
                        </Row>
                        <Form className="box text-center">
                            <FormGroup className="text-center">
                                <FormattedMessage id="Your verification code is expired. Please resend your verification email again" values={{ br: <br /> }} />
                            </FormGroup>
                            <FormGroup className="action-block text-center">
                                <Button color="primary"
                                    onClick={() => {
                                        window.location = "/login"
                                    }}
                                ><FormattedMessage id="Close" /></Button>
                            </FormGroup>
                        </Form>
                    </div>}

                {/* AI Crypto - You are verified
                After 3 seconds, it automatically move to AI CRYPTO homepage.
                Or you can click here
                <div>Your verification code is expired. Please resend your verification email again</div> */}
            </div>
        );
    }
}

class ConfirmComponent extends Component {
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
        NetworkService.confirmEmail(token).subscribe(
            function onNext(response) {
                console.log(response)
                localStorage.setItem("token", response.token)
                self.props.dispatch(setUserInfo(response))

                modal.add(ConfirmModal, {
                    title: "Login",
                    size: 'medium', // large, medium or small,
                    isSuccess: true,
                    user: response,
                    checkDate: self.props.checkDate,
                    closeOnOutsideClick: false,
                    hideTitleBar: true,
                    hideCloseButton: true
                });
            },
            function onError(e) {
                modal.add(ConfirmModal, {
                    title: "Login",
                    size: 'medium', // large, medium or small,
                    isSuccess: false,
                    checkDate: self.props.checkDate,
                    closeOnOutsideClick: false,
                    hideTitleBar: true,
                    hideCloseButton: true
                });
            },
            function onCompleted() {

            }
        )
    }



    render() {
        var self = this
        return (
            <div>
            </div>

        )
    }

}

ConfirmComponent.propTypes = {
    checkDate: PropTypes.object,
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
        checkDate: state.checkDate
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(ConfirmComponent)))
