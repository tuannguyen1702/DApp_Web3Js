import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import decoLine from "../../images/deco-line.png";
import arrowGradient from "../../images/Arrow-gradien.png";
import logo from "../../images/logo.png";
import { Container, Row, Col, Table, FormGroup, Input, Label } from 'reactstrap';
import { Icon } from '../../components';

import { TextField } from '../../components';
import FormModel from '../../commons/forms/_.extend';
import { observer } from 'mobx-react';
import { Url, Common, Origin } from '../../commons/consts/config';
import NetworkService from "../../network/NetworkService"

import { IntlProvider, addLocaleData, FormattedNumber } from "react-intl";
import zhLocaleData from 'react-intl/locale-data/zh'
import enLocaleData from 'react-intl/locale-data/en'
import koLocaleData from 'react-intl/locale-data/ko'
import zh_CNMessages from '../../langs/zh-CN.json';
import zh_TWMessages from '../../langs/zh-TW.json';
import enMessages from '../../langs/en-US.json';
import koMessages from '../../langs/ko-KR.json';
import ICOStopped from "../../layouts/share/_icoStopped"


addLocaleData(zhLocaleData)
addLocaleData(enLocaleData)
addLocaleData(koLocaleData)

const messages = {
    zh_tw: zh_TWMessages,
    zh_cn: zh_CNMessages,
    ko: koMessages,
    en: enMessages
}

const ReferralCalcModel = {
    fields: {
        numberReferral: {
            value: '5',
            type: 'number',
            label: 'Number of referrers invited per day',
            placeholder: 'Input number',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        numberTokens: {
            value: '10000',
            type: 'number',
            label: 'Average tokens sold per referrer',
            placeholder: 'Input number',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        numberTokensUSD: {
            value: '',
            type: 'number',
            label: 'Average tokens sold per referrer',
            placeholder: 'Input number',
            rules: '',
            options: {
                validateOnChange: true,
            },
        }
    }
}

class WelcomeReferral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: props.locale ? props.locale.code : "en",
            langFile: props.locale ? props.locale.code : "en",
            langName: props.locale ? props.locale.text : "ENG",
            showResultCalc: false,
            resultCls: 'result-calc',
            resultDays: [{}, {}, {}, {}, {}, {}, {}],
            usdPerTokens: 10000,
            loading: true
        };
        this.initFormModel();
        this.handleSubmitCalc = this.handleSubmitCalc.bind(this);
    }

    initFormModel() {
        let self = this;
        this.form = new FormModel({ ...ReferralCalcModel }, { name: 'ReferralSimulator' });
        this.setState({
            usdPerTokens: self.form.values().numberTokens
        });
        this.form.onSuccess = function (form) {
            var data = {
                numberRef: parseInt(form.values().numberReferral),
                numberTokens: parseInt(form.values().numberTokens)
            }
            self.handleSubmitCalc(data);
        }
    }

    getPercentBonus(tokens) {
        if (tokens < 50000) {
            return 10;
        } else if (tokens < 100000) {
            return 12;
        } else if (tokens < 1000000) {
            return 14;
        } else if (tokens < 10000000) {
            return 16;
        } else {
            return 18;
        }
    }

    handleChangeTokens(e) {
        console.log(e);
    }

    handleSubmitCalc(data) {
        const usd = 0.09;
        let index = 1;
        let calculated = this.state.resultDays.map((day) => {
            let cal_obj = {
                tokensSold: 0,
                bonusPercent: 0,
                bonusToken: 0,
                income: 0
            };
            cal_obj.tokensSold = data.numberRef * data.numberTokens * index;
            cal_obj.bonusPercent = this.getPercentBonus(cal_obj.tokensSold);
            cal_obj.bonusToken = cal_obj.tokensSold * (cal_obj.bonusPercent / 100);
            cal_obj.income = cal_obj.bonusToken * usd;
            index++;
            return cal_obj;
        });

        this.setState({
            showResultCalc: true,
            resultDays: calculated
        }, function () {
            let _self = this;
            setTimeout(function () {
                _self.setState({
                    resultCls: 'result-calc shown'
                })
            }, 200)
            setTimeout(function () {
                let elmnt = document.getElementById("content");
                elmnt.scrollIntoView();
            }, 400)
        });
    }

    changeUserOrigin() {
        NetworkService.changeUserOrigin(Origin.referral).subscribe(
            function onNext(response) {
                window.location = "/referral/info";
            },
            function onError(e) {
                self.userForm.$("password").invalidate("The Password is incorrect.")
            },
            function onCompleted() {

            }
        )
    }

    joinReferral() {
        var self = this
        const { userInfo } = self.props
        if (localStorage.getItem('token')) {
            if (userInfo.origin == Origin.referral) {
                window.location = "/referral/info";
            } else {
                if (userInfo.role == "user") {
                    self.changeUserOrigin()
                } else {
                    window.location = "/login";
                }
            }
        } else {
            window.location = "/referral/login";
        }
    }

    componentDidMount() {
        let self = this;
        const { userInfo } = self.props
        if (localStorage.getItem('token')) {
            if (userInfo.origin == Origin.referral) {
                window.location = "/referral/info";
                return false
            } else {
                self.setState({ loading: false })
            }
        } else {
            self.setState({ loading: false })
        }

        self.form.$('numberTokens').observe({
            key: 'value',
            call: data => {
                // console.log(data.field.value);
                self.setState({
                    usdPerTokens: data.field.value
                })
            },
        });
    }

    render() {
        let self = this;
        const { loading } = self.state
        return (
            <IntlProvider locale={this.state.locale} messages={messages[this.state.langFile]}>
                <div className="master-page referral">
                    {!loading ?
                        <Container fluid={true}>
                            <Row>
                                <Col xs="4">
                                    <div className="header">
                                        <h1 className="logo-container">
                                            <a target="_blank" href="https://mozocoin.io/"><img src={logo} className="logo" alt="mozo" /></a>
                                        </h1>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="main-content" style={{marginTop: 100}}>
                                <Col sm={12}>
                                    <ICOStopped />
                                </Col>
                            </Row>
                            {/* <Row className="main-content--fluid">
                            <Col sm={12}>
                                <div className="row banner-referral">
                                    <div className="main-content">
                                        <Row>
                                            <Col>
                                                <div className="banner_bg">

                                                </div>
                                                <div className="banner_content">
                                                    <h4>MOZO affiliate program</h4>
                                                    <h3>You can earn up to <span>18%</span> commission</h3>
                                                    <img src={decoLine} alt="deco-line.png"/>
                                                    <div className="banner_steps--scrollable">
                                                        <ul className="banner_steps">
                                                            <li className="step1">
                                                                <div className="icon-wrapper"><span className="svg-icon-container"><Icon name="link" /></span></div>
                                                                <p className="bold">1. Get your link</p>
                                                                <p>Register to get the referral link</p>
                                                                <img src={arrowGradient} />
                                                            </li>
                                                            <li className="step2">
                                                                <div className="icon-wrapper"><span className="svg-icon-container"><Icon name="friends" /></span></div>
                                                                <p className="bold">2. Invite friends</p>
                                                                <p>Invite your friends with your referral link to get MOZO tokens everytime they invest in MOZO</p>
                                                                <img src={arrowGradient} />
                                                            </li>
                                                            <li className="step3">
                                                                <div className="icon-wrapper"><span className="svg-icon-container"><Icon name="reward" /></span></div>
                                                                <p className="bold">3. Get Rewards</p>
                                                                <p>Receive commission from all transactions of your referred friends</p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <a className="join-for-free-btn" onClick={() => self.joinReferral()}><span>Join for free</span></a>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className="row program-detail">
                                    <Row className="main-content">
                                        <Col sm={{ size: 8, offset: 2}}>
                                            <h4 className="heading-center">Commission Details</h4>
                                            <Table className="table--bonus table-bordered">
                                                <thead>
                                                <tr>
                                                    <th align="top">Total sold tokens</th>
                                                    <th align="top">Package Bonus (%)<p>(Investor bonus + Referrer bonus)</p></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <span className="svg-icon-container"><Icon name="mozo" /></span>&#60;50K
                                                    </td>
                                                    <td>10%</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="svg-icon-container"><Icon name="mozo" /></span>50K - 100K
                                                    </td>
                                                    <td>12%</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="svg-icon-container"><Icon name="mozo" /></span>100K - 1M
                                                    </td>
                                                    <td>14%</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span className="svg-icon-container"><Icon name="mozo" /></span>1M - 10M
                                                    </td>
                                                    <td>
                                                        16%
                                                    </td>
                                                </tr>
                                                <tr className="last-row">
                                                    <td>
                                                        <span className="svg-icon-container"><Icon name="mozo" /></span> >= 10M
                                                    </td>
                                                    <td>18%</td>
                                                </tr>
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="row simulate-calc-tool">
                                    <Col sm={12}>
                                        <div className="main-content">
                                            <h4 className="heading-center">Simulate Calculation</h4>
                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="main-content">
                                            <Row className="form-calc">
                                                <Col lg={4}>
                                                    <TextField field={self.form.$("numberReferral")} />
                                                </Col>
                                                <Col lg={4}>
                                                    <TextField field={self.form.$("numberTokens")} thousandSeparator={true} append={<span>~US$<FormattedNumber
                                                        value={self.state.usdPerTokens*0.09}
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></span>} />

                                                </Col>
                                                <Col lg={4}>
                                                    <button type="button" className="btn-blue" onClick={self.form.onSubmit.bind(this)}>Calculate My Income</button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    { this.state.showResultCalc && <Col id="content" sm={12} className={this.state.resultCls}>
                                        <div className="main-content">
                                            <Table responsive className="table-borderless">
                                                <thead>
                                                <tr>
                                                    <th>Day</th>
                                                    <th>Total Token Sold</th>
                                                    <th>Package Bonus %</th>
                                                    <th>Bonus Token</th>
                                                    <th>Your Income Equivalent</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr><td className="seperator" height="1" colSpan={5}></td></tr>
                                                <tr>
                                                    <td>Day 1</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[0].tokensSold }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>{ this.state.resultDays[0].bonusPercent }</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[0].bonusToken }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>US$<FormattedNumber
                                                        value={ this.state.resultDays[0].income }
                                                        style='decimal'
                                                        minimumFractionDigits={2}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                </tr>
                                                <tr><td className="seperator" height="1" colSpan={5}></td></tr>
                                                <tr>
                                                    <td>Day 2</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[1].tokensSold }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>{ this.state.resultDays[1].bonusPercent }</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[1].bonusToken }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>US$<FormattedNumber
                                                        value={ this.state.resultDays[1].income }
                                                        style='decimal'
                                                        minimumFractionDigits={2}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                </tr>
                                                <tr><td className="seperator" height="1" colSpan={5}></td></tr>
                                                <tr>
                                                    <td>Day 3</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[2].tokensSold }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>{ this.state.resultDays[2].bonusPercent }</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[2].bonusToken }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>US$<FormattedNumber
                                                        value={ this.state.resultDays[2].income }
                                                        style='decimal'
                                                        minimumFractionDigits={2}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                </tr>
                                                <tr><td className="seperator" height="1" colSpan={5}></td></tr>
                                                <tr>
                                                    <td>Day 4</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[3].tokensSold }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>{ this.state.resultDays[3].bonusPercent }</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[3].bonusToken }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>US$<FormattedNumber
                                                        value={ this.state.resultDays[3].income }
                                                        style='decimal'
                                                        minimumFractionDigits={2}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                </tr>
                                                <tr><td className="seperator" height="1" colSpan={5}></td></tr>
                                                <tr>
                                                    <td>Day 5</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[4].tokensSold }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>{ this.state.resultDays[4].bonusPercent }</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[4].bonusToken }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>US$<FormattedNumber
                                                        value={ this.state.resultDays[4].income }
                                                        style='decimal'
                                                        minimumFractionDigits={2}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                </tr>
                                                <tr><td className="seperator" height="1" colSpan={5}></td></tr>
                                                <tr>
                                                    <td>Day 6</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[5].tokensSold }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>{ this.state.resultDays[5].bonusPercent }</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[5].bonusToken }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>US$<FormattedNumber
                                                        value={ this.state.resultDays[5].income }
                                                        style='decimal'
                                                        minimumFractionDigits={2}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                </tr>
                                                <tr><td className="seperator" height="1" colSpan={5}></td></tr>
                                                <tr className="last-row">
                                                    <td>Day 7 (ICO ends)</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[6].tokensSold }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>{ this.state.resultDays[6].bonusPercent }</td>
                                                    <td><FormattedNumber
                                                        value={ this.state.resultDays[6].bonusToken }
                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                    <td>US$<FormattedNumber
                                                        value={ this.state.resultDays[6].income }
                                                        style='decimal'
                                                        minimumFractionDigits={2}
                                                        maximumFractionDigits={2}
                                                    /></td>
                                                </tr>
                                                <tr><td className="seperator" height="1" colSpan={5}></td></tr>
                                                </tbody>
                                            </Table>
                                            <div style={{textAlign: 'center'}}>
                                                <a className="join-for-free-btn" onClick={() => self.joinReferral()}><span>Join for free</span></a>
                                            </div>
                                        </div>
                                    </Col> }
                                </div>
                            </Col>
                        </Row>
                        <Row className="referral--footer"> 
                            <Col sm={12}>
                                <p style={{fontWeight: '600'}}>Follow us on:</p>
                                <ul className="social-links">
                                    <li>
                                        <a target="_blank" href="https://t.me/mozotoken"><span className="svg-icon-container"><Icon name="telegram" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://bitcointalk.org/index.php?topic=4169993.msg38256433#msg38256433"><span className="svg-icon-container"><Icon name="bitcointalk" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://twitter.com/MozoToken"><span className="svg-icon-container"><Icon name="twitter" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://medium.com/@mozotoken"><span className="svg-icon-container"><Icon name="medium" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://www.reddit.com/user/MozoToken/"><span className="svg-icon-container"><Icon name="reddit" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://www.facebook.com/Mozo-Token-2039854656295415/"><span className="svg-icon-container"><Icon name="facebook" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://www.linkedin.com/company/mozo-project/"><span className="svg-icon-container"><Icon name="linkedin" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://github.com/Biglabs/Mozo-SC"><span className="svg-icon-container"><Icon name="github" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://www.youtube.com/channel/UC8TfvRCXgYXVwoIIUDQp1sQ?view_as=subscriber"><span className="svg-icon-container"><Icon name="youtube" /></span></a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="mailto: mozocoin@mozocoin.io"><span className="svg-icon-container"><Icon name="email" /></span></a>
                                    </li>
                                </ul>
                            </Col>
                        </Row> */}
                        </Container>
                        : <div id="loader"></div>}
                </div>
            </IntlProvider>

        )
    }
}

WelcomeReferral.propTypes = {
    userInfo: PropTypes.object,
    locale: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
        locale: state.locale
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(WelcomeReferral);