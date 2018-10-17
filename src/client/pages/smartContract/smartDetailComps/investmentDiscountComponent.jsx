import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import SocketService from "../../../network/SocketService";
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, Alert } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, Progress } from '../../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { Url, Common } from '../../../commons/consts/config';
import { browserHistory } from "react-router";
import TransactionStatus from "./_transactionStatus"

import IcoTokenChart from "../smartDetailComps/icoToken";
import Web3 from 'web3'



class InvestmentDiscountComponent extends Component {
    constructor(props) {
        super(props);
        console.log(props.contract)
        this.state = {
            investmentDiscountData: null,
            investmentDiscountContract: props.contract || null
        }
    }

    handleCreateInvestmentDiscount() {
        browserHistory.push({
            pathname: "/" + Url.smartContract + "/create/investment-discount-contract/0"
        })
    };

    updateData(data) {
        var self = this
        const investmentDiscountData = {
            total: data.totalToken/100,
            decimal: 2,
            symbol: "Mozo",
            subHeading: "Distribution",
            distributionData: {
                data: [
                    {
                        label: "Holding",
                        percent: _.round((data.holding * 100 / (data.totalToken == 0 ? 1 : data.totalToken)), 2),
                        color: "#CA8959"
                    },
                    {
                        label: "Sold",
                        percent: _.round((data.sold * 100 / (data.totalToken == 0 ? 1 : data.totalToken)), 2),
                        color: "#0EACF4"
                    }
                ],
                endDate: data.endDate,
                startDate: data.startDate
            }
        }

        self.setState({
            investmentDiscountData: investmentDiscountData
        });
    }

    updateAddress(data) {
        var self = this
       
        if(data.txnStatus == "success") {
            localStorage.setItem("investmentDiscountToken", data.address)
        }

        self.setState({
            investmentDiscountContract: data
        });

    }

    componentDidMount() {
        var self = this

        this.socket = SocketService.investmentDiscountDistribution((body, JWR) => {
            self.updateData(body)
        }, (body, JWR) => {
            self.updateAddress(body)
        })
    }

    transferMozoSaleToken() {
        var web3 = new Web3()
        var { investmentDiscountContract, investmentDiscountData } = this.state
        browserHistory.push({
            pathname: "/" + Url.transferToken + "/to-investment-discount/ico-contract/" + investmentDiscountContract.address + "/" + web3.utils.utf8ToHex(investmentDiscountData.total.toString()) + "/0"
        });
    }

    reCreateContract() {
        var { contract } = this.props
        browserHistory.push({
            pathname: "/" + Url.smartContract + "/re-create/investment-discount-contract/" + contract.id
        });
    }

    componentWillUnmount() {
        if (this.socket.isConnected()) {
            this.socket.disconnect();
        }
    }


    render() {
        var self = this
        let { investmentDiscountData, investmentDiscountContract } = this.state;
        var { contract } = self.props

      
        return (

            <Row className="smart-contract-detail-block__has-border">
                {investmentDiscountContract && investmentDiscountContract.txnStatus == "success" ? (investmentDiscountData != null ? <Col xs={12}>
                    <h2 className="main-title"><FormattedMessage id="Investment Bonus" /></h2>
                    <p className="address-token"><strong>Address:</strong> <a target="_blank" href={Common.ethNetworkUrl + "/address/" + investmentDiscountContract.address}>{investmentDiscountContract.address}</a></p>
                    <ul className="number_detail">
                        <li><strong>Total:</strong>  <FormattedNumber
                            value={investmentDiscountData.total}
                            style='decimal'
                            minimumFractionDigits={0}
                            maximumFractionDigits={2}
                        /></li>
                        <li><strong>Decimal:</strong>2</li>
                        <li><strong>Symbol:</strong>SMZO</li>
                    </ul>
                    <hr />
                    <IcoTokenChart pieData={investmentDiscountData.distributionData} pieChartDescription={"Investment bonus distribution"}/>
                    <div>
                        <Button className="btn-in-chart btn-none-bg" color="info"
                            onClick={() => {
                                browserHistory.push({
                                    pathname: "/" + Url.setWhitelist + "/" + investmentDiscountContract.address
                                });
                            }}><FormattedMessage
                                id="Add to Whitelist" /></Button>
                        <Button className="btn-in-chart btn-none-bg" color="info" onClick={() => this.transferMozoSaleToken()}><FormattedMessage id="Transfer Mozo Sale Token" /></Button>
                        {/* <Button className="btn-in-chart btn-none-bg" color="info"
                            onClick={() => {
                                browserHistory.push({
                                    pathname: "/" + Url.contractAction + "/investment-discount-contract/stop-investment-bonus"
                                });
                            }}><FormattedMessage
                                id="Stop Investment Bonus" /></Button> */}
                        <Button className="btn-in-chart btn-none-bg" color="info"
                            onClick={() => {
                                browserHistory.push({
                                    pathname: "/" + Url.contractAction + "/investment-discount-contract/release-investment-bonus"
                                });
                            }}><FormattedMessage
                                id="Release Investment Bonus" /></Button>
                        {/* <Button className="btn-in-chart btn-none-bg" color="primary" onClick={(e) => this.handleCreateICO(e)}>Create Agency</Button> */}
                    </div>
                </Col> : <div></div>) :
                    <Col xs={12}>
                        <h2 className="main-title"><FormattedMessage id="Investment Bonus" /></h2> 
                        <TransactionStatus contract={investmentDiscountContract}  reCreateContractCallBack={()=>{this.reCreateContract()}} />
                    </Col>}
            </Row>)
    }
}

export default injectIntl(observer(InvestmentDiscountComponent))