import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { injectIntl, FormattedMessage, intlShape, FormattedNumber } from 'react-intl';
import { Fade, Container, Col, Row, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, TabContent, TabPane, ListGroup, ListGroupItem, Popover, DropdownToggle, Dropdown, NavItem, Nav, Alert, NavLink } from 'reactstrap';
import { TextField, CollapseGroup, Icon, Table, Checkbox } from '../../components'

import { Common } from '../../commons/consts/config';
import QRCode from 'qrcode-react'
import copy from 'copy-to-clipboard';
import { FindValueSubscriber } from "rxjs/operators/find";
import CountDownCrowdsale from './_countDownCrowdsale';
import moment from 'moment'

const InvestorBonusModel = {
    fields: {
        bonusValue: {
            value: 0,
            type: 'text',
            label: 'Bonus for Investor',
            placeholder: 'Enter % bonus for Investor',
            rules: 'required|numeric|max:8|min:0',
            options: {
                validateOnChange: true,
            }
        }
    },

};

const CalculateToolModel = {
    fields: {
        investorNumber: {
            value: 5,
            type: 'text',
            label: 'No. Investors Invited',
            placeholder: '',
            rules: 'integer',
            options: {
                validateOnChange: true,
            }
        },
        tokenNumber: {
            value: 10000,
            type: 'text',
            label: 'Average Tokens Bought',
            placeholder: '',
            rules: 'numeric',
            options: {
                validateOnChange: true,
            }
        },
        commissionNumber: {
            value: 0,
            type: 'text',
            label: 'Commission',
            placeholder: '',
            rules: 'numeric',
            options: {
                validateOnChange: true,
            }
        }
    },

};

class Referral extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tooltipCopyRefOpen: false,
            referralValue: 0,
            currencyList: [],
            referralProgramId: null,
            isAdvance: false,
            hardCap: 0,
            softCap: 0,
            estCap: 0,
            icoIsOpen: true,
            bonusUSDEstimation: 0
        }

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
                name: <span><FormattedMessage id="You will get (%)" /><br />
                    <small><FormattedMessage id="(Package bonus)" /></small>
                </span>,
                mapData: "agencyPercent",
                style: { textAlign: "center" },
                binding: (data) => {
                    return <b className="primary-text"><FormattedNumber
                        value={data.agencyPercent}
                        style='decimal'
                        minimumFractionDigits={0}
                        maximumFractionDigits={1}
                    />%</b>
                }
            }
        ]

        this.bonusListCol2 = [
            {
                name: <FormattedMessage id="Total sold tokens" />,
                mapData: "total",
                style: { width: "30%" },
                binding: (data) => {
                    return <span>{data.total}</span>
                }
            },
            {
                name: <span><FormattedMessage id="Package Bonus (%)" /><br />
                    <small><FormattedMessage id="(Investor bonus + Referrer bonus)" /></small>
                </span>,
                mapData: "bonusPercent",
                style: { width: "30%", textAlign: "center" },
                binding: (data) => {
                    return <span>{data.bonusPercent}%</span>
                }
            },
            {
                name: <span><FormattedMessage id="You will get (%)" /><br />
                    <small><FormattedMessage id="(Package bonus - Investor bonus)" /></small>
                </span>,
                mapData: "agencyPercent",
                style: { textAlign: "center" },
                binding: (data) => {
                    return <b className="primary-text"><FormattedNumber
                        value={data.agencyPercent}
                        style='decimal'
                        minimumFractionDigits={0}
                        maximumFractionDigits={1}
                    />%</b>
                }
            }
        ]

        this.commissionListCol = [
            {
                name: <FormattedMessage id="Transaction" />,
                mapData: "investedToken",
                style: { width: "20%" },
                binding: (data, index) => {
                    return <span><FormattedNumber
                        value={data.investedToken / 100}
                        style='decimal'
                        minimumFractionDigits={0}
                        maximumFractionDigits={2}
                    /> MOZO</span>
                }
            },
            {
                name: <FormattedMessage id="Email" />,
                mapData: "email",
                style: { textAlign: "center", width: "50%" },
                binding: (data, index) => {
                    return <span>{data.hiddenEmail}</span>
                }
            },
            {
                name: <FormattedMessage id="Date" />,
                mapData: "createdAt",
                style: { textAlign: "center", width: "30%" },
                binding: (data, index) => {
                    return <span>{this.getTimeAgo(data.createdAt)}</span>
                }
            }
        ]

        this.investorListCol = [
            {
                name: <FormattedMessage id="NO." />,
                mapData: "total",
                style: { width: "20%" },
                binding: (data, index) => {
                    return <span>{index + 1}</span>
                }
            },
            {
                name: <FormattedMessage id="Email" />,
                mapData: "email",
                style: { textAlign: "center", width: "50%" },
                binding: (data, index) => {
                    return <span>{data.hiddenEmail}</span>
                }
            },
            {
                name: <FormattedMessage id="Date" />,
                mapData: "createdAt",
                style: { textAlign: "center", width: "30%" },
                binding: (data, index) => {
                    return <span>{this.getTimeAgo(data.createdAt)}</span>
                }
            }
        ]
    }

    getTimeAgo(date) {
        var timeNumber = parseInt((moment().format('x') - date) / 1000)
        var textTime = ""
        if (timeNumber < 60) {
            textTime = <FormattedMessage id="Second Ago" values={{ value: parseInt(timeNumber), s: parseInt(timeNumber) > 1 ? "s" : "" }} />
        } else if (timeNumber / 60 < 60) {
            textTime = <FormattedMessage id="Minute Ago" values={{ value: parseInt(timeNumber / 60), s: parseInt(timeNumber / 60) > 1 ? "s" : "" }} />
        } else if (timeNumber / (60 * 60) < 24) {
            textTime = <FormattedMessage id="Hour Ago" values={{ value: parseInt(timeNumber / (60 * 60)), s: parseInt(timeNumber / (60 * 60)) > 1 ? "s" : "" }} />
        } else if (timeNumber / (60 * 60 * 24) < 2) {
            textTime = <FormattedMessage id="Day Ago" values={{ value: parseInt(timeNumber / (60 * 60 * 24)), s: parseInt(timeNumber / (60 * 60 * 24)) > 1 ? "s" : "" }} />
        } else {
            textTime = moment(date).format("MMM Do YYYY")
        }

        return textTime

    }

    initFormModel() {
        var self = this

        self.calculateForm = new FormModel({ ...CalculateToolModel }, { name: 'CalculateToolModel' })
        self.referralForm = new FormModel({ ...InvestorBonusModel }, { name: 'InvestorBonusModel' })

        self.referralForm.onSuccess = function (form) {
            var requestRef = () => {
                NetworkService.requestReferral(form.values().bonusValue).subscribe(
                    function onNext(response) {
                        var { updateReferralId } = self.props
                        self.props.notifyUpdate("Send request successfully.")
                        self.getReferralProgram(response.hashId)
                        updateReferralId(response.hashId)

                    },
                    function onError(e) {
                        //self.setState({ isMozoAddress: false })
                    },
                    function onCompleted() {

                    }
                )
            }

            if (self.state.isAdvance) {
                self.props.showModalWarning(form.values().bonusValue, () => {
                    requestRef()
                })
            } else {
                requestRef()
            }
        }

    }

    getReferralProgram(referralId) {
        var self = this
        NetworkService.checkReferralLink(referralId).subscribe(
            function onNext(response) {
                self.getCommission(response.rate)
                if (response.rate >= 0) {
                    var referralRate = parseFloat(response.rate)
                    self.setState({ referralValue: referralRate, referralProgramId: referralId })
                }
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    getCommission(rate)
    {   
        var commissionResult = 0
        rate = parseFloat(rate)/100
        var total = this.calculateForm.$("investorNumber").value * this.calculateForm.$("tokenNumber").value
        if(total <= 50000) {
            commissionResult = total * (0.1 - rate)
        } else if(total > 50000 && total <= 100000) {
            commissionResult = total * (0.12 - rate)
        } else if(total > 100000 && total <= 1000000) {
            commissionResult = total * (0.14 - rate)
        } else if(total > 1000000 && total <= 10000000) {
            commissionResult = total * (0.16 - rate)
        } else {
            commissionResult = total * (0.18 - rate)
        }

        this.calculateForm.$("commissionNumber").value = commissionResult.toFixed(2)

        this.setState({bonusUSDEstimation: (commissionResult * 0.09)})
    }

    


    componentDidMount() {
        var self = this

        var { userInfo, checkDate } = self.props

        if (userInfo.referralId) {
            self.getReferralProgram(userInfo.referralId)
        }

        self.getCommission(self.state.referralValue)

        self.referralForm.$('bonusValue').observe({
            key: 'value',
            call: data => {
                var referralValue = parseFloat(self.referralForm.$('bonusValue').value)
                referralValue = (referralValue || 0) < 0 ? 0 : (referralValue || 0)
                
                if(referralValue >= 0 && referralValue <= 8)
                {
                    self.getCommission(referralValue)
                    self.setState({ referralValue: referralValue })
                }
                
            },
        });

        self.calculateForm.$("investorNumber").observe({
            key: 'value',
            call: data => {

                self.getCommission(self.state.referralValue)
            },
        });

        self.calculateForm.$("tokenNumber").observe({
            key: 'value',
            call: data => {

                self.getCommission(self.state.referralValue)
            },
        });

        if (new Date(parseInt(checkDate["ico-start-date"]) * 1000) > new Date()) {
            self.setState({ icoIsOpen: false })
        }

        NetworkService.getDashboard().subscribe(
            function onNext(response) {
                if (response) {
                    // console.log(response);
                    self.setState({
                        hardCap: response.hardCap,
                        softCap: response.softCap,
                        estCap: response.estCapConfig == "" ? 0 : response.estCapConfig
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

    copyReferralLink(e) {
        e.preventDefault()
        var self = this
        var { referralProgramId } = self.state
        copy(window.location.origin + "/buy-token/" + referralProgramId)
        self.setState({ tooltipCopyRefOpen: true })

        var autoHide = setTimeout(() => {
            self.setState({ tooltipCopyRefOpen: false })
        }, 1000)

    }

    render() {
        var self = this
        var { userInfo, checkDate, investorData = null, commissionData = null } = self.props
        if (!userInfo) return false

        var { bonusUSDEstimation, referralProgramId, tooltipCopyRefOpen, bonusData, referralValue, icoIsOpen } = self.state

        var bonusData = [{
            total: "< 50K",
            bonusPercent: 10,
            agencyPercent: (10 - referralValue).toFixed(1)
        },
        {
            total: "50K - 100K",
            bonusPercent: 12,
            agencyPercent: (12 - referralValue).toFixed(1)
        },
        {
            total: "100K - 1M",
            bonusPercent: 14,
            agencyPercent: (14 - referralValue).toFixed(1)
        },
        {
            total: "1M - 10M",
            bonusPercent: 16,
            agencyPercent: (16 - referralValue).toFixed(1)
        },
        {
            total: ">= 10M",
            bonusPercent: 18,
            agencyPercent: (18 - referralValue).toFixed(1)
        }
        ]


        return (
            <div className="referral-zone">
                <CollapseGroup title={<span><i className="fas fa-users svg-icon"></i>&nbsp;&nbsp;&nbsp;{(self.state.isAdvance || referralValue > 0) ? <FormattedMessage id="Advance Referral Program" /> : <FormattedMessage id="Referral Program" />}</span>}>
                    {(!_.isEmpty(userInfo["receiveAddress"])) ? <FormGroup>
                        {!_.isEmpty(referralProgramId) ? <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <label><FormattedMessage id="Your Referral Link:" /></label>
                                    <Row>
                                        <Col xs="12" sm="6" className="pr-none">
                                            <div className="form-control link-box">
                                                <span className="info-text link">{window.location.origin + "/buy-token/" + referralProgramId}</span>
                                            </div>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <Button color="info" id="copyReferralLink"
                                                onClick={(e) => self.copyReferralLink(e)} ><FormattedMessage id="Copy" /></Button>
                                            <Popover placement="bottom" isOpen={tooltipCopyRefOpen} target="copyReferralLink" >
                                                <FormattedMessage id="Copied" />
                                            </Popover>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Col>
                            <Col xs="12">
                                <FormGroup>
                                    <Nav className="social-links">
                                        <NavItem style={{ padding: "5px 10px 5px 0", fontWeight: '600' }}>
                                            <FormattedMessage id="Support" />:
                                        </NavItem>
                                        <NavItem>
                                            <NavLink target="_blank" href="https://t.me/mozotoken"><span className="svg-icon-container"><Icon name="telegram" /></span></NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink target="_blank" href="https://bitcointalk.org/index.php?topic=4169993.msg38256433#msg38256433"><span className="svg-icon-container"><Icon name="bitcointalk" /></span></NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className="info-text" target="_blank" href="http://bit.ly/2NOhLAH"><span className="svg-icon-container"><Icon name="list" /></span> <FormattedMessage id="2,000+ Crypto Communities" /></NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className="info-text" target="_blank" href="http://bit.ly/2uwuJKg"><span className="svg-icon-container"><Icon name="picture" /></span> <FormattedMessage id="Marketing Banners" /></NavLink>
                                        </NavItem>
                                    </Nav>
                                </FormGroup>
                            </Col>
                            <Col style={{ maxWidth: "170px" }}>
                                <FormGroup className="qrcode-container"><QRCode value={window.location.origin + "/buy-token/" + referralProgramId} /></FormGroup>
                            </Col>
                            <Col>
                                <FormattedMessage id="Send the above link to your friends to earn commission ..." values={{ br: <br /> }} />
                                <br /><br />
                                <span className="fail-message"><FormattedMessage id="WARNING: Spammers will be suspended!" /></span>
                            </Col>
                        </Row> : <Row>
                                <Col xs="12">
                                    {/* <Row>
                                        <Col xs="12">
                                            <FormattedMessage id="Enter bonus for Investor" />:<br />
                                            <small><FormattedMessage id="Note: Once you have set your share bonus, you can not change it later." /></small>
                                        </Col>
                                    </Row> */}
                                    <Row className="mt-sm">
                                        <Col style={{ maxWidth: "55px" }} className="pr-none">
                                            <Label check className={"advance-checkbox form-control " + (self.state.isAdvance ? "checked" : "")}>
                                                <Input type="checkbox" onChange={() => {
                                                    if (self.state.isAdvance) {
                                                        self.referralForm.reset()
                                                        self.setState({ isAdvance: !self.state.isAdvance, referralValue: 0 })
                                                    } else {
                                                        self.setState({ isAdvance: !self.state.isAdvance })
                                                    }

                                                }} />
                                                <span><i className="fas fa-cog"></i></span>
                                            </Label>
                                        </Col>
                                        <Col xs="4" className={"pr-none animation-col " + ((!self.state.isAdvance ? "un-checked" : ""))}>
                                            <TextField hidelabel={true} append={"%"} field={self.referralForm.$("bonusValue")} />
                                        </Col>
                                        <Col>
                                            <Button className="min-w-md" color="info"
                                                onClick={self.referralForm.onSubmit.bind(this)} ><FormattedMessage id="Get Referral Link" /></Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>}

                        <Row>
                            <Col xs="12">
                                <Collapse isOpen={self.state.isAdvance || referralValue > 0}>
                                    <FormattedMessage id="Investor join and invest through your referral..." values={{ br: <br />, bonusValue: <b className="primary-text">{referralValue}%</b> }} />

                                </Collapse>
                                <br />
                            </Col>
                            <Col xs="12">
                                <FormGroup>
                                    <FormattedMessage id="Referral bonus is calculated as below:" />
                                </FormGroup>
                            </Col>
                            <Col xs="12">
                                <Table tableData={bonusData} colData={(self.state.isAdvance || (!_.isEmpty(referralProgramId) && referralValue != 0)) ? self.bonusListCol2 : self.bonusListCol} />
                            </Col>
                            {!icoIsOpen && <Col xs="12">
                                <FormGroup>
                                    <CountDownCrowdsale endCountDown={() => {
                                        self.setState({ icoIsOpen: true })
                                    }} icoStartDate={checkDate["ico-start-date"]} hardCap={parseInt(this.state.hardCap)} softCap={parseInt(this.state.softCap)} estCap={parseInt(this.state.estCap)} />
                                </FormGroup>
                            </Col>}
                            {investorData && <Col className={"mt-md " + (!icoIsOpen ? "disabled-steps" : "")} xs="12">
                                <FormGroup>
                                    <h5><label>Latest Transaction History</label></h5>
                                    <Table className={"table-body-scroll"} tableData={commissionData.data} colData={self.commissionListCol} />
                                </FormGroup>
                            </Col>}
                            <Col className="mt-md" xs="12"><FormGroup>
                                <h5><label>Commission Value Estimate</label></h5>
                                <Alert style={{ backgroundColor: "#414141" }} color="secondary">
                                    <Row>
                                        <Col xs="12" sm="4">
                                            <TextField className="prepend-none" prepend={<i className="fas fa-user"></i>} field={self.calculateForm.$("investorNumber")} />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <TextField thousandSeparator={true} className="prepend-none" prepend={<span className="svg-icon-container"><Icon name="mozo" className="stroke icon-circle primary" /></span>} field={self.calculateForm.$("tokenNumber")} />
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <TextField thousandSeparator={true} disabled className="prepend-none" append={<span className="secondary-text"><span style={{position: "relative", top: "4px"}}>~</span>$<FormattedNumber
                                                value={bonusUSDEstimation}
                                                style='decimal'
                                                minimumFractionDigits={0}
                                                maximumFractionDigits={2}
                                            /></span>} prepend={<span className="svg-icon-container"><Icon name="mozo" className="stroke icon-circle primary" /></span>} field={self.calculateForm.$("commissionNumber")} />
                                        </Col>
                                    </Row>
                                </Alert>
                            </FormGroup>
                            </Col>
                            {investorData && <Col className="mt-md" xs="12">
                                <FormGroup>
                                    <h5><label>Investors Joined ({investorData.total})</label></h5>
                                    <Table className={"table-body-scroll"} tableData={investorData.data} colData={self.investorListCol} />
                                </FormGroup>
                            </Col>}
                        </Row>
                    </FormGroup> : <div>
                            <FormattedMessage id="Please enter your  ETH Wallet Address first" />
                        </div>
                    }
                </CollapseGroup>
            </div>
        )
    }

}


Referral.propTypes = {
    intl: intlShape.isRequired,
    userInfo: PropTypes.object,
    checkDate: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        checkDate: state.checkDate,
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(Referral)))
