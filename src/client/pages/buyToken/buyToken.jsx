import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { BuyTokenModel, ETHRateModel, BTCRateModel, FIATRateModel, ETHWalletModel, BTCWalletModel } from "./buyTokenModel"
import { injectIntl, FormattedMessage, intlShape, FormattedNumber } from 'react-intl';
import { Tooltip, Container, Col, Row, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, TabContent, TabPane, ListGroup, ListGroupItem, Popover, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Alert, NavLink, NavItem, Nav } from 'reactstrap';
import { TextField, DatePicker, Select, WalletOption, CollapseGroup, Icon, Pagination, Table } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { Common } from '../../commons/consts/config';
import QRCode from 'qrcode-react'
import copy from 'copy-to-clipboard';
import { setUserInfo } from '../../actions'
import Kyc from '../../layouts/share/_kyc';
import Referral from '../../layouts/share/_referral';
import ETHAddress from "../../layouts/share/_ethAddress";
import CountDownCrowdsale from '../../layouts/share/_countDownCrowdsale';
import NumberBlock from "../../layouts/share/_numberBlock"

import icon_ledger from "../../images/icons/icon-ledger.png";
import icon_metamask from "../../images/icons/icon-metamask.png";
import icon_myether from "../../images/icons/icon-myetherwallet.png";

const CloseButton = ({ YouCanPassAnyProps, closeToast }) => (
    <span onClick={closeToast}>×&nbsp;</span>
);

class BuyToken extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isMozoAddress: null,
            showAddress: false,
            contract: null,
            activeTab: "1",
            collapseETH1: true,
            tooltipCopyETHOpen: false,
            tooltipCopyRefOpen: false,
            tooltipCopyBTCOpen: false,
            rateConfig: null,
            savedEth: true,
            dropdownOpenCurrency: false,
            currencyName: "USD",
            showBTCAddress: true,
            requestHistory: [],
            currencyList: [],
            icoIsOpen: true,
            bonus: {
                eth: 0,
                btc: 0,
                usd: 0
            },
            hardCap: 0,
            softCap: 0,
            estCap: 0,
            kycShow: false,
            userCal: {},
            tooltipOpen: false
        }

        this.currencyValue = 1

        this.initFormModel()

        this.toggleCurrency = this.toggleCurrency.bind(this);

        this.historyListCol = [
            // {
            //     name: <FormattedMessage id="BTC Address" />,
            //     mapData: "mozoBtcAddress",
            //     binding: (data) => {
            //         return <span className="address">{data.mozoBtcAddress}</span>
            //     }
            // },
            // {
            //     name: <FormattedMessage id="ETH Address" />,
            //     mapData: "address",
            //     binding: (data) => {
            //         return <span className="address">{data.address}</span>
            //     }
            // },
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
                    return data.status == "success" ? (props.userInfo.role == "founder" ? <i className="receive-money"></i> : <i className="send-money"></i>) : (data.status == "complete" ? <i className="fas fa-check success-message"></i> : <i className="fas fa-arrow-right animated fadeInLeft infinite animated3"></i>)
                }

            }
        ]
    }

    getNewTotalToken() {

        var { userInfo} = this.props

        // var airdropToken = userInfo.airdrop ? parseInt(userInfo.airdrop["pre-open"]) : 0

        // var newTotalToken =  parseInt(userInfo.totalToken) - airdropToken
        var newTotalToken =   !_.isEmpty(userInfo.purchasedToken) ? parseInt(userInfo.purchasedToken) : 0

        return newTotalToken < 0 ? 0 : newTotalToken

    }

    initFormModel() {
        var self = this

        var { userInfo, showKYC } = self.props

        self.btcWalletForm = new FormModel({ ...BTCWalletModel }, { name: 'ETHWalletModel' })
        self.ethWalletForm = new FormModel({ ...ETHWalletModel }, { name: 'ETHWalletModel' })
        self.rateFormETH = new FormModel({ ...ETHRateModel }, { name: 'RateModel' })
        self.rateFormBTC = new FormModel({ ...BTCRateModel }, { name: 'RateModel' })
        self.rateFormFIAT = new FormModel({ ...FIATRateModel }, { name: 'RateModel' })

        //self.ethRateForm = new FormModel({ ...ETHRateModel }, { name: 'RateModel' })

        self.buyETHForm = new FormModel({ ...BuyTokenModel }, { name: 'BuyTokenModel' })


        self.rateFormETH.onSuccess = function (form) {


            if (parseFloat(form.values().amountETHtoMOZO) * 100 + self.getNewTotalToken() >= Common.kycRequiredValue) {
                self.setState({ kycShow: true })
                if (userInfo.kyc) {
                    if (userInfo.kyc["reviewAnswer"] != "GREEN") {
                        showKYC()
                    }
                } else {
                    showKYC()
                }

                self.scrollIntoView('kycBlock', 0)
            } else {
                self.setState({ kycShow: false })
                self.scrollIntoView('scrollBuyMozo', 0)
            }

            self.buyETHForm.$("amount").value = form.values().amountETH

            self.saveCalculate("ethereum", form.values().amountETH, form.values().amountETHtoMOZO)

            const userCal = { eth: form.values().amountETH, btc: self.state.userCal.btc || "", fiat: self.state.userCal.fiat || "" }
            self.setState({ userCal: userCal })
            localStorage.setItem("userCal_" + userInfo.emailAddress, JSON.stringify(userCal))

        }

        self.rateFormBTC.onSuccess = function (form) {

            if (parseFloat(form.values().amountBTCtoMOZO) * 100 + self.getNewTotalToken() >= Common.kycRequiredValue) {
                self.setState({ kycShow: true })
                if (userInfo.kyc) {
                    if (userInfo.kyc["reviewAnswer"] != "GREEN") {
                        showKYC()
                    }
                } else {
                    showKYC()
                }

                self.scrollIntoView('kycBlock', 0)
            } else {
                self.setState({ kycShow: false })
                self.scrollIntoView('scrollBuyMozoBTC', 0)
            }

            self.saveCalculate("bitcoin", form.values().amountBTC, form.values().amountBTCtoMOZO)

            const userCal = { eth: self.state.userCal.eth || "", btc: form.values().amountBTC || "", fiat: self.state.userCal.fiat || "" }
            self.setState({ userCal: userCal })
            localStorage.setItem("userCal_" + userInfo.emailAddress, JSON.stringify(userCal))

        }

        self.rateFormFIAT.onSuccess = function (form) {

            if (parseFloat(form.values().amountFIATtoMOZO) * 100 + self.getNewTotalToken() >= Common.kycRequiredValue) {
                self.setState({ kycShow: true })
                if (userInfo.kyc) {
                    if (userInfo.kyc["reviewAnswer"] != "GREEN") {
                        showKYC()
                    }
                } else {
                    showKYC()
                }

                self.scrollIntoView('kycBlock', 0)
            } else {
                self.setState({ kycShow: false })
                self.scrollIntoView('scrollBuyMozoFIAT', 0)
            }
            console.log("cccc", self.state.currencyName)
            self.saveCalculate(self.state.currencyName, form.values().amountFIAT, form.values().amountFIATtoMOZO)

            const usdValue = parseFloat(((form.values().amountFIAT / self.currencyValue)).toFixed(2))

            const userCal = { eth: self.state.userCal.eth || "", btc: self.state.userCal.btc || "", fiat: usdValue.toString() }
            self.setState({ userCal: userCal })
            localStorage.setItem("userCal_" + userInfo.emailAddress, JSON.stringify(userCal))

        }

        self.ethWalletForm.onSuccess = function (form) {
            NetworkService.updateETHAddress(form.values().ETHAddress).subscribe(
                function onNext(response) {
                    self.props.dispatch(setUserInfo(response))
                    self.setState({ savedEth: true })
                    self.notifyUpdate("Update successfully.")
                },
                function onError(e) {
                    //self.setState({ isMozoAddress: false })
                },
                function onCompleted() {

                }
            )
        }

        self.buyETHForm.onSuccess = function (form) {
            var { web3 } = self.props
            var values = form.values()

            if (!web3.currentProvider.isMetaMask) {
                self.props.showMessgageModal({ id: "Please press the confirmation button on your wallet." })
            }

            web3.eth.sendTransaction({
                from: values.fromAddress,
                to: values.toAddress,
                value: web3.utils.toWei(values.amount, 'ether'),
                gas: values.gas,
                gasPrice: (values.gasPrice * 1000000000).toString(),
                chainId: Common.chainId
            })
                .on('transactionHash', function (hash) {
                    self.props.closeModal(() => {
                        self.notify(hash)
                        self.addTransferToken(hash)
                    })
                })
                .on('receipt', function (receipt) {
                    console.log(receipt)
                })
                .on('confirmation', function (confirmationNumber, receipt) { console.log(receipt) })
                .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
        }
    }

    saveCalculate(type, fromValue, toValue) {
        NetworkService.saveCalData(type, fromValue, toValue).subscribe(
            function onNext(response) {
                console.log(response)
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    addTransferToken(hash) {

        NetworkService.addTransferToken(hash, "buy-token", null).subscribe(
            function onNext(response) {
                console.log(response)
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    changeState(objState) {
        this.setState(objState)
    }

    getContractForBuy(e) {
        var self = this
        var value = e
        if (typeof e != 'string') {
            value = e.target.value
            if (value.trim() == "" || !(/^(0x)?[0-9a-fA-F]{40}$/.test(value.trim()))) {
                self.setState({ isMozoAddress: null })
                return
            }
        }


        NetworkService.getContractForBuy(value).subscribe(
            function onNext(response) {

                self.setState({ isMozoAddress: true, contract: response })

            },
            function onError(e) {
                self.setState({ isMozoAddress: false })
            },
            function onCompleted() {

            }
        )
    }

    getRateConfig() {
        var self = this
        NetworkService.getConfig("token-calculation").subscribe(
            function onNext(response) {

                if (response) {
                    var rateConfig = {}
                    var minUsd = self.rateFormFIAT.$("amountFIAT").options.min
                    response.map((x) => {
                        if (x.key == "eth-rate") {
                            rateConfig.rateETH = parseFloat(x.value)
                        }

                        if (x.key == "btc-rate") {
                            rateConfig.rateBTC = parseFloat(x.value)
                        }

                        if (x.key == "crowdsale-bonus") {
                            rateConfig.bonusPackages = JSON.parse(x.value)
                            var min = _.filter(rateConfig.bonusPackages, { 'bonus': 0 });
                            if (min.length > 0) {
                                self.rateFormETH.$("amountETH").options.min = min[0].minEth
                                self.rateFormBTC.$("amountBTC").options.min = min[0].minBtc
                                self.rateFormFIAT.$("amountFIAT").options.min = min[0].minUsd
                                minUsd = min[0].minUsd
                            }
                        }
                    })

                    self.setState({ rateConfig: rateConfig, minUsd: minUsd })
                }

            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    getInvestmentDiscount() {
        var self = this
        NetworkService.getContractByType("investment-discount-contract").subscribe(
            function onNext(response) {
                self.setState({ contract: response.contracts })
                if (!_.isEmpty(response.contracts)) {
                    if (!_.isEmpty(response.contracts.address)) {
                        self.buyETHForm.$("toAddress").value = response.contracts.address
                        self.getContractForBuy(response.contracts.address)
                    }
                }

            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )
    }

    //  checkICODay(){
    //     const now = new Date()
    //     if (now <= new Date("2018-07-08T00:00:00")) {
    //       browserHistory.push({
    //         pathname: "/count-down"
    //       })
    //     }
    // }

    componentDidMount() {
        var self = this

        //self.checkICODay()

        var { userInfo, showRefrralUserModal, checkDate, showKYC } = self.props
        var { fromType, fromValue } = this.props.params

        var userRef = JSON.parse(localStorage.getItem("userRef_" + userInfo.emailAddress))
        if (userRef) {
            var showRef = setTimeout(() => {
                showRefrralUserModal(userRef.emailAddress, userRef.rate)
                clearTimeout(showRef)
            }, 300)
        }

        if (fromType == "from") {
            self.buyETHForm.$("toAddress").value = fromValue
            self.getContractForBuy(fromValue)
        } else if (fromType == "from-agency") {

        } else {
            self.getInvestmentDiscount()
        }

        if (!_.isEmpty(userInfo["receiveAddress"])) {
            self.ethWalletForm.$("ETHAddress").value = userInfo["receiveAddress"]
            self.setState({ savedEth: true })
        } else {
            self.setState({ savedEth: false })
        }

        if (!_.isEmpty(userInfo["buyingBtcAddress"])) {
            self.btcWalletForm.$("BTCAddress").value = userInfo["buyingBtcAddress"]
        }

        self.getRateConfig()

        self.rateFormETH.$('amountETH').observe({
            key: 'value',
            call: data => {
                if (!isNaN(data.field.value) && parseFloat(data.field.value) >= 0.1) {
                    self.rateFormETH.$('amountETHtoMOZO').value = self.convertToMozo("eth", data.field.value)
                } else {
                    self.rateFormETH.$('amountETHtoMOZO').value = ""
                }

            },
        });


        self.rateFormBTC.$('amountBTC').observe({
            key: 'value',
            call: data => {
                if (!isNaN(data.field.value) && parseFloat(data.field.value) >= 0.01) {
                    self.rateFormBTC.$('amountBTCtoMOZO').value = self.convertToMozo("btc", data.field.value)
                } else {
                    self.rateFormBTC.$('amountBTCtoMOZO').value = ""
                }
            },
        });

        self.rateFormFIAT.$('amountFIAT').observe({
            key: 'value',
            call: data => {
                self.rateFormFIAT.$('amountFIATtoMOZO').value = self.convertToMozo("usd", data.field.value)
            },
        });

        self.buyETHForm.$("gas").observe({
            key: 'value',
            call: () => {
                self.resettransactionFee()
            },
        });

        self.buyETHForm.$("gasPrice").observe({
            key: 'value',
            call: () => {
                self.resettransactionFee()
            },
        });

        if (new Date(parseInt(checkDate["ico-start-date"]) * 1000) > new Date()) {
            self.setState({ icoIsOpen: false })
        }

        NetworkService.getAllBTCTransaction().subscribe(
            function onNext(response) {
                self.setState({ requestHistory: response.data })
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )

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

        NetworkService.getCurrencyRate().subscribe(
            function onNext(response) {

                var currencies = []
                response.map((x) => {
                    currencies.push({ value: parseFloat(x.price), text: x.symbol })
                })
                console.log(currencies)
                self.setState({ currencyList: currencies })
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )

        if (localStorage.getItem("userCal_" + userInfo.emailAddress)) {
            var userCal = JSON.parse(localStorage.getItem("userCal_" + userInfo.emailAddress))
            self.setState({ userCal: userCal })
            setTimeout(() => {
                if (!_.isEmpty(userCal.eth)) {
                    self.rateFormETH.$("amountETH").value = parseFloat(userCal.eth)
                }
                if (!_.isEmpty(userCal.btc)) {
                    self.rateFormBTC.$("amountBTC").value = parseFloat(userCal.btc)
                }
                if (!_.isEmpty(userCal.fiat)) {
                    self.rateFormFIAT.$("amountFIAT").value = parseFloat(userCal.fiat)
                }
            }, 500)

        }

        if (self.getNewTotalToken() >= Common.kycRequiredValue || userInfo.kyc != undefined) {
            if (userInfo.kyc["reviewAnswer"] != "GREEN") {
                showKYC()
            }
        }

        // const targetNode = ReactDOM.findDOMNode(self.refs["address"])
        // targetNode.childNodes[1].childNodes[1].focus()
    }

    resettransactionFee() {
        var self = this
        self.buyETHForm.$("transactionFee").value = self.buyETHForm.$("gasPrice").value * self.buyETHForm.$("gas").value / 1000000000
    }

    convertToMozo(from, value) {
        var self = this
        var bonusObj = self.state.bonus

        if (_.isEmpty(value.toString())) {
            bonusObj[from] = 0
            self.setState({ bonus: bonusObj })
            return ""
        }

        var { web3 } = self.props
        var { rateConfig } = self.state
        var match = null
        var bonus = 0
        value = parseFloat(value)

        var mozoToken = 0

        if (from == "eth") {
            match = _.find(rateConfig.bonusPackages, function (x) {
                return x.minEth <= value.toString(10);
            });

            mozoToken = web3.utils.toWei(value.toString(), 'ether') / rateConfig.rateETH
        }

        if (from == "btc") {
            match = _.find(rateConfig.bonusPackages, function (x) {
                return x.minBtc <= value.toString(10);
            });

            mozoToken = value / rateConfig.rateBTC
        }

        if (from == "usd") {
            value = value / self.currencyValue
            match = _.find(rateConfig.bonusPackages, function (x) {
                return x.minUsd <= value.toString(10);
            });

            mozoToken = (value) / 0.0009
        }

        if (match && match.bonus != 0) {
            bonus = match.bonus
        }



        bonusObj[from] = bonus * 100

        self.setState({ bonus: bonusObj })

        mozoToken = mozoToken + mozoToken * bonus

        return parseFloat((mozoToken / 100).toFixed(2))
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

    requestBTCSuccess() {

        toast.info(<div>
            <FormattedMessage id="Request BTC Address successfully." />
        </div>,
            {
                autoClose: true,
                closeButton: false,
                className: "top-info"
            })
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

    returnAddress(address) {
        var self = this

        var { web3 } = self.props
        var { contract } = self.state
        var amount = self.buyETHForm.$("amount").value

        self.buyETHForm.$("fromAddress").value = address
        self.setState({ showAddress: true })

        var myContract = new web3.eth.Contract(contract.abi, contract.address);

        myContract.methods.buyToken().estimateGas({
            from: address
        }).then(function (gasAmount) {
            self.buyETHForm.$("gas").value = gasAmount
        }).catch(function (error) {
            console.log(error)
        });

    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    requestBTCAddress() {
        var self = this
        NetworkService.requestBTCAddress().subscribe(
            function onNext(response) {
                console.log(response)
                self.btcWalletForm.$("BTCAddress").value = response.buyingBtcAddress
                self.props.dispatch(setUserInfo(response))
                self.setState({ showBTCAddress: true })
                self.requestBTCSuccess()
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )

    }

    copyETHAddress() {
        var self = this
        copy(self.buyETHForm.$("toAddress").value)
        self.setState({ tooltipCopyETHOpen: true })

        var autoHide = setTimeout(() => {
            self.setState({ tooltipCopyETHOpen: false })
        }, 1000)

    }

    copyReferralLink() {
        var self = this
        var { userInfo } = self.props
        copy(window.location.origin + "/user/ref/" + userInfo.referralId)
        self.setState({ tooltipCopyRefOpen: true })

        var autoHide = setTimeout(() => {
            self.setState({ tooltipCopyRefOpen: false })
        }, 1000)

    }

    copyBTCAddress() {
        var self = this
        copy(self.btcWalletForm.$("BTCAddress").value)
        self.setState({ tooltipCopyBTCOpen: true })

        var autoHide = setTimeout(() => {
            self.setState({ tooltipCopyBTCOpen: false })
        }, 1000)

    }

    toggleCurrency() {
        this.setState({
            dropdownOpenCurrency: !this.state.dropdownOpenCurrency
        });
    }

    toggleTooltip() {
        this.setState({
          tooltipOpen: !this.state.tooltipOpen
        });
      }

    changeCurrency(value, currencyName) {
        var self = this
        var currencyValue = self.currencyValue
        this.setState({
            currencyName: currencyName
        });

        self.currencyValue = value

        self.rateFormFIAT.$("amountFIAT").options.min = parseInt(self.state.minUsd * value)
        var newValue = parseFloat(((self.rateFormFIAT.$("amountFIAT").value / currencyValue) * value).toFixed(2))
        self.rateFormFIAT.$("amountFIAT").value = newValue % parseInt(newValue) == 0 ? parseInt(newValue) : newValue


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

    scrollIntoView(selector, offset = 0) {
        var self = this
        // window.scroll(0, document.querySelector(selector).offsetTop - offset);

        document.getElementById(selector).scrollIntoView(true);
    }

    render() {
        var self = this
        var { userInfo, checkDate } = self.props
        var { kycShow, icoIsOpen, currencyList, currencyName, isMozoAddress, showAddress, activeTab, collapseETH1, tooltipCopyETHOpen, tooltipCopyRefOpen, requestHistory, tooltipCopyBTCOpen, showBTCAddress, savedEth, dropdownOpenCurrency, bonus } = self.state
        var airdropToken = userInfo.airdrop ? parseInt(userInfo.airdrop["pre-open"]) : 0

        return (
            <div>
                <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ width: "auto", minWidth: "250px" }} />
                <div>
                    <Row>
                        <Col>
                            <NumberBlock value={self.getNewTotalToken() / 100 || 0} unit="MOZO" title={"Purchased Amount"} icon={<Icon name="mozo" className="stroke" />} />
                        </Col>
                        <Col>
                        <NumberBlock subText={(airdropToken / 100) > 0 ? <span><FormattedMessage id="Paid: value MOZO" values={{ value: airdropToken / 100 }} /> <i id="tooltipPaid" className="fas fa-info-circle"></i>
                                <Tooltip placement="top" isOpen={this.state.tooltipOpen} autohide={false} target="tooltipPaid" toggle={() => self.toggleTooltip()}>
                                Airdrop bonus is already transferred to your ETH wallet address.
                                </Tooltip>
                            </span>: null} value={(parseInt(userInfo.bonusToken) + (airdropToken > 0 ? airdropToken : parseInt(userInfo.extraBonus))) / 100 || 0} unit="MOZO" title={"Bonus"} icon={<i className="fas fa-gift"></i>} />
                        </Col>
                    </Row>

                    <FormGroup>
                        <ButtonGroup className="single-btn full-width" size="lg">
                            <Button color={activeTab == "1" ? "info" : "dark"} onClick={() => { this.toggle('1'); }}><FormattedMessage id="Buy with ETH" /></Button>
                            <Button color={activeTab == "2" ? "info" : "dark"} onClick={() => { this.toggle('2'); }}><FormattedMessage id="Buy with BTC" /></Button>
                            <Button color={activeTab == "3" ? "info" : "dark"} onClick={() => { this.toggle('3'); }}><FormattedMessage id="Buy with FIAT" /></Button>
                        </ButtonGroup>
                    </FormGroup>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <CollapseGroup title={<span className="svg-icon-container"><Icon name="calc" /><FormattedMessage id="How much would you like to invest?" /></span>}>
                                <Row className="calculator-container" noGutters>
                                    <Col xs="12" sm="4">
                                        <TextField prepend={<span className="svg-icon-container"><Icon name="eth" className="icon-circle" />ETH</span>} hidelabel={true} field={self.rateFormETH.$("amountETH")} />
                                    </Col>
                                    <Col xs="12" sm="2" className="text-center">
                                        <i className="convert-icon"></i>
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <TextField prepend={<span className="svg-icon-container"><Icon name="mozo" className="stroke icon-circle" />Mozo</span>} hidelabel={true} readOnly={true} thousandSeparator={true} field={self.rateFormETH.$("amountETHtoMOZO")} />
                                        {(bonus["eth"] != 0 && self.rateFormETH.$('amountETHtoMOZO').value > 0) && <div className="text-center smaller hint-text"><FormattedMessage id="Included Bonus" values={{ bonus: bonus["eth"] }} /></div>}
                                    </Col>
                                    <Col xs={12} sm={2}>
                                        <Button color="info"
                                            onClick={self.rateFormETH.onSubmit.bind(this)}
                                            style={{
                                                fontSize: '18px',
                                                lineHeight: '30px',
                                                marginLeft: '20px',
                                                fontWeight: 600,
                                                padding: '19px 15px',
                                                backgroundImage: 'linear-gradient(-180deg, #20D6FA 0%, #0EACF4 100%)'
                                            }}>
                                            <FormattedMessage id="BUY MOZO" /></Button>
                                    </Col>
                                </Row>
                            </CollapseGroup>
                        </TabPane>
                        <TabPane tabId="2">
                            <CollapseGroup title={<span className="svg-icon-container"><Icon name="calc" /><FormattedMessage id="Automatic Calculator to MOZO (Minimum Purchasing = 0.01 BTC) " /></span>}>
                                <Row className="calculator-container" noGutters>
                                    <Col xs="12" sm="4">
                                        <TextField prepend={<span className="svg-icon-container"><Icon name="btc" className="icon-circle" />BTC</span>} hidelabel={true} field={self.rateFormBTC.$("amountBTC")} />
                                    </Col>
                                    <Col xs="12" sm="2" className="text-center">
                                        <i className="convert-icon"></i>
                                    </Col>

                                    <Col xs="12" sm="4">
                                        <TextField thousandSeparator={true} readOnly={true} prepend={<span className="svg-icon-container"><Icon name="mozo" className="stroke icon-circle" />Mozo</span>} hidelabel={true} field={self.rateFormBTC.$("amountBTCtoMOZO")} />
                                        {(bonus["btc"] != 0 && self.rateFormBTC.$('amountBTCtoMOZO').value > 0) && <div className="text-center smaller hint-text"><FormattedMessage id="Included Bonus" values={{ bonus: bonus["btc"] }} /></div>}
                                    </Col>
                                    <Col xs={12} sm={2}>
                                        <Button color="info"
                                            onClick={self.rateFormBTC.onSubmit.bind(this)}
                                            style={{
                                                fontSize: '18px',
                                                lineHeight: '30px',
                                                marginLeft: '20px',
                                                fontWeight: 600,
                                                padding: '19px 15px',
                                                backgroundImage: 'linear-gradient(-180deg, #20D6FA 0%, #0EACF4 100%)'
                                            }}>
                                            <FormattedMessage id="BUY MOZO" /></Button>

                                    </Col>
                                </Row>
                            </CollapseGroup>
                        </TabPane>
                        <TabPane tabId="3">
                            <CollapseGroup title={<span className="svg-icon-container"><Icon name="calc" /><FormattedMessage id="Automatic Calculator to MOZO (Minimum Purchasing = 100 USD)" values={{ currencyName: currencyName, min: self.rateFormFIAT.$("amountFIAT").options.min }} /></span>}>
                                <Row className="calculator-container" noGutters>
                                    <Col xs="12" sm="4">
                                        <TextField thousandSeparator={true} prepend={<Dropdown isOpen={dropdownOpenCurrency} toggle={this.toggleCurrency}>
                                            <DropdownToggle tag="span" caret>
                                                {this.state.currencyName}
                                            </DropdownToggle>
                                            <DropdownMenu style={{ minWidth: "auto" }} right={false}>
                                                <DropdownItem onClick={() => self.changeCurrency(1, "USD")}>
                                                    USD
                                                </DropdownItem>
                                                {
                                                    currencyList.map((x) => {
                                                        return <DropdownItem onClick={() => self.changeCurrency(x.value, x.text)}>
                                                            {x.text}
                                                        </DropdownItem>
                                                    })

                                                }
                                            </DropdownMenu>
                                        </Dropdown>} hidelabel={true} field={self.rateFormFIAT.$("amountFIAT")} />
                                    </Col>
                                    <Col xs="12" sm="2" className="text-center">
                                        <i className="convert-icon"></i>
                                    </Col>
                                    <Col xs="12" sm="4">
                                        <TextField thousandSeparator={true} readOnly={true} prepend={<span className="svg-icon-container"><Icon name="mozo" className="stroke icon-circle" />Mozo</span>} hidelabel={true} field={self.rateFormFIAT.$("amountFIATtoMOZO")} />
                                        {(bonus["usd"] != 0 && self.rateFormFIAT.$('amountFIATtoMOZO').value > 0) && <div className="text-center smaller hint-text"><FormattedMessage id="Included Bonus" values={{ bonus: bonus["usd"] }} /></div>}
                                    </Col>
                                    <Col xs={12} sm={2}>
                                        <Button color="info"
                                            onClick={self.rateFormFIAT.onSubmit.bind(this)}
                                            style={{
                                                fontSize: '18px',
                                                lineHeight: '30px',
                                                marginLeft: '20px',
                                                fontWeight: 600,
                                                padding: '19px 15px',
                                                backgroundImage: 'linear-gradient(-180deg, #20D6FA 0%, #0EACF4 100%)'
                                            }}>
                                            <FormattedMessage id="BUY MOZO" /></Button>
                                    </Col>
                                </Row>
                            </CollapseGroup>
                        </TabPane>
                        <ETHAddress notifyUpdate={(text) => {
                            self.notifyUpdate(text)
                        }} />
                        <TabPane tabId="1">
                            <div className="buy-mozo-zone" style={{ top: -80, position: "absolute" }} id="scrollBuyMozo" ></div>
                            <CollapseGroup title={<span className="svg-icon-container"><Icon name="mozo" className="stroke" /><FormattedMessage id="Buy MOZO tokens" /></span>}>
                                {!icoIsOpen && <FormGroup>
                                    <div>
                                        <Row>

                                            <Col sm={12}>
                                                <CountDownCrowdsale endCountDown={() => {
                                                    self.setState({ icoIsOpen: true })
                                                }} icoStartDate={checkDate["ico-start-date"]} hardCap={parseInt(this.state.hardCap)} softCap={parseInt(this.state.softCap)} estCap={parseInt(this.state.estCap)} />
                                            </Col>

                                            {/* COUNT DOWN COMPONENT */}
                                        </Row>
                                    </div>
                                </FormGroup>}
                                <FormGroup className={!icoIsOpen ? "disabled-steps" : ""}>
                                    <Row>
                                        <Col xs="12">
                                            <h4 id="heading-buy-token" className="heading-buy-token"><strong>BUY MOZO TOKENS USING</strong> ETH WALLET ADDRESS</h4>
                                            <p>
                                                <span className="svg-icon-container"><Icon name="warning" /></span> <span style={{ fontWeight: '600' }}>WARNING</span><br />
                                                <FormattedMessage id="We strongly recommend our members to use..." values={{
                                                    recommended_wallet: <span><strong>MyEtherWallet</strong> or <strong>MetaMask</strong></span>, wont_be: <strong>won’t be able to receive</strong>, br: <br />
                                                }} />
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">

                                            {self.rateFormETH.$("amountETH").value >= 0.1 ? <div><span className="info-text">MOZO Crowdsale ETH Wallet Address:</span><br />
                                                <label><small>Send <FormattedNumber
                                                    value={self.rateFormETH.$("amountETH").value}
                                                    style='decimal'
                                                    minimumFractionDigits={0}
                                                    maximumFractionDigits={2}
                                                /> ETH to this address to receive <FormattedNumber
                                                        value={self.rateFormETH.$("amountETHtoMOZO").value}

                                                        style='decimal'
                                                        minimumFractionDigits={0}
                                                        maximumFractionDigits={2}
                                                    /> MOZO tokens</small></label></div> : <label className="info-text">MOZO Crowdsale ETH Wallet Address:</label>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="6" className={isMozoAddress == false ? "check-fail" : ""}>
                                            <TextField className="for-copy" hidelabel={true} readOnly={true} ref="address" field={self.buyETHForm.$("toAddress")} onBlur={(e) => self.getContractForBuy(e)} />
                                        </Col>
                                        {isMozoAddress && <Col xs="12" sm="6">
                                            <Button id="copyButton" className="min-w-md" color="info"
                                                onClick={() => self.copyETHAddress()} ><FormattedMessage id="Copy" /></Button>
                                            <Popover placement="bottom" isOpen={tooltipCopyETHOpen} target="copyButton" >
                                                <FormattedMessage id="Copied" />
                                            </Popover>
                                        </Col>}
                                    </Row>
                                    {isMozoAddress && <FormGroup><Row>
                                        <Col xs="12" sm="6">
                                            <div className="qrcode-container"><QRCode value={self.buyETHForm.$("toAddress").value} /></div>
                                        </Col>
                                    </Row></FormGroup>}
                                    <Row className="wallets-plugin">
                                        <Col sm="12">
                                            <div className="separator"><FormattedMessage id="Or you can" /></div>
                                        </Col>
                                        <Col sm="12">
                                            <h4><strong>BUY MOZO TOKENS USING</strong> ONLINE WALLET PLUGIN</h4>
                                            <Nav className="plugins buy-tool">
                                                <NavItem>
                                                    <NavLink href="#" className="form-control" disabled={self.buyETHForm.$("wallet").value == 1} onClick={() => {
                                                        self.setState({ showAddress: false })
                                                        setTimeout(() => {
                                                            self.buyETHForm.$("wallet").value = 1
                                                        }, 200)
                                                    }}><img src={icon_metamask} alt={icon_metamask} /> Buy using Metamask</NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="#" className="form-control" disabled={self.buyETHForm.$("wallet").value == 0} onClick={() => {
                                                        self.setState({ showAddress: false })
                                                        setTimeout(() => {
                                                            self.buyETHForm.$("wallet").value = 0
                                                        }, 200)
                                                    }}><img src={icon_ledger} alt={icon_ledger} /> Buy using Ledger Wallet</NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className="form-control" target="_blank" href="https://www.myetherwallet.com/#send-transaction"><img src={icon_myether} alt={icon_myether} /> Buy using MyEtherWallet</NavLink>
                                                </NavItem>
                                            </Nav>
                                        </Col>
                                    </Row>
                                    <Collapse isOpen={self.buyETHForm.$("wallet").value >= 0}>
                                        <FormGroup style={{ padding: "0 26px" }}>
                                            <Row>
                                                <Col xs="12">
                                                    <FormGroup>
                                                        <h5><b>{self.buyETHForm.$("wallet").value == 1 ? <FormattedMessage id="You are buying with Metamask" /> : <FormattedMessage id="You are buying with Ledger Wallet" />}</b></h5>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="6">
                                                    <TextField field={self.buyETHForm.$("amount")} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="6">
                                                    <TextField thousandSeparator={true} field={self.buyETHForm.$("gas")} />
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs="12" sm="6">
                                                    <TextField append={<span style={{ minWidth: "50px" }}>GWEI</span>} field={self.buyETHForm.$("gasPrice")} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs="12" sm="6">
                                                    <TextField disabled append={<span style={{ minWidth: "50px" }}>ETH</span>} field={self.buyETHForm.$("transactionFee")} />
                                                </Col>
                                            </Row>

                                            {!showAddress && <Row>
                                                <Col xs="12" sm="6">
                                                    <WalletOption returnAddress={(address) => self.returnAddress(address)} field={self.buyETHForm.$("wallet")} />
                                                </Col>
                                                <Col xs="12" sm="6">

                                                </Col>
                                            </Row>}
                                            {showAddress && <div>
                                                <Row>
                                                    <Col xs="12" sm="6">
                                                        <TextField disabled field={self.buyETHForm.$("fromAddress")} />
                                                    </Col>
                                                    <Col xs="12" sm="6">

                                                    </Col>
                                                </Row>
                                                <Row className="mt-md">
                                                    <Col xs="6">
                                                        <Button color="info"
                                                            onClick={self.buyETHForm.onSubmit.bind(this)} ><FormattedMessage id="Buy Token" /></Button>
                                                    </Col>
                                                </Row>
                                            </div>}

                                        </FormGroup>
                                    </Collapse>
                                </FormGroup>
                            </CollapseGroup>
                        </TabPane>
                        <TabPane tabId="2">
                            <div  className="buy-mozo-zone" style={{ top: -80, position: "absolute" }} id="scrollBuyMozoBTC" ></div>
                            <CollapseGroup title={<span className="svg-icon-container"><Icon name="mozo" className="stroke" /><FormattedMessage id="MOZO BTC Wallet Address" /></span>}>
                                {!_.isEmpty(userInfo["buyingBtcAddress"]) ? <FormGroup>
                                    {/* <Row>
                                        <Col xs="12">
                                            <p className="fail-message">
                                                <FormattedMessage id="We strongly recommend our members to use..." />
                                            </p>
                                        </Col>
                                    </Row> */}
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <TextField className="for-copy" readOnly={true} field={self.btcWalletForm.$("BTCAddress")} />
                                            {/* {isMozoAddress != null && <div className="message-for-text">
                                                {isMozoAddress ? <span className="success-message"><i className="success-icon"></i> <FormattedMessage id="Your contract address is correct!" /></span> : <span className="fail-message"><i className="fail-icon"></i> <FormattedMessage id="This address does not exist." /></span>}
                                            </div>} */}
                                        </Col>
                                        {showBTCAddress && <Col xs="12" sm="6">
                                            <Button id="copyBTCButton" className="inline-textbox-margin min-w-md" color="info"
                                                onClick={() => self.copyBTCAddress()} ><FormattedMessage id="Copy" /></Button>
                                            <Popover placement="bottom" isOpen={tooltipCopyBTCOpen} target="copyBTCButton" >
                                                <FormattedMessage id="Copied" />
                                            </Popover>
                                        </Col>}
                                    </Row>
                                    {showBTCAddress && <FormGroup><Row>
                                        <Col xs="12" sm="6">
                                            <div className="qrcode-container"><QRCode value={self.btcWalletForm.$("BTCAddress").value} /></div>
                                        </Col>
                                    </Row></FormGroup>}
                                    {requestHistory.length > 0 && <CollapseGroup title={<FormattedMessage id="History contribution" />}>
                                        <FormGroup>
                                            <Table tableData={requestHistory} colData={self.historyListCol} />
                                        </FormGroup>
                                    </CollapseGroup>}
                                </FormGroup> : <FormGroup>
                                        <Row>
                                            <Col xs="12">
                                                <Button color="info"
                                                    onClick={() => self.requestBTCAddress()} ><FormattedMessage id="Request BTC Address" /></Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>}
                            </CollapseGroup>
                        </TabPane>
                        <TabPane tabId="3">
                            <div className="buy-mozo-zone" style={{ top: -80, position: "absolute" }} id="scrollBuyMozoFIAT" ></div>
                            <CollapseGroup title={<span className="svg-icon-container"><Icon name="mozo" className="stroke" /><FormattedMessage id="MOZO Bank Account" /></span>}>
                                <Row>
                                    <Col xs="12">
                                        <p>
                                            <FormattedMessage id="Singapore Bank Account" values={{ br: <br /> }} />
                                        </p>
                                        <p className="fail-message">
                                            <FormattedMessage id="Please enter “Buy Mozo, your email address, your phone number” into payment description." />
                                        </p>
                                    </Col>
                                </Row>
                            </CollapseGroup>
                        </TabPane>
                    </TabContent>
                    {(self.getNewTotalToken() >= Common.kycRequiredValue || userInfo.kyc != undefined || kycShow) && <div id="kycBlock"><Kyc collapseShow={true} /></div>}
                    {/*{userInfo.origin == "referral" && <Referral notifyUpdate={(text)=>{
                        self.notifyUpdate(text)
                    }} /> }*/}
                </div>
            </div>

        )
    }

}


BuyToken.propTypes = {
    intl: intlShape.isRequired,
    web3: PropTypes.object,
    userInfo: PropTypes.object,
    checkDate: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3 || new Web3(Web3.givenProvider),
        userInfo: state.userInfo,
        checkDate: state.checkDate
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(BuyToken)))
