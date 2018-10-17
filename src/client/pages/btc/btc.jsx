import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { BTCModel } from "./btcModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Form, FormGroup, Popover } from 'reactstrap';
import { TextField, Table, Pagination } from '../../components'
import { Observable } from 'rxjs/Observable'
import { Url } from '../../commons/consts/config';
import { browserHistory } from "react-router";
import Rx from 'rxjs/Rx';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import Web3 from 'web3'
import QRCode from 'qrcode-react'

class BTC extends Component {
    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this);
        this.toggle_status = this.toggle_status.bind(this);

        this.state = {
            showBTC: false,
            requestHistory: [],
            total: 0,
            checkedPending: false,
            disabledRequest: false,
            curPage: 1,
            numberRowsOfPage: 10,
            status: 'success',
            dropdownOpen: false,
            dropdownOpen_status: false
        }

        this.historyListCol = [
            {
                name: <FormattedMessage id="BTC Address" />,
                mapData: "mozoBtcAddress",
                binding: (data) => {
                    return <span className="address">{data.mozoBtcAddress}</span>
                }
            },
            {
                name: <FormattedMessage id="ETH Address" />,
                mapData: "address",
                binding: (data) => {
                    return <span className="address">{data.address}</span>
                }
            },
            {
                name: <FormattedMessage id="Amount Contributed" />,
                mapData: "amount",
                binding: (data) => {
                    return <span>{data.amount} BTC</span>
                }
            },
            {
                name: <FormattedMessage id="Mozo Token" />,
                mapData: "displayMozoToken",
                binding: (data) => {
                    return <span>{data.displayMozoToken} MOZO</span>
                }
            },
            {
                name: <FormattedMessage id="Date" />,
                mapData: "updatedAt",
                binding: (data) => {
                    return moment(data.updatedAt).format("MM/DD/YYYY hh:mm:ss")
                }
            },
            {
                name: <FormattedMessage id="Status" />,
                mapData: "status",
                className: "text-center",
                binding: (data) => {
                    return data.status == "success" ?
                    (props.userInfo.role == "founder" ? <i className="receive-money" style={{ height: 26 }}></i> : <i className="send-money" style={{ height: 26 }}></i>) :
                    (data.status == "complete" ? <i className="fas fa-check success-message" style={{ height: 26 }}></i> :
                    <i className="fas fa-arrow-right animated fadeInLeft infinite animated3" style={{ height: 26 }}></i>)
                }
            }
        ]
    }

    componentWillUnmount() {
        clearInterval(this.getBTCListInterval)
    }

    componentDidMount() {
        var self = this
        var { userInfo, location } = self.props
        let {  curPage, numberRowsOfPage, status } = self.props.params

        if(!curPage) curPage = self.state.curPage
        if(!numberRowsOfPage) numberRowsOfPage = self.state.numberRowsOfPage
        if(!status) status = self.state.status

        curPage = parseInt(curPage)
        numberRowsOfPage = parseInt(numberRowsOfPage)

        self.props.resetBackHeader()

        NetworkService.getAllBTCTransaction({
            skip: numberRowsOfPage * (curPage - 1),
            status: (status == 'all') ? undefined : status ,
            limit: numberRowsOfPage
        }).subscribe(
            function onNext (response) {
                self.setState({ requestHistory: response.data, total: parseInt(response.total) })
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )

    }

    componentDidUpdate(){
        const self = this
        let {  curPage, numberRowsOfPage, status } = self.props.params
        if(!curPage) curPage = self.state.curPage
        if(!numberRowsOfPage) numberRowsOfPage = self.state.numberRowsOfPage
        if(!status) status = self.state.status

        if( self.state.status != status ||
            self.state.curPage != curPage ||
            self.state.numberRowsOfPage != numberRowsOfPage){
            self.setState({ curPage, numberRowsOfPage, status })
            NetworkService.getAllBTCTransaction({
                skip: numberRowsOfPage * (curPage - 1),
                status: (status == 'all') ? undefined : status ,
                limit: numberRowsOfPage
            }).subscribe(
                function onNext(response) {
                    self.setState({
                        requestHistory: response.data,
                        total: parseInt(response.total)
                    })
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }
    }


    rowOnClick(data) {
        if (data.status == "success") {
            var web3 = new Web3()
            browserHistory.push({
                pathname: "/" + Url.transferToken + "/to-btc-request/ico-contract/" + data.address + "/" + web3.utils.utf8ToHex(parseInt(data.mozoToken).toString()) + "/" + data.id
            });
        }
    }

    toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }

  toggle_status() {
      this.setState(prevState => ({
        dropdownOpen_status: !prevState.dropdownOpen_status
      }));
    }

    render() {
        var self = this
        var { userInfo } = self.props
        var { showBTC, requestHistory, disabledRequest, total } = self.state
        let {  curPage, numberRowsOfPage, status } = self.props.params
        if(!curPage) curPage = self.state.curPage
        if(!numberRowsOfPage) numberRowsOfPage = self.state.numberRowsOfPage
        if(!status) status = self.state.status

        curPage = parseInt(curPage)
        numberRowsOfPage = parseInt(numberRowsOfPage)
        return (
            <div>
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title">
                            <FormattedMessage id="BTC" />
                        </h2>
                    </div>
                    <h3 className="sub-title"><FormattedMessage id="History contribution" /></h3>
                    <Dropdown style={{ float: 'right'}} isOpen={this.state.dropdownOpen_status} toggle={this.toggle_status}>
                        <span style={{ marginRight: 10, fontWeight: 'bold'}}>Status: </span>
                        <DropdownToggle caret size="sm" style={{ padding: 5, paddingTop: 0, paddingBottom: 0, margin: 0 }}>
                            {status.charAt(0).toUpperCase() + status.substr(1)}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {
                                browserHistory.push("/btc/" + numberRowsOfPage + "/1/all")
                            }} >All</DropdownItem>
                            <DropdownItem onClick={() => {
                                browserHistory.push("/btc/" + numberRowsOfPage + "/1/success")
                            }} >Success</DropdownItem>
                            <DropdownItem onClick={() => {
                                browserHistory.push("/btc/" + numberRowsOfPage + "/1/pending")
                            }} >Pending</DropdownItem>
                            <DropdownItem onClick={() => {
                                browserHistory.push("/btc/" + numberRowsOfPage + "/1/complete")
                            }} >Complete</DropdownItem>
                        </DropdownMenu>
                     </Dropdown>
                    {userInfo.role != "founder" ? <Table tableData={requestHistory} colData={self.historyListCol} /> : <Table tableData={requestHistory} colData={self.historyListCol} rowOnClick={(data) => self.rowOnClick(data)} />}
                    <Row style={{ minWidth: 620 }}>
                        <Col xs={2}>
                            <div >
                                <Dropdown
                                    isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <div style={{ width: 200 }}>
                                        <span style={{ marginRight: 10, fontWeight: 'bold' }}>Show</span>
                                        <DropdownToggle caret size="sm" style={{ padding: 5, paddingTop: 0, paddingBottom: 0, margin: 0 }}>
                                            {numberRowsOfPage}
                                        </DropdownToggle>
                                        <span style={{ marginLeft: 10, fontWeight: 'bold' }}>items</span>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownItem onClick={() => {
                                            browserHistory.push("/btc/5/1/" + status)
                                        }} >5</DropdownItem>
                                        <DropdownItem onClick={() => {
                                            browserHistory.push("/btc/10/1/" + status)
                                        }} >10</DropdownItem>
                                        <DropdownItem onClick={() => {
                                            browserHistory.push("/btc/20/1/" + status)
                                        }} >20</DropdownItem>
                                        <DropdownItem onClick={() => {
                                            browserHistory.push("/btc/50/1/" + status)
                                        }} >50</DropdownItem>
                                        <DropdownItem onClick={() => {
                                            browserHistory.push("/btc/100/1/" + status)
                                        }} >100</DropdownItem>
                                    </DropdownMenu>
                                 </Dropdown>

                            </div>
                        </Col>
                        <Col xs={10}>
                            <div style={{
                                width: 450,
                                float: 'right'
                            }}>
                                <div style={{ float: 'right', marginRight: -5 }}>
                                    <Pagination key={Math.ceil( total / numberRowsOfPage ) + curPage}
                                        number_of_page={
                                        Math.ceil( total / numberRowsOfPage )
                                    } onChange={(number) => {
                                        browserHistory.push("/btc/" + numberRowsOfPage + "/" + number + "/" + status)
                                    }}  curPage={curPage}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

        )
    }
}

BTC.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(BTC)))
