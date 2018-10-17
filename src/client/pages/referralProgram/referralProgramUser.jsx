import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { ReferralProgramModel } from "./referralProgramModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Popover, Alert } from 'reactstrap';
import { TextField, Table } from '../../components'
import { Observable } from 'rxjs/Observable'
import { Url } from '../../commons/consts/config';
import { browserHistory } from "react-router";
import Rx from 'rxjs/Rx';
import moment from 'moment'
import copy from 'copy-to-clipboard';
import Web3 from 'web3'
import QRCode from 'qrcode-react'
import { ToastContainer, toast } from 'react-toastify'

class ReferralProgramUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showBTC: false,
            tooltipOpen: false,
            requestHistory: [],
            checkedPending: false,
            disabledRequest: false,
            program: []
        }

        this.toggle = this.toggle.bind(this);

        this.initFormModel()

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
                mapData: "mozoToken",
                binding: (data) => {
                    return <span>{data.mozoToken} MOZO</span>
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
                return data.status == "success" ? (props.userInfo.role == "founder"? <i className="receive-money"></i> :  <i className="send-money"></i>):(data.status == "complete" ? <i className="fas fa-check success-message"></i> : <i className="fas fa-arrow-right animated fadeInLeft infinite animated3"></i>)
                }

            }
        ]
    }

    initFormModel() {
        var self = this
        self.form = new FormModel({ ...ReferralProgramModel }, { name: 'BTCModel' })

        self.form.onSuccess = function (form) {
            NetworkService.referralRequest(form.values().address).subscribe(
                function onNext(response) {
                    // if (!_.isEmpty(response)) {
                    //     self.form.$("address").value = response.ethAddress
                    //     self.form.$("btc").value = response.btcAddress
                    //     self.setState({ showBTC: true, disabledRequest: true })
                    // } else {
                    //     self.props.showMessgageModal({ id: "There is not a BTC address available." })
                    // }
                    self.notify()

                    self.setState({program: [response]})
                    console.log(response)

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
        //clearInterval(this.getBTCListInterval)
    }

    componentDidMount() {
        var self = this
        var { userInfo } = self.props
        self.props.resetBackHeader()

        NetworkService.referralHistory().subscribe(
            function onNext(response) {
                // if (!_.isEmpty(response)) {
                //     self.form.$("address").value = response.ethAddress
                //     self.form.$("btc").value = response.btcAddress
                //     self.setState({ showBTC: true, disabledRequest: true })
                // }

                // if(_.isEmpty(response) && response != false){
                //     self.props.showMessgageModal({ id: "There is not a BTC address available." })
                // }

                console.log(response)

            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )

        // var getBTCList = () => {
        //     if (userInfo.role == "founder") {
        //         NetworkService.getAllBTCReaquest().subscribe(
        //             function onNext(response) {
        //                 self.setState({ requestHistory: response })
        //             },
        //             function onError(e) {
        //                 console.log("onError")
        //             },
        //             function onCompleted() {

        //             }
        //         )

        //     } else {
        //         NetworkService.getBTCReaquestHistory().subscribe(
        //             function onNext(response) {
        //                 if (response.length > 0) {
        //                     var checkPending = _.filter(response, { status: "pending" });
        //                     if (checkPending.length <= 0) {
        //                         var disabled = self.state.disabledRequest
        //                         if(self.state.checkedPending){
        //                             self.setState({ requestHistory: response, disabledRequest: false, checkedPending: false })
        //                         } else{
        //                             self.setState({ requestHistory: response, disabledRequest: disabled })
        //                         }

        //                     } else {
        //                         self.setState({ requestHistory: response, disabledRequest: true, checkedPending: true })
        //                     }
        //                 }
        //                 if(!self.getBTCListInterval){
        //                     self.getBTCListInterval = setInterval(() => getBTCList(), 10000)
        //                 }

        //             },
        //             function onError(e) {
        //                 console.log("onError")
        //             },
        //             function onCompleted() {

        //             }
        //         )
        //     }

        // }

        // getBTCList()

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
        if(data.status == "success"){
            var web3 = new Web3()
            browserHistory.push({
                pathname: "/" + Url.transferToken + "/to-btc-request/ico-contract/" + data.address + "/" + web3.utils.utf8ToHex(data.mozoToken) + "/" + data.id
            });
        }
    }

    notify() { toast.info("Request success.") }

    render() {
        var self = this
        var { userInfo } = self.props
        var { showBTC, requestHistory, disabledRequest, program } = self.state
        return (
            <div>
                <div>
                    <ToastContainer hideProgressBar={true} closeButton={false} style={{ top: "85px", textAlign: "center" }} />
                    <div className="main-title-container">
                        <h2 className="main-title"><FormattedMessage id="Refferral Program" /></h2>
                        <div><FormattedMessage id="To make sure this address is generated by Mozo, please check before continue." /></div>
                    </div>
                    <Form>
                    {program.length <= 0 ? <Row>
                            <Col xs="12" sm="6">
                                <TextField disabled={disabledRequest} field={self.form.$("address")} />
                            </Col>
                            <Col xs="12" sm="2">
                                <Button disabled={disabledRequest} className="inline-textbox-margin min-w-md" color="info"
                                    onClick={self.form.onSubmit.bind(this)} ><FormattedMessage id="Request" /></Button>
                            </Col>
                        </Row>: <Row>
                            <Col xs="12" sm="8">
                            <Alert color="success">
                                <FormattedMessage id="Your request is already sent to MOZO , you will recieve an email when your request is approved." />
                            </Alert>
                            </Col>
                        </Row>}

                    </Form>
                </div>
            </div>

        )
    }

}

ReferralProgramUser.propTypes = {
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(ReferralProgramUser)))
