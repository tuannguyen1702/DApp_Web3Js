import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Card, CardImg, CardText, CardBody, CardLink, CardTitle, CardSubtitle } from 'reactstrap';
import {Common} from "../../commons/consts/config";
import { CountDown, ProgressCrowdsale } from '../../components';
import { Icon } from '../../components';

class CountDownCrowdsale extends Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     softcap : props.softCap,
        //     hardcap : props.hardCap,
        //     estcap : props.estCap
        // }
    }

    render() {
        const {icoStartDate, endCountDown} = this.props
        var _icoStartDate = new Date(parseInt(icoStartDate) * 1000) ||  null
        return (
            <div className="CountdownCrowsale">
                <Row>
                    <Col sm={{size: 8, offset: 2}}>
                        <div className="heading-progress">Crowdsale Countdown:</div>
                        <CountDown endCountDown={endCountDown} date={_icoStartDate ? _icoStartDate : Common.ICOOpenDate} />
                    </Col>
                    <Col sm={12}>
                        <ProgressCrowdsale softCap={this.props.softCap} hardCap={this.props.hardCap} estCap={this.props.estCap} />
                    </Col>
                    <Col sm={{size: 8, offset: 2}} style={{textAlign: 'center', marginBottom: '30px'}}>
                        <Button onClick={() => { window.open("https://mozocoin.io/", "_blank")}} className="btn-info--orange" color="info"><FormattedMessage id="Learn more about MOZO" /></Button>
                        <Button onClick={() => { window.open("https://t.me/mozotoken", "_blank")}} className="btn-info--orange" color="info"><span className="svg-icon-container"><Icon name="telegram" /></span><FormattedMessage id="Join MOZO Telegram Channel" /></Button>
                    </Col>
                </Row>
            </div>
        )
    }

}


export default injectIntl(observer(CountDownCrowdsale))
