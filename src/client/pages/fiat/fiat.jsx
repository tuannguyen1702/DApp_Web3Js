import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { FIATModel } from "./fiatModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Popover } from 'reactstrap';
import { TextField, Table } from '../../components'
import { Observable } from 'rxjs/Observable'
import { Url } from '../../commons/consts/config';
import { browserHistory } from "react-router";
import Rx from 'rxjs/Rx';
import moment from 'moment'
import copy from 'copy-to-clipboard';
import Web3 from 'web3'
import QRCode from 'qrcode-react'
import { modal } from 'react-redux-modal'
import FIATAddModal from './fiatAddModal'

class FIAT extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showBTC: false,
            tooltipOpen: false,
            requestHistory: [],
            checkedPending: false,
            disabledRequest: false
        }

        this.toggle = this.toggle.bind(this);

        this.initFormModel()

        this.historyListCol = [
            {
                name: <FormattedMessage id="Email" />,
                mapData: "emailAddress",
                binding: (data) => {
                    return <span className="address">{data.emailAddress}</span>
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
                    return <span>{data.amount} USD</span>
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
                    return data.status == "success" ? (props.userInfo.role == "founder" ? <i className="receive-money"></i> : <i className="send-money"></i>) : (data.status == "complete" ? <i className="fas fa-check success-message"></i> : <i className="fas fa-arrow-right animated fadeInLeft infinite animated3"></i>)
                }

            }
        ]
    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...FIATModel }, { name: 'BTCModel' })

        self.form.onSuccess = function (form) {
            NetworkService.requestBTC(form.values().address).subscribe(
                function onNext(response) {
                    if (!_.isEmpty(response)) {
                        self.form.$("address").value = response.ethAddress
                        self.form.$("btc").value = response.btcAddress
                        self.setState({ showBTC: true, disabledRequest: true })
                    } else {
                        self.props.showMessgageModal({ id: "There is not a BTC address available." })
                    }
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {

                }
            )
        }
    }

    componentWillUnmount() {
        clearInterval(this.getBTCListInterval)
    }

    componentDidMount() {
        var self = this
        var { userInfo } = self.props
        self.props.resetBackHeader()

        self.getAllFIATTransaction()

    }

    getAllFIATTransaction(){
        var self = this

        NetworkService.getAllFIATTransaction().subscribe(
            function onNext(response) {
                self.setState({ requestHistory: response })
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    copyBTCAddress() {
        var self = this
        copy(this.form.$("btc").value)
        self.setState({ tooltipOpen: true })

        var autoHide = setTimeout(() => {
            self.setState({ tooltipOpen: false })
        }, 1000)

    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    rowOnClick(data) {
        if (!_.isEmpty(data.address)) {
            var web3 = new Web3()
            browserHistory.push({
                pathname: "/" + Url.transferToken + "/to-fiat-request/ico-contract/" + data.address + "/" + web3.utils.utf8ToHex(parseInt(data.mozoToken).toString()) + "/" + data.id
            });
        }
    }

    callBackHandle(){
        this.getAllFIATTransaction()
    }

    openAddingModal() {
        var self = this
        modal.add(FIATAddModal, {
            title: "Add FIAT Transaction",
            size: 'medium', // large, medium or small,
            closeOnOutsideClick: false,
            hideTitleBar: false,
            hideCloseButton: false,
            callBackHandle: () => {
                self.callBackHandle()
            }
          });
    }

    render() {
        var self = this
        var { userInfo } = self.props
        var { showBTC, requestHistory, disabledRequest } = self.state
        return (
            <div>
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title"><FormattedMessage id="FIAT" /></h2>
                    </div>
                    {userInfo.role != "founder" && <Form>
                        <Row>
                            <Col xs="12" sm="6">
                                <TextField disabled={disabledRequest} field={self.form.$("address")} />
                            </Col>
                            <Col xs="12" sm="2">
                                <Button disabled={disabledRequest} className="inline-textbox-margin min-w-md" color="info"
                                    onClick={self.form.onSubmit.bind(this)} ><FormattedMessage id="Request" /></Button>
                            </Col>
                        </Row>
                        {disabledRequest && <Row>
                            <Col xs="12" sm="6">
                                <TextField disabled={true} field={self.form.$("btc")} />
                            </Col>
                            <Col xs="12" sm="2">
                                <Button id="copyButton" className="inline-textbox-margin min-w-md" color="info"
                                    onClick={() => self.copyBTCAddress()} ><FormattedMessage id="Copy" /></Button>
                                <Popover placement="bottom" isOpen={this.state.tooltipOpen} target="copyButton" >
                                    <FormattedMessage id="Copied" />
                                </Popover>
                                <div className="qrcode-container btc-qrcode"><QRCode value={self.form.$("btc").value} /></div>
                            </Col>
                        </Row>}

                    </Form>}
                    <FormGroup>
                        <Row>
                            <Col xs="12" sm="6">
                                <h3 className="sub-title"><FormattedMessage id="History contribution" /></h3>
                            </Col>
                            <Col xs="12" sm="6" className="text-right">
                                <Button className="min-w-md" color="info"
                                    onClick={() => self.openAddingModal()} ><FormattedMessage id="Add Transaction" /></Button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <Row>
                        <Col xs="12">
                            <Table tableData={requestHistory} colData={self.historyListCol} rowOnClick={(data) => self.rowOnClick(data)} />
                        </Col>
                    </Row>

                </div>
            </div>

        )
    }

}

FIAT.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(FIAT)))