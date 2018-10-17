import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import SocketService from "../../network/SocketService"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, NavLink } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { Url, Common } from '../../commons/consts/config';
import { browserHistory } from "react-router";
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from "constants";
import { getReadOnlyWeb3 } from "../../commons/wallets"

class SmartContractComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collapse: {},
            contractList: [],
            updateAddress: {},
            web3: null
        }
    }

    componentDidMount() {
        var self = this

        localStorage.removeItem("mozoToken")
        localStorage.removeItem("mozoSaleToken")
        localStorage.removeItem("investmentDiscountToken")

        self.props.resetBackHeader()

        this.socket = SocketService.getTemplateContract(
            function (body, JWR) {
                self.setState({ contractList: body })
            },
            function (body, JWR) {
            })
    }

    componentWillUnmount() {
        if (this.socket.isConnected()) {
            this.socket.disconnect();
        }
    }

    // setMozoStoregate(mozoContract){
    //     if(mozoContract.contracts.length > 0){
    //         if( !_.isEmpty(mozoContract.contracts[0].address)){
    //             sessionStorage.setItem("mozoToken") = mozoContract.contracts[0].address
    //         }
    //     }
    // }

    updateSmartContract(hash, address, type, callBack) {
        NetworkService.updateSmartContract(hash, address, type).subscribe(
            function onNext(response) {
                callBack(response)
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

    createSmartContract(type, createType, contractID = 0) {
        var self = this
        browserHistory.push({
            pathname: "/" + Url.smartContract + "/" + createType + "/" + type + "/" + contractID
        });
    }

    smartContractDetail(id, type) {
        var self = this
        browserHistory.push({
            pathname: "/" + Url.smartContractDetail + "/" + type
        });
    }

    showCreateButton(item) {
        var result = true
        switch (item.type) {
            case "mozo-token-contract":
            case "ico-contract":
            case "treasury-contract":
            case "investment-discount-contract":
            case "crowdsale-timeline-bonus-contract":
            //case "vested-token-contract":
                if (item.contracts.length > 0) {
                    if (item.type == "mozo-token-contract" && !_.isEmpty(item.contracts[0].address)) {
                        localStorage.setItem("mozoToken", item.contracts[0].address)
                    }
                    if (item.type == "ico-contract" && !_.isEmpty(item.contracts[0].address)) {
                        localStorage.setItem("mozoSaleToken", item.contracts[0].address)
                    }

                    if (item.type == "investment-discount-contract" && !_.isEmpty(item.contracts[0].address)) {
                        localStorage.setItem("investmentDiscountToken", item.contracts[0].address)
                    }
                    result = false
                }

                break
        }
        return result
    }

    goToReferral(){
        //alert("xxxxx")
    }

    showAddress(item) {
        var self = this
        const updateAddress = (hash) => {
            var newState = self.state.updateAddress
            newState["update" + item.id] = "updating"
            self.setState({ updateAddress: newState });

            if (self.state.web3) {
                self.state.web3.eth.getTransactionReceipt(hash)
                    .then((data) => {
                        console.log(data)
                        item.contracts[0].address = data.contractAddress
                        self.updateSmartContract(hash, data.contractAddress, item.type, () => {
                            var newState = self.state.updateAddress
                            newState["update" + item.id] = "address"
                            self.setState({ updateAddress: newState });
                        })
                    });
            }
        }
        var status = ""

        if (!_.isEmpty(item.contracts[0].address)) {
            status = "address"
        } else {
            status = "update"

            if (self.state.web3 == null) {
                var getWeb3 = new Promise((resolve, reject) => {
                    var web3 = getReadOnlyWeb3()
                    resolve(web3)
                })

                getWeb3.then((web3) => {
                    self.setState({ web3: web3 })
                })
            }
        }

        self.state.updateAddress["update" + item.id] = self.state.updateAddress["update" + item.id] || status

        return <span> {self.state.updateAddress["update" + item.id] == 'address' ?
            <a target="_blank" href={Common.ethNetworkUrl + "/address/" + item.contracts[0].address}>{item.contracts[0].address}</a> :
            (self.state.updateAddress["update" + item.id] == 'update' ? <a onClick={() => updateAddress(item.contracts[0].txnHash)}>
                <FormattedMessage id="Update address" />
            </a> :
                "Updating...")}</span>

    }

    renderReferral(value) {
        var self = this
        if (value.contracts.length > 0) {
            var success = _.filter(value.contracts, { txnStatus: "success" })
            var fail = _.filter(value.contracts, { txnStatus: "failed" })
            return <div><a className="underline" onClick={() => {
                self.goToReferral()
            }}>{value.name}</a>&nbsp;&nbsp;&nbsp;<span className="info-message"><FormattedMessage id="Agency" /> ( {value.contracts.length} )</span>&nbsp;&nbsp;&nbsp;
            <span className="success-message"><FormattedMessage id="Success" /> ( {success.length} )</span>&nbsp;&nbsp;&nbsp;
            <span className="warning-message"><FormattedMessage id="Waiting" /> ( {value.contracts.length - success.length - fail.length} )</span>&nbsp;&nbsp;&nbsp;  
            <span className="fail-message"><FormattedMessage id="Fail" /> ( {fail.length} )</span>
            <NavLink className="underline detail-inline" onClick={() => {
                    self.goToReferral()
                }}><FormattedMessage id="Detail" /></NavLink>
            </div>
        } else {
            return value.name
        }
    }


    renderContract() {
        var self = this
        var data = self.state.contractList

        var level = 0

        const renderItemContent = (value, className, showCreateButton) => {
            return <div className={className}>
                <div className="item-content">
                    {showCreateButton ? (value.type == "referral-contract" ? self.renderReferral(value) : value.name) : <div><a className="underline" onClick={() => {
                        self.smartContractDetail(value.id, value.type)
                    }}>{value.name}</a>&nbsp;&nbsp;&nbsp;{value.contracts[0].txnStatus == "failed" ? 
                    <span className="fail-message"><FormattedMessage id="Create a smart contract failed. Please re-create it." /></span> : 
                    (value.contracts[0].txnStatus == "success" ? <a target="_blank" href={Common.ethNetworkUrl + "/address/" + value.contracts[0].address}>{value.contracts[0].address}</a>:
                    <span className="warning-message loading"><FormattedMessage id="Waiting for confirmation" /></span>)} </div>}</div>
                {showCreateButton ? <Button className="create-btn" color="info" onClick={() => {
                    self.createSmartContract(value.type, "create")
                }}><FormattedMessage id="Create" /></Button> : (value.contracts[0].txnStatus == "failed" ? <Button color="info" onClick={() => {
                    self.createSmartContract(value.type, "re-create", value.contracts[0].id)
                }}><FormattedMessage id="Re-create" /></Button> : <NavLink className="underline" onClick={() => {
                    self.smartContractDetail(value.id, value.type)
                }}><FormattedMessage id="Detail" /></NavLink>)}
            </div>
        }

        const renderItem = (value) => {
            var contractChild = _.filter(data, { parent: value.id })
            var showCreateButton = self.showCreateButton(value)
            if (contractChild.length <= 0) {
                return <div key={value.id} className={"panel panel-lv" + level + ' ' + value.type + ' ' + (showCreateButton ? "no-create" : "")}>
                    {/* <div className="item none-child">
                        <div className="item-content">
                            {showCreateButton ? value.name : <div><a onClick={() => {
                                self.smartContractDetail(value.id, value.type)
                            }}>{value.name}</a>  -  {self.showAddress(value)} </div>}</div>
                        {showCreateButton ? <Button className="create-btn" color="info" onClick={() => {
                            self.createSmartContract(value.id)
                        }}><FormattedMessage id="Create" /></Button> : <Button color="link" onClick={() => {
                            self.smartContractDetail(value.id, value.type)
                        }}><FormattedMessage id="Detail" /></Button>}
                    </div> */}
                    {renderItemContent(value, "item none-child", showCreateButton)}
                </div>
            } else {
                var toggle = (state) => {
                    var newState = this.state.collapse
                    newState[state] = !newState[state]
                    this.setState({ collapse: newState });
                }

                self.state.collapse["collapse" + value.id] = self.state.collapse["collapse" + value.id] == undefined ? true : self.state.collapse["collapse" + value.id]
                return <div key={value.id} className={"panel panel-lv" + level + ' ' + value.type + ' ' + (showCreateButton ? "no-create" : "")}>
                    <div className={"item " + (self.state.collapse["collapse" + value.id] ? "panel-open" : "panel-close")}>
                        <Button className="item-angle" color="link" onClick={() => {
                            toggle("collapse" + value.id)
                        }}><i className="fas fa-angle-down"></i></Button>
                        {/* <div className="item-content">
                            {showCreateButton ? value.name : <div><a onClick={() => {
                                self.smartContractDetail(value.id, value.type)
                            }}>{value.name}</a> - {self.showAddress(value)} </div>}
                        </div>
                        {showCreateButton ? <Button className="create-btn" color="info" onClick={() => {
                            self.createSmartContract(value.id)
                        }}><FormattedMessage id="Create" /></Button> : <Button color="link" onClick={() => {
                            self.smartContractDetail(value.id, value.type)
                        }}><FormattedMessage id="Detail" /></Button>} */}
                        {renderItemContent(value, "item-child", showCreateButton)}
                    </div>
                    <Collapse className="child-container" isOpen={self.state.collapse["collapse" + value.id]}>
                        {contractChild.map((value, index) => {
                            level = 2
                            return renderItem(value)
                        })}
                    </Collapse>
                </div>

            }


        }

        var contractParent = _.filter(data, { parent: 0 })

        return contractParent.map((value, index) => {
            level = 1
            return renderItem(value)
        })
    }

    render() {
        var self = this
        var { hideVerifyMobile, hideVerifyEmail, isCloseEditBaseForm, isCloseEditEmailForm, isCloseEditPhoneForm, isCloseEditBankForm } = self.state

        return (
            <div>
                <ToastContainer hideProgressBar={true} closeButton={false} style={{ top: "85px", textAlign: "center" }} />
                <div>
                    <div className="main-title-container">
                        <h2 className="main-title"><FormattedMessage id="Smart Contract" /></h2>
                    </div>
                    {self.state.contractList.length > 0 ? self.renderContract() : <div id="loader"></div>}
                </div>
            </div >

        )
    }

}

export default injectIntl(observer(SmartContractComponent))