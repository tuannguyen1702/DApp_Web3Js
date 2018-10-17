import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { injectIntl, FormattedMessage, intlShape, FormattedNumber } from 'react-intl';
import { Container, Col, Row, ButtonGroup, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, TabContent, TabPane, ListGroup, ListGroupItem, Popover, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Alert, NavLink } from 'reactstrap';
import { TextField, DatePicker, Select, WalletOption, CollapseGroup, Icon, Table, CountDown } from '../../components'

import { Common } from '../../commons/consts/config';

import { setUserInfo } from '../../actions'

const ETHWalletModel = {
    fields: {
        ETHAddress: {
            value: '',
            type: 'text',
            label: 'ETH Wallet Address',
            placeholder: 'Input Your ETH Wallet Address',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        }
    }
}

class ETHAddress extends Component {
    constructor(props) {
        super(props)

        this.state = {
            savedEth: true
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        self.ethWalletForm = new FormModel({ ...ETHWalletModel }, { name: 'ETHWalletModel' })

        self.ethWalletForm.onSuccess = function (form) {
            NetworkService.updateETHAddress(form.values().ETHAddress).subscribe(
                function onNext(response) {
                    self.props.dispatch(setUserInfo(response))
                    self.setState({ savedEth: true })
                    self.props.notifyUpdate("Update successfully.")
                },
                function onError(e) {
                    self.ethWalletForm.$("ETHAddress").invalidate("This ETH Wallet address has already been used.")
                },
                function onCompleted() {

                }
            )
        }

    }

    componentDidMount() {
        var self = this

        var { userInfo } = self.props

        if (!_.isEmpty(userInfo["receiveAddress"])) {
            self.ethWalletForm.$("ETHAddress").value = userInfo["receiveAddress"]
            self.setState({ savedEth: true })
        } else {
            self.setState({ savedEth: false })
        }

    }

    render() {
        var self = this
        var { userInfo } = self.props

        var { savedEth } = self.state
        

        const renderYourETHWallet = () => {
            return <CollapseGroup collapseShow={_.isEmpty(userInfo["receiveAddress"])} title={<span className="svg-icon-container"><Icon name="eth" /><FormattedMessage id="Your ETH Wallet Address" />&nbsp; {!_.isEmpty(userInfo["receiveAddress"]) && <i className="fas fa-check success-message"></i>}</span>}>
                <Row>
                    <Col xs="12">
                        <p>
                            <FormattedMessage id="Insert your personal Ethereum wallet address..." />
                        </p>
                    </Col>
                    <Col xs="12" sm="6">
                        <TextField disabled={parseInt(userInfo.totalToken) > 0} hidelabel={true} field={self.ethWalletForm.$("ETHAddress")} />
                    </Col>
                    <Col xs="12" sm="6" style={{paddingLeft: "0"}}>
                        <Button disabled={parseInt(userInfo.totalToken) > 0} className="min-w-md" color="info" style={{fontWeight: '600', padding: '10px 20px'}}
                            onClick={self.ethWalletForm.onSubmit.bind(this)} ><FormattedMessage id={savedEth ? "Update" : "Save"} /></Button>
                    </Col>
                </Row>
            </CollapseGroup>
        }

        return (
            <div>
                <div>
                    {_.isEmpty(userInfo["receiveAddress"]) && <Alert className="alert-arrow" color="danger">
                        <span className="icon-message icon-left svg-icon-container"><Icon name="warning" className="icon" /><FormattedMessage id="Add your ETH wallet address to join our crowdsale." /></span>

                    </Alert>}
                    {renderYourETHWallet()}
                </div>
            </div>
        )
    }

}


ETHAddress.propTypes = {
    intl: intlShape.isRequired,
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(ETHAddress)))
