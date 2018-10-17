import React, {Component} from "react";
import {connect} from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import {observer} from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import {AirdropCreateModel} from "./airdropCreateModel"
import {injectIntl, FormattedMessage} from 'react-intl';
import {Col, Row, Button, Form} from 'reactstrap';
import {TextField, Select} from '../../components'
import {ToastContainer, toast} from 'react-toastify'
import {Common} from "../../commons/consts/config";
import {WSAEHOSTUNREACH} from "constants";

class AirdropAddModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipOpen: false,
            checkedPending: false,
            disabledRequest: false,
            saveHide: false,
            types: [
                {value: "pre-open", text: "Pre Open Users"},
                {value: "coin", text: "Coin"},
                {value: "bounty", text: "Bounty"},
            ]
        };

        this.initFormModel()

    }

    notify() {
        toast.info(<div><FormattedMessage id="Import Airdrop Transactions successfully."/></div>, {
            autoClose: true,
            closeButton: false,
            className: "top-info"
        });
    }

    initFormModel() {
        const self = this;
        self.form = new FormModel({...AirdropCreateModel}, {name: 'AirdropCreateModel'});
        const {coin} = self.props;

        self.form.onSuccess = function (form) {
            const formValues = form.values();
            const formData = {type: formValues.type, raw: formValues.raw, coin: coin};

            NetworkService.addAirdropTransaction(formData).subscribe(
                function onNext(response) {
                    console.log(response);
                    //self.notify();
                    self.callback(response);
                },
                function onError(e) {
                    console.log("onError")
                },
                function onCompleted() {
                }
            )
        }
    }

    componentDidMount() {
    }

    callback(response) {
        this.setState({saveHide: true})
        this.form.$("result").value = response
        //this.props.callback(response);
        //this.props.removeModal();
    }

    cancel() {
        this.props.removeModal();
    }

    render() {
        const self = this;
        const {types} = self.state;
        return (
            <div>
                <div>
                    <Form>
                        <Row>
                            <Col xs="12">
                                <Select field={self.form.$("type")} options={types}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <TextField field={self.form.$("raw")}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <TextField field={self.form.$("result")}/>
                            </Col>
                        </Row>
                        <Row className="mt-md">
                            <Col xs="12" className="text-right">
                                <Button color="secondary" onClick={() => self.cancel()}><FormattedMessage id="Cancel"/></Button>
                                <Button color="info" disabled={this.state.saveHide}
                                        onClick={self.form.onSubmit.bind(this)}><FormattedMessage
                                    id="Save"/></Button>
                            </Col>
                        </Row>
                    </Form>

                </div>
            </div>
        )
    }

}

AirdropAddModal.propTypes = {
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps, dispatch => ({dispatch}))(injectIntl(observer(AirdropAddModal)))
