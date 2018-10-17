import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Card, CardImg, CardText, CardBody, CardLink, CardTitle, CardSubtitle, NavLink } from 'reactstrap';
import { CountDown } from '../../components'
import { browserHistory } from "react-router";
import { Common } from '../../commons/consts/config';

const teamList = [
    {
        country: "Global",
        name: "Giang Phung",
        email: "giang.phung@mozocoin.io",
        phone: ""
    },
    // {
    //     country: "Singapo",
    //     name: "Giang Phung",
    //     email: "demo.email@mozocoin.io",
    //     phone: "+85 018273193"
    // },
    // {
    //     country: "Singapo",
    //     name: "Giang Phung",
    //     email: "demo.email@mozocoin.io",
    //     phone: "+85 018273193"
    // },
    // {
    //     country: "Singapo",
    //     name: "Giang Phung",
    //     email: "demo.email@mozocoin.io",
    //     phone: "+85 018273193"
    // },
    // {
    //     country: "Singapo",
    //     name: "Giang Phung",
    //     email: "demo.email@mozocoin.io",
    //     phone: "+85 018273193"
    // },
    // {
    //     country: "Singapo",
    //     name: "Giang Phung",
    //     email: "demo.email@mozocoin.io",
    //     phone: "+85 018273193"
    // },
    // {
    //     country: "Singapo",
    //     name: "Giang Phung",
    //     email: "demo.email@mozocoin.io",
    //     phone: "+85 018273193"
    // },
    // {
    //     country: "Singapo",
    //     name: "Giang Phung",
    //     email: "demo.email@mozocoin.io",
    //     phone: "+85 018273193"
    // }
]

class CountDownComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            name: "",
            verified: false,
            error: false,
            activeName: ""
        }
    }

    componentDidMount() {

    }

    goToLoginPage() {
        browserHistory.push({
            pathname: "/user/login"
        })
    }

    rederContactList() {
        return <Row className="contact-container">
            {teamList.map((value) => {
                return <Col xs="12" sm="6" lg="4" xl="3">
                    <Card>
                        <CardBody>
                            <CardText>{value.country}</CardText>
                            <CardTitle>{value.name}</CardTitle>
                        </CardBody>
                        <CardBody className="link-area">
                            <div><i className="fas fa-envelope"></i><CardLink href={"mailto:" + value.email}> {value.email}</CardLink></div>
                            { !_.isEmpty(value.phone) && <div><i className="fas fa-phone"></i> <span>{value.phone}</span></div>}
                        </CardBody>
                    </Card>
                </Col>
            })}

        </Row>
    }

    render() {
        var self = this

        const {checkDate} = self.props
        return (
            <div>
                <div>
                {/* <NavLink style={{
                    position: "fixed",
                    top: "10px",
                    right: "10px"
                }} onClick={() => window.location = "/buy-token/0"}>
                            <FormattedMessage id="Login" /> <i className="fas fa-sign-in-alt"></i></NavLink> */}
                    <div className="main-title-container" >
                        {/* <h2 className="main-title"><FormattedMessage id="Signed up successful!" /></h2> */}

                    </div>
                    <div className="mozo-coin-container">
                        <div className="mozo-coin-main-container">
                            <div className="mozo-coin">
                            </div>
                        </div>
                    </div>
                    <div className="Countdown Countdown--wrapper">
                        <p className="heading"><FormattedMessage id="Token Sale will start on" values={{date: <b><FormattedMessage id="Token Sale start time" /></b>}}/></p>
                        <CountDown date={new Date(parseInt(checkDate["ico-start-date"]) * 1000)} />
                    </div>
                    <Row>
                        <Col>
                            <p className="heading mt-lg"><FormattedMessage id="If you want to join our Pre-Sale, send us an email to" values={{email: <a className="card-link" href={"mailto: presale@mozocoin.io"}>presale@mozocoin.io</a>}} /></p>
                        </Col>
                    </Row>
                    {/* {this.rederContactList()} */}

                </div>
            </div>

        )
    }

}

CountDownComponent.propTypes = {
    checkDate: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        checkDate: state.checkDate
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(CountDownComponent)))

