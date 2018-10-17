import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import Web3 from 'web3'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage, intlShape, FormattedNumber } from 'react-intl';
import { Tooltip, Container, Col, Row, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, TabContent, TabPane, ListGroup, ListGroupItem, Popover, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Alert, NavLink } from 'reactstrap';
import { TextField, DatePicker, Select, WalletOption, CollapseGroup, Icon, Table, CountDown } from '../../components'

import { ToastContainer, toast } from 'react-toastify'
import { Common } from '../../commons/consts/config';
import { browserHistory } from "react-router";
import Referral from '../../layouts/share/_referral';
import ETHAddress from "../../layouts/share/_ethAddress"
import NumberBlock from "../../layouts/share/_numberBlock"
import NetworkService from "../../network/NetworkService"
import { setUserInfo } from '../../actions'
import CountDownCrowdsale from '../../layouts/share/_countDownCrowdsale';

const CloseButton = ({ YouCanPassAnyProps, closeToast }) => (
    <span onClick={closeToast}>×&nbsp;</span>
);

class ReferralUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            savedEth: true,
            referralId: props.userInfo ? props.userInfo.referralId : "",
            referralBonus: 0,
            investorsJoined: 0,
            referralData: null,
            tooltipOpen: false
        }
    }

    componentDidMount() {
        var self = this;


        //self.checkICODay()

        var { userInfo, showRefrralUserModal } = self.props

        if (!userInfo) {
            browserHistory.push({
                pathname: "/user/login"
            })
            return false
        }

        var userRef = JSON.parse(localStorage.getItem("userRef_" + userInfo.emailAddress))
        if (userRef) {
            var showRef = setTimeout(() => {
                showRefrralUserModal(userRef.emailAddress, userRef.rate)
                clearTimeout(showRef)
            }, 300)
        }

        NetworkService.getReferralDashboard().subscribe(
            function onNext(response) {
                if (response) {
                    self.setState({
                        referralData: response,
                        referralBonus: response.bonusCommission || 0,
                        investorsJoined: response.investors ? response.investors.total : 0
                    })
                }
            },
            function onError(e) {
                //self.setState({ isMozoAddress: false })
            },
            function onCompleted() {

            }
        )



    }

    formatNumber(intl, value) {
        return intl.formatNumber(value) || "";
    }

    notifyUpdate(text) {

        toast.info(<div>
            <FormattedMessage id={text} />
        </div>,
            {
                autoClose: true,
                closeButton: false,
                className: "top-info"
            })
    }

    toggleTooltip() {
        this.setState({
          tooltipOpen: !this.state.tooltipOpen
        });
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

    updateReferralId(referralId) {
        var self = this
        var { userInfo } = self.props
        userInfo.referralId = referralId
        self.props.dispatch(setUserInfo(userInfo))
        self.setState({ referralId: referralId })
    }

    render() {
        var self = this
        const { referralId, referralBonus, investorsJoined, referralData } = self.state
        var { userInfo, checkDate } = self.props
        if (!userInfo) return false

        var airdropToken = userInfo.airdrop ? parseInt(userInfo.airdrop["bounty"]) : 0

        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ width: "auto", minWidth: "250px" }} />
                <div>
                    {!_.isEmpty(referralId) && <Row>
                        <Col xs="12" sm="6">
                            <NumberBlock subText={(airdropToken / 100) > 0 ? <span><FormattedMessage id="Paid: value MOZO" values={{ value: airdropToken / 100 }} /> <i id="tooltipPaid" className="fas fa-info-circle"></i>
                                <Tooltip placement="top" isOpen={this.state.tooltipOpen} autohide={false} target="tooltipPaid" toggle={() => self.toggleTooltip()}>
                                Airdrop bonus is already transferred to your ETH wallet address.
                                </Tooltip>
                            </span>: null} value={referralBonus / 100} unit="MOZO" title={"Referal Bonus"} icon={<i className="fas fa-gift"></i>} />
                        </Col>
                        <Col xs="12" sm="6">
                            <NumberBlock value={investorsJoined} unit="" title={"Investors Joined"} icon={<Icon name="users" />} />

                        </Col>
                    </Row>}
                    <ETHAddress notifyUpdate={(text) => {
                        self.notifyUpdate(text)
                    }} />

                    {userInfo.origin == "referral" ? (referralData && <Referral commissionData={referralData.commissionTxn} investorData={referralData.investors} updateReferralId={(referralId) => { self.updateReferralId(referralId) }} showModalWarning={(value, callback) => {
                        self.props.showModalWarning(value, callback)
                    }} notifyUpdate={(text) => {
                        self.notifyUpdate(text)
                    }} /> ) : <CollapseGroup title={<span className="svg-icon-container"><Icon name="mozo" className="stroke" /><FormattedMessage id="Buy Token" /></span>}>
                            <FormGroup>
                                <div>
                                    <p><FormattedMessage id="Token Sale will start on" values={{ date: <b><FormattedMessage id="Token Sale start time" /></b> }} /></p><br />
                                    <div>
                                       {checkDate && <CountDown date={new Date(parseInt(checkDate["ico-start-date"]) * 1000)} />} 
                                    </div>
                                </div>
                                <Row>
                                    <Col>
                                        <p className="heading mt-lg"><FormattedMessage id="If you want to join our Pre-Sale, send us an email to" values={{ email: <a className="card-link" href={"mailto: presale@mozocoin.io"}>presale@mozocoin.io</a> }} /></p>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </CollapseGroup>}
                </div>
            </div>
        )
    }

}


ReferralUser.propTypes = {
    intl: intlShape.isRequired,
    web3: PropTypes.object,
    userInfo: PropTypes.object,
    checkDate: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        checkDate: state.checkDate,
        web3: state.web3 || new Web3(Web3.givenProvider),
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(ReferralUser)))
