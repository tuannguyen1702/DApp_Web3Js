import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { ETHWalletModel } from "./kycModel"
import { injectIntl, FormattedMessage, intlShape} from 'react-intl';
import { Container, Col, Row, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, TabContent, TabPane, ListGroup, ListGroupItem, Popover, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Alert, NavLink } from 'reactstrap';
import { TextField, CollapseGroup, Icon } from '../../components'

import { ToastContainer, toast } from 'react-toastify'
import { Common } from '../../commons/consts/config';
import { setUserInfo } from '../../actions'
import { browserHistory } from "react-router";
import VerifyEmailMessage from '../../layouts/share/_verifyEmail';
import Kyc from '../../layouts/share/_kyc';

const CloseButton = ({ YouCanPassAnyProps, closeToast }) => (
    <span onClick={closeToast}>×&nbsp;</span>
);

class KycInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMozoAddress: null,
            showAddress: false,
            contract: null,
            activeTab: "1",
            collapseETH1: true,
            tooltipCopyETHOpen: false,
            tooltipCopyRefOpen: false,
            tooltipCopyBTCOpen: false,
            rateConfig: null,
            savedEth: true,
            dropdownOpenCurrency: false,
            currencyName: "USD",
            showBTCAddress: true,
            referralValue: 0,
            currencyList: [],
            referralProgramId: null,
            bonus: {
                eth: 0,
                btc: 0,
                usd: 0
            }
        }

        this.currencyValue = 1

        this.initFormModel()

        this.bonusListCol = [
            {
                name: <FormattedMessage id="Total sold tokens" />,
                mapData: "total",
                style: { width: "30%" },
                binding: (data) => {
                    return <span>{data.total}</span>
                }
            },
            {
                name: <FormattedMessage id="Package Bonus (%)" />,
                mapData: "bonusPercent",
                style: { width: "30%", textAlign: "center" },
                binding: (data) => {
                    return <span>{data.bonusPercent}%</span>
                }
            },
            {
                name: <FormattedMessage id="You will get (%)" />,
                mapData: "agencyPercent",
                style: { textAlign: "center" },
                binding: (data) => {
                    return <b className="primary-text">{data.agencyPercent}%</b>
                }
            }
        ]
    }

    initFormModel() {
        var self = this


        self.ethWalletForm = new FormModel({ ...ETHWalletModel }, { name: 'ETHWalletModel' })

        self.ethWalletForm.onSuccess = function (form) {
            NetworkService.updateETHAddress(form.values().ETHAddress).subscribe(
                function onNext(response) {
                    self.props.dispatch(setUserInfo(response))
                    self.setState({ savedEth: true })
                    self.notifyUpdate("Update successfully.")
                },
                function onError(e) {
                    //self.setState({ isMozoAddress: false })
                },
                function onCompleted() {

                }
            )
        }

    }

    changeState(objState) {
        this.setState(objState)
    }


    componentDidMount() {
        var self = this

        var { userInfo, locale } = self.props

        if (!userInfo) {
            browserHistory.push({
                pathname: "/user/login"
            })
            return false
        }

        if (!_.isEmpty(userInfo["receiveAddress"])) {
            self.ethWalletForm.$("ETHAddress").value = userInfo["receiveAddress"]
            self.setState({ savedEth: true })
        } else {
            self.setState({ savedEth: false })
        }
    }

    formatNumber(intl, value) {
        return intl.formatNumber(value) || "";
    }

    translate(intl, idM) {
        var message = idM
        const text = message ? intl.formatMessage({ id: message }) : '';
        return text;
    }

    notifyUpdate(text) {
        var self = this
        var textTranslated = self.translate(self.props.intl, text)
        toast.info(<div>
            {textTranslated}
        </div>,
            {
                autoClose: true,
                closeButton: false,
                className: "top-info"
            })
    }

    notify(hash) {

        toast.info(<div className="toast-content">
            <FormattedMessage id="Your TX has been broadcast to the network" values={{ br: <br />, hash: hash }} />
            <br /><br /><a target="_blank" href={Common.ethNetworkUrl + "/tx/" + hash}><i><FormattedMessage id="View your transaction" /></i></a>
        </div>,
            {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: false,
                closeButton: <CloseButton YouCanPassAnyProps="close" />,
                className: "bottom-info"
            })
    }

    render() {
        var self = this
        var { userInfo } = self.props
        if (!userInfo) return false

        var { savedEth } = self.state

        const renderYourETHWallet = () => {
            return <CollapseGroup collapseShow={_.isEmpty(userInfo["receiveAddress"])} title={<span className="svg-icon-container"><Icon name="eth" /><FormattedMessage id="Your ETH Wallet Address" />&nbsp; {!_.isEmpty(userInfo["receiveAddress"]) && <i className="fas fa-check success-message"></i>}</span>}>
                <Row>
                    <Col xs="12">
                        <p>
                            <FormattedMessage id="Insert your personal Ethereum wallet address..." />
                        </p>
                    </Col>
                    <Col xs="12" sm="6">
                        <TextField hidelabel={true} field={self.ethWalletForm.$("ETHAddress")} />
                    </Col>
                    <Col xs="12" sm="6">
                        <Button className="min-w-md" color="info"
                            onClick={self.ethWalletForm.onSubmit.bind(this)} ><FormattedMessage id={savedEth ? "Update" : "Save"} /></Button>
                    </Col>
                </Row>
            </CollapseGroup>
        }

        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ width: "auto", minWidth: "250px" }} />
                {/* {userInfo.emailStatus == "unconfirmed" &&
                    (userInfo.origin == "referral" ? <VerifyEmailMessage messageId="We just send an email to ...referral program" email={userInfo.emailAddress} /> :
                        <VerifyEmailMessage messageId="We just send an email to ...crowdsale" email={userInfo.emailAddress} />)
                } */}
                <div>
                    {renderYourETHWallet()}
                    <Kyc collapseShow={true} />
                    {/* <CollapseGroup title={<span className="svg-icon-container"><Icon name="kyc" className="stroke" /><FormattedMessage id="AML/KYC" /></span>}>
                        <FormGroup>
                            <div id="idensic"></div>
                        </FormGroup>
                    </CollapseGroup> */}
                </div>
            </div>
        )
    }

}


KycInfo.propTypes = {
    intl: intlShape.isRequired,
    locale: PropTypes.object,
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        locale: state.locale,
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(KycInfo)))
