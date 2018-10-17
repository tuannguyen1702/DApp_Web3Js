import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import SocketService from "../../network/SocketService"
import { BaseInfoModel, BankModel, EmailModel, PhoneModel } from "./dashboardModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Alert, Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, Progress } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import DashboardChart from '../../layouts/share/_dashboardChart'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import VerifyEmailMessage from "../../layouts/share/_verifyEmail";

import basicCoin from "../../images/icons/icon-dollar@2x.png";
import mCoin from "../../images/icons/icon-m@2x.png";
import ethereumCoin from "../../images/icons/icon-ethereum@2x.png";
import bitCoin from "../../images/icons/icon-bitcoin@2x.png";
import socketIOClient from "socket.io-client";

let interval;
class DashboardComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            btcCoin: 200,
            estCap: 0,
            ethCoin: 100,
            noOfBtc: 0,
            noOfEth: 0,
            noOfSoldTokens: 0,
            changeValues: false,
            dashboardData: null
        }
    }

    componentDidMount() {
        let self = this;
        this.socket = SocketService.dashboard(function (body, JWR) {
            console.log(body)
            // self.setState({
            //     estCap: body.estCap,
            //     noOfSoldTokens: body.noOfSoldTokens,
            //     btcCoin: body.btcCoin,
            //     ethCoin: body.ethCoin,
            //     noOfBtc: body.noOfBtc,
            //     noOfEth: body.noOfEth,
            //     totalETH: body.totalETH,
            //     totalBTC: body.totalBTC,
            //     totalToken: body.totalToken,
            //     hardCap: body.hardCap
            // });
            self.updateData(body)
        })
    }

    updateData(data) {
        var self = this
        var total = parseInt(data.totalToken)
        var usdOnToken = 0.0009

        var percentETH = (parseFloat(data.noOfEth) * parseFloat(data.ethCoin.priceUsd) / usdOnToken / total * 100).toFixed(1)
        var percentUSD = (parseFloat(data.noOfUsd) / usdOnToken / total * 100).toFixed(1)
        var percentBTC = (parseFloat(data.noOfBtc) * parseFloat(data.btcCoin.priceUsd) / usdOnToken / total * 100).toFixed(1)

        var minPercent = 10

        const dashboardData = {
            total: total / 100,
            btcCoin: data.btcCoin,
            ethCoin: data.ethCoin,
            leftTokens: data.noOfLeftTokens,
            data: [
                {
                    label: "Number Token Sold Value",
                    value: data.noOfSoldTokens / 100,
                    unitText: ""
                },
                {
                    label: "Number ETH",
                    value: data.noOfEth,
                    unitText: "ETH",
                    percent: percentETH < minPercent ? minPercent : percentETH
                },
                {
                    label: "Number USD",
                    value: data.noOfUsd,
                    unitText: "USD",
                    percent: percentUSD < minPercent ? minPercent : percentUSD
                },
                {
                    label: "Number BTC",
                    value: data.noOfBtc,
                    unitText: "BTC",
                    percent: percentBTC < minPercent ? minPercent : percentBTC
                },
                {
                    label: "Token Left",
                    value: parseInt(data.noOfLeftTokens) / 100,
                    unitText: "MOZO Tokens Left",
                    percent: parseInt(data.noOfLeftTokens) / total * 100 > 70 ? 70 : parseInt(data.noOfLeftTokens) / total * 100
                }
            ],
        };

        self.setState({ dashboardData: dashboardData })
    }

    componentWillUnmount() {
        if (this.socket.isConnected()) {
            this.socket.disconnect();
        }
    }

    render() {
        var self = this;
        var { userInfo } = self.props
        let { dashboardData, btcCoin, estCap, ethCoin, noOfBtc, noOfEth, noOfSoldTokens, totalBTC, totalETH, totalToken, hardCap } = this.state;
        console.log(userInfo.emailStatus)
        return (
            <div>
                <div>
                    <div className="main-title-container">
                        <Container fluid>
                            <Row>
                                <Col xs={12}>
                                    <h2 className="main-title"><FormattedMessage id="Dashboard" /></h2>
                                    {/* <p className="teaser">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
                                </Col>
                            </Row>
                            <Row className="mt-md">
                                <Col xs={12}>
                                    {dashboardData ? (dashboardData.total  > 0 ?<DashboardChart dashboardData={dashboardData} />: <Alert color="dark">
                                       <FormattedMessage id="No data" />
                                    </Alert>): <Alert color="dark">
                                       <FormattedMessage id="No data" />
                                    </Alert>}
                                    
                                    {/* <Progress multi>
                                        <Progress bar value="15">sadaMeh</Progress>
                                        <Progress bar color="success" value="30">sadaMeh</Progress>
                                        <Progress bar color="info" value="25">sadaMeh</Progress>
                                        <Progress bar color="warning" value="20">sadaMeh</Progress>
                                        <Progress bar color="danger" value="5">sadaMeh</Progress>
                                    </Progress> */}
                                    {/* <Progress value={noOfSoldTokens / totalToken * 100} maximumFractionDigits={0} more_detail={noOfSoldTokens} unit="MOZO" total_lb={"Total token"}
                                        total_num={totalToken} logo_coin={mCoin} color={"orange"} heading={"Number Token Sold"} />
                                    <hr />

                                    <Progress value={noOfEth / totalETH * 100} more_detail={noOfEth} maximumFractionDigits={4} unit="ETH" total_lb={"Maximum ETH"}
                                        total_num={totalETH} color={"light-grey"} logo_coin={ethereumCoin} heading={"ETH"} />
                                    <hr />

                                    <Progress value={noOfBtc / totalBTC * 100} more_detail={noOfBtc} maximumFractionDigits={4} unit="BTC" total_lb={"Maximum BTC"}
                                        total_num={totalBTC} logo_coin={bitCoin} heading={"BTC"} />
                                    <hr />

                                    <Progress color={"blue"} value={estCap / hardCap * 100} more_detail={estCap} unit="USD" total_lb={"Est USD"}
                                        total_num={hardCap} logo_coin={basicCoin} heading={"Est USD"} /> */}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>

        )
    }

}

DashboardComponent.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(DashboardComponent)))
