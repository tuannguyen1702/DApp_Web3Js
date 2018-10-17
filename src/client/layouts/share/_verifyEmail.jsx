import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Collapse } from 'reactstrap';
import { Icon } from '../../components'
import NetworkService from "../../network/NetworkService"
import { ToastContainer, toast } from 'react-toastify'

class VerifyEmailMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hideVerify: sessionStorage.getItem("showVerifyWindow") == 'true' || sessionStorage.getItem("showVerifyWindow") == null ? true : false
        }
    }

    resendConfirmEmail() {
        var self = this
        NetworkService.resendConfirmEmail().subscribe(
            function onNext(response) {
                if (response) {
                    self.sendEmailSuccess()
                }

            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    sendEmailSuccess() {

        toast.info(<div>
            <FormattedMessage id="Send email successfully." />
        </div>,
            {
                autoClose: true,
                closeButton: false,
                className: "top-info"
            })
    }

    render() {
        var self = this
        var { hideVerify } = self.state
        const { email, messageId } = self.props

        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ width: "auto", minWidth: "250px" }} />
                <div className="bottom-right-content">
                    <div className={"bottom-right-content__header" + (!self.state.hideVerify ? " hidden" : "")}>
                        <span>Please verify your email to receive latest update.</span>
                        <a onClick={() => {
                        self.setState({
                            hideVerify: !self.state.hideVerify }, function() {
                            sessionStorage.setItem("showVerifyWindow", self.state.hideVerify);
                        })
                    }}><span className="svg-icon-container"><Icon name="arrow" /> { (!self.state.hideVerify) ? 'Show' : 'Hide'}</span></a>
                    </div>
                    <Collapse isOpen={hideVerify} className="bottom-right-content__content">

                        <div className="bottom-right-content-icon verify-email-icon"></div>
                        <div className="bottom-right-content__content-right">
                            <h5 className="fail-message"><FormattedMessage id="Please verify your email to receive latest update." /></h5>
                            <FormattedMessage id={messageId} values={{ br: <br />, mailto: <span className="info-text">{email}</span>, clickHere: <a className="info-text pl-none" style={{ textDecoration: "underline" }} onClick={() => { self.resendConfirmEmail() }}><span><FormattedMessage id="Click here" /></span></a> }} />
                        </div>

                    </Collapse>
                </div>
            </div>
        )
    }
}
export default injectIntl(observer(VerifyEmailMessage))
