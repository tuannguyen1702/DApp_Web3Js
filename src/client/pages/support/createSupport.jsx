import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormModel from '../../commons/forms/_.extend';
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { SupportModel } from "./supportModel";
import { TextField } from '../../components'
import { browserHistory } from "react-router";
import { Url } from "../../commons/consts/config";

class CreateSupportComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
        }
        this.initFormModel();
    }

    initFormModel() {
        var self = this;
        const { currentUser } = self.props
        self.createSupportFrm = new FormModel({ ...SupportModel }, { name: 'SupportModel' })

        self.createSupportFrm.onSuccess = function (form) {
            NetworkService.createSupport(form.values()).subscribe(
                function onNext() {
                    browserHistory.push({
                        pathname: "/" + (currentUser.role == "user"? Url.support : Url.supportAdmin)
                    });
                    //browserHistory.goBack()
                }
            );
        }
    }

    componentDidMount(){
        const { currentUser } = this.props
        if(!currentUser){
            window.location = '/login#' +  encodeURI(window.location.pathname.substring(1))
            return false
        }
    }
    render() {
        let self = this;
        const { currentUser } = this.props
        return (
            <Form>
                <Row className="main-title-container">
                    <Col xs={12} sm={8}>
                        <h2 className="main-title"><FormattedMessage id="Create Ticket" /></h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={8} xs={12}>
                        <FormGroup>
                            <TextField field={self.createSupportFrm.$('title')} />
                        </FormGroup>
                        <FormGroup>
                            <TextField field={self.createSupportFrm.$('content')} />
                        </FormGroup>
                        <Button color="info" onClick={self.createSupportFrm.onSubmit.bind(this)}><FormattedMessage id="Send" /></Button>
                        <Button color="secondary" onClick={()=>{
                            // browserHistory.push({
                            //     pathname: "/" + (currentUser.role == "user"? Url.support : Url.supportAdmin)
                            // });
                            browserHistory.goBack()
                        }}><FormattedMessage id="Cancel" /></Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
export default injectIntl(observer(CreateSupportComponent));