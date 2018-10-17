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



class RefarralContractComponent extends Component {
    constructor(props) {
        super(props);
        console.log(props.contract)
        this.state = {
            icoTokenData: null,
            icoContract: props.contract || null,
            showIVCreate: false
        }
    }

    handleCreateInvestmentDiscount() {
        browserHistory.push({
            pathname: "/" + Url.smartContract + "/create/investment-discount-contract/0"
        })
    };

    updateData(data) {
        var self = this
        const icoTokenData = {
            total: data.totalToken,
            decimal: 2,
            symbol: "Mozo",
            subHeading: "Distribution",
            distributionData: {
                data: [
                    {
                        label: "Founder",
                        percent: _.round((data.founderToken * 100 / data.totalToken), 2),
                        color: "#CA8959"
                    },
                    {
                        label: "Investment Bonus",
                        percent: _.round((data.investmentDiscountToken * 100 / data.totalToken), 2),
                        color: "#0EACF4"
                    },
                    {
                        label: "Sold",
                        percent: _.round((data.sold * 100 / data.totalToken), 2),
                        color: "#6DC183"
                    },
                    {
                        label: "Referral",
                        percent: _.round((data.referralToken * 100 / data.totalToken), 2),
                        color: "#FFFFFF"
                    }
                ],
                endBonusOn: data.presaleTimelineEndDate,
                endDate: data.icoEndDate,
                startDate: data.icoStartDate
            }
        }

        self.setState({
            icoTokenData: icoTokenData
        });
    }

    updateAddress(data) {
        var self = this
        // var address = <span className="warning-message"><FormattedMessage id="Waiting for confirmation" /> </span>
        // if (data.txnStatus == "success") {
        //     address = <a target="_blank" href={Common.ethNetworkUrl + "/address/" + data.address}>{data.address}</a>
        // } else if (data.txnStatus == "failed") {
        //     address = <span className="fail-message"><FormattedMessage id="Create a smart contract failed. Please re-create it." /></span>
        // }
        if(data.txnStatus != self.state.icoContract.txnStatus){
            if(data.txnStatus == "success") {
                localStorage.setItem("mozoSaleToken", data.address)
            }
    
            self.setState({
                icoContract: data
            });
        }
    }

    componentDidMount() {
        var self = this

        this.io = SocketService.icoTokenDistribution((body, JWR) => {
            console.log(body)
            self.updateData(body)
        }, (body, JWR) => {
            self.updateAddress(body)
        }
        )
    }

    transferMozoToken() {
        var web3 = new Web3()
        var { icoContract, icoTokenData } = this.state
        browserHistory.push({
            pathname: "/" + Url.transferToken + "/to-mozo-sale-token/mozo-token-contract/" + icoContract.address + "/" + web3.utils.utf8ToHex(icoTokenData.total.toString()) + "/0"
        });
    }

    reCreateContract() {
        var { contract } = this.props
        browserHistory.push({
            pathname: "/" + Url.smartContract + "/re-create/ico-contract/" + contract.id
        });
    }

    componentWillUnmount() {
        // if (this.io.socket.isConnected()) {
        //     this.io.socket.disconnect();
        // }
    }


    render() {
        var self = this
        let { icoTokenData, icoContract, showIVCreate} = this.state;
        var { contract } = self.props
        
        return (

            <Row className="smart-contract-detail-block__has-border">
                {icoContract && icoContract.txnStatus == "success" ? (icoTokenData != null ? <Col xs={12}>
                    <h2 className="main-title"><FormattedMessage id="ICO Tokens" /></h2>
                    <p className="address-token"><strong>Address:</strong> <a target="_blank" href={Common.ethNetworkUrl + "/address/" + icoContract.address}>{icoContract.address}</a></p>
                    <ul className="number_detail">
                        <li><strong>Total:</strong>  <FormattedNumber
                            value={icoTokenData.total}
                            style='decimal'
                            minimumFractionDigits={0}
                            maximumFractionDigits={2}
                        /></li>
                        <li><strong>Decimal:</strong>2</li>
                        <li><strong>Symbol:</strong>MOZO</li>
                    </ul>
                    <hr />
                    <IcoTokenChart pieData={icoTokenData.distributionData} pieChartDescription={"Mozo token distribution before ICO ending"} />
                    <div>
                        <Button className="btn-in-chart" color="primary" onClick={() => this.transferMozoToken()}><FormattedMessage id="Transfer Mozo Token" /></Button>
                       {showIVCreate && <Button className="btn-in-chart" color="primary" onClick={() => this.handleCreateInvestmentDiscount()}><FormattedMessage id="Create Invesment Discount" /></Button>} 
                        {/* <Button className="btn-in-chart" color="primary" onClick={(e) => this.handleCreateICO(e)}>Create Agency</Button> */}
                    </div>
                </Col> : <div></div>) :
                    <Col xs={12}>
                        <h2 className="main-title"><FormattedMessage id="ICO Tokens" /></h2>
                        <TransactionStatus contract={icoContract}  reCreateContractCallBack={()=>{this.reCreateContract()}} />
                    </Col>}
            </Row>)
    }
}

export default injectIntl(observer(RefarralContractComponent))