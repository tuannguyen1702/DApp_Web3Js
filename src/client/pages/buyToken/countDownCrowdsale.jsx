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
    }

    render() {
        const {icoStartDate} = this.props
        return (
            <div className="CountdownCrowsale">
                <Row>
                    <Col sm={{size: 8, offset: 2}}>
                        <div className="heading-progress">Crowdsale Countdown:</div>
                        <CountDown date={icoStartDate ? new Date(icoStartDate).toISOString() : Common.ICOOpenDate} />
                    </Col>
                    <Col sm={12}>
                        <ProgressCrowdsale/>
                    </Col>
                    <Col sm={{size: 8, offset: 2}} style={{textAlign: 'center', marginBottom: '30px'}}>
                        <Button className="btn-info--orange" color="info"><FormattedMessage id="Learn more about MOZO" /></Button>
                        <Button className="btn-info--orange" color="info"><span className="svg-icon-container"><Icon name="telegram" /></span><FormattedMessage id="Join MOZO Telegram Channel" /></Button>
                    </Col>
                    {/*<Col sm={12} className="buy-mozo-use-eth">
                        <h4><strong>BUY MOZO TOKENS USING</strong> ETH WALLET ADDRESS</h4>
                    </Col>*/}
                </Row>
            </div>
        )
    }

}


export default injectIntl(observer(CountDownCrowdsale))
