import React, {Component} from "react";
import _ from 'lodash'
import {connect} from 'react-redux'
import {observer} from 'mobx-react';
import SocketService from "../../../network/SocketService";
import {FormattedMessage, FormattedNumber, injectIntl} from 'react-intl';
import {Button, Col, Row} from 'reactstrap';
import {Common, Url} from '../../../commons/consts/config';
import {browserHistory} from "react-router";
import TransactionStatus from "./_transactionStatus"

import MozoTokenChart from "../smartDetailComps/mozoTokens";


class MozoTokenComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mozoTokens: null,
            mozoAddress: "",
            showICOCreate: false,
            mozoTokenData: null,
            mozoTokenContract: props.contract || null
        }

        // HANDLING
        this.handleCreateICO = this.handleCreateICO.bind(this);
    }

    handleCreateICO(e) {
        e.preventDefault();
        browserHistory.push({
            pathname: "/" + Url.smartContract + "/create/ico-contract/0"
        })
    };

    handleCreateInvestmentDiscount() {
        browserHistory.push({
            pathname: "/" + Url.smartContract + "/create/investment-discount-contract/0"
        })
    };

    updateData(data) {
        var self = this
        const mozoTokenData = {
            total: data.totalToken/100,
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
                        label: "Treasury",
                        percent: _.round((data.treasuryToken * 100 / data.totalToken), 2),
                        color: "#0EACF4"
                    },
                    {
                        label: "Sold",
                        percent: _.round((data.sold * 100 / data.totalToken), 2),
                        color: "#6DC183"
                    },
                    {
                        label: "Sales & Presale",
                        percent: _.round((data.ico * 100 / data.totalToken), 2),
                        color: "#FFFFFF"
                    }
                ],
            }
        };

        self.setState({
            mozoTokenData: mozoTokenData,
            mozoAddress: localStorage.getItem("mozoToken"),
            showICOCreate: localStorage.getItem("mozoSaleToken") ? false : true
        });
    }

    updateAddress(data) {
        var self = this

        if (data.txnStatus == "success") {
            localStorage.setItem("mozoToken", data.address)
        }

        self.setState({
            mozoTokenContract: data
        });

    }


    componentDidMount() {
        var self = this;
        this.socket = SocketService.mozoTokenDistribution((body, JWR) => {
            self.updateData(body)
        }, (body, JWR) => {
            self.updateAddress(body)
        })

    }

    componentWillUnmount() {
        if (this.socket.isConnected()) {
            this.socket.disconnect();
        }
    }

    transferMozoToken() {
        browserHistory.push({
            pathname: "/" + Url.transferToken + "/to-eth-address/mozo-token-contract/unknow-address/unknow-number/0"
        });
    }

    reCreateContract() {
        var {contract} = this.props
        browserHistory.push({
            pathname: "/" + Url.smartContract + "/re-create/mozo-token-contract/" + contract.id
        });
    }


    render() {
        var self = this
        let {mozoTokenData, mozoAddress, showICOCreate, mozoTokenContract} = this.state;

        return (
            <Row className="smart-contract-detail-block__has-border">

                {mozoTokenContract && mozoTokenContract.txnStatus == "success" ? (mozoTokenData != null ? <Col xs={12}>
                        <h2 className="main-title"><FormattedMessage id="Mozo Tokens"/></h2>
                        <p className="address-token"><strong>Address:</strong> <a target="_blank"
                                                                                  href={Common.ethNetworkUrl + "/address/" + mozoTokenContract.address}>{mozoTokenContract.address}</a>
                        </p>
                        <ul className="number_detail">
                            <li><strong>Total:</strong> <FormattedNumber
                                value={mozoTokenData.total}
                                style='decimal'
                                minimumFractionDigits={0}
                                maximumFractionDigits={2}
                            /></li>
                            <li><strong>Decimal:</strong>2</li>
                            <li><strong>Symbol:</strong>MOZO</li>
                        </ul>
                        <hr/>
                        <MozoTokenChart pieData={mozoTokenData.distributionData}/>
                        <div>
                            {showICOCreate && <Button className="btn-in-chart btn-none-bg" color="info"
                                                      onClick={(e) => this.handleCreateICO(e)}><FormattedMessage
                                id="Create ICO"/></Button>}

                            <Button className="btn-in-chart btn-none-bg" color="info"
                                    onClick={() => this.transferMozoToken()}><FormattedMessage
                                id="Transfer Token"/></Button>
                        </div>
                        {/* <TransactionStatus contract={mozoTokenContract} reCreateContractCallBack={() => {
                            this.reCreateContract()
                        }}/> */}
                    </Col> : <div></div>) :
                    <Col xs={12}>
                        <h2 className="main-title"><FormattedMessage id="Mozo Tokens"/></h2>

                        <TransactionStatus contract={mozoTokenContract} reCreateContractCallBack={() => {
                            this.reCreateContract()
                        }}/>
                    </Col>}
            </Row>
        )
    }
}

export default injectIntl(observer(MozoTokenComponent))