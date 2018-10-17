import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import _ from "lodash"
import FormModel from '../../commons/forms/_.extend';
import { injectIntl, FormattedMessage } from 'react-intl';
import NetworkService from "../../network/NetworkService";
import SocketService from "../../network/SocketService";
import { Url } from '../../commons/consts/config';
import moment from "moment"
import { ReplySupportModel } from "./supportModel";
import { modal } from 'react-redux-modal'

import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';
import { TextField } from '../../components'
import { browserHistory } from "react-router";


class SupportDetail extends Component {
    constructor(props) {
        super(props);
        var self = this
        this.state = {
            id: null,
            title: '',
            comments: [],
            createdAt: '',
            closed: true,
            notFound: false
        }

        this.initFormModel()
        //this.initLoadData()

        this.io = SocketService.getSupportDetail(self.props.params.id,
            function (body, JWR) {
                if (body == "Bad Request") {
                    self.setState({ notFound: true })
                } else {
                    self.showListComment(body)
                }
            },
            function (body, JWR) {
                if (body == "Bad Request") {
                    self.setState({ notFound: true })
                } else {
                    var oldCommentList = self.state.comments
                    oldCommentList.push(body)
                    self.updateListComment(oldCommentList)
                }
            })
    }

    initFormModel() {
        var self = this;
        self.replySupportFrm = new FormModel({ ...ReplySupportModel }, { name: 'ReplySupportModel' })


        self.replySupportFrm.onSuccess = function (form) {
            const id = self.props.params.id
            if (!_.isEmpty(form.values().content)) {
                NetworkService.replySupport(id, form.values().content).subscribe(
                    function onNext(response) {
                        console.log(response)
                        self.replySupportFrm.clear()
                    },
                    function onError(e) {
                        console.log("onError")
                    },
                    function onCompleted() {

                    }
                );
            } else {
                self.replySupportFrm.$("content").invalidate("This is a required field.")
            }

        }
    }

    showListComment(body) {
        let self = this;
        self.setState({
            id: body.id,
            comments: body.comments,
            title: body.title,
            createdAt: body.createdAt,
            closed: body.status == "closed" ? true : false
        })

    }

    updateListComment(oldCommentList) {
        let self = this;
        self.setState({
            comments: oldCommentList
        })
    }

    componentDidMount() {
        let self = this;

        const { currentUser } = self.props
        if (!currentUser) {
            window.location = '/login#' + encodeURI(window.location.pathname.substring(1))
            return false
        }


    }

    componentWillUnmount() {
        // if (this.io.socket.isConnected()) {
        //     this.io.socket.disconnect();
        // }
    }

    closeTicket() {
        var self = this
        const { id } = self.state

        self.props.showConfirmModal({ id: "Are you sure to close this ticket?" }, () => {
            NetworkService.closeTicket(id).subscribe(
                function onNext(response) {
                    self.setState({ closed: true })
                },
                function onError(e) {

                },
                function onCompleted() {
                }
            )
        })
    }

    renderComments() {
        var self = this
        const { comments } = self.state
        return <ul className="comments">{
            comments.map((value, index) => {
                if (!_.isEmpty(value.message)) {
                    return <li key={index} className="comment">
                        <p dangerouslySetInnerHTML={{ __html: value.message.replace(/\r\n|\r|\n/g, "<br />") }}>
                        </p>
                        <p className="comment-info">
                            <span className="comment_author">{value.sender}</span> - <span>{moment(new Date(value.updatedAt)).format("hh:mm:ss A MM/DD/YYYY")}</span>
                        </p>
                    </li>
                }
            })
        }
        </ul>
    }

    render() {
        var self = this
        var { comments, notFound } = self.state
        var { currentUser } = self.props

        return (
            <div>
                <div className="main-title-container">
                    <Row>
                        <Col xs={12} sm={8}>
                            <h2 className="main-title"><FormattedMessage id="History Support" /></h2>
                            {/* <p><FormattedMessage id="Lorem Ipsum is simply dummy text of the printing and typesetting industry." /></p> */}
                        </Col>
                    </Row>
                </div>
                {notFound ?<div> <Alert color="dark">
                    <FormattedMessage id="Not found" />
                </Alert> 
                <Button color="secondary" onClick={() => {
                                    // browserHistory.push({
                                    //     pathname: "/" + (currentUser.role == "user" ? Url.support : Url.supportAdmin)
                                    // });
                                    browserHistory.goBack()
                                }}>
                                     <FormattedMessage id="Back" />
                                </Button>
                </div> :
                    <div>
                        <Row>
                            <Col xs={12} sm={8}>
                                <div className="ticket ticket-no-bgColor">
                                    <h3 className="ticket__title large">
                                        {self.state.title}
                                    </h3>
                                    {!self.state.closed ? <div><span className="ticket__status ticket__status-pending"><FormattedMessage id="Pending" /></span>&nbsp;&nbsp;<Button color="info" onClick={() => self.closeTicket()}><FormattedMessage id="Close" /></Button></div> : <span className="ticket__status ticket__status-closed"><FormattedMessage id="Closed" /></span>}

                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={8}>
                                {/* {comments && self.renderComments()} */}
                                {<ul className="comments">{
                                    comments.map((value, index) => {
                                        if (!_.isEmpty(value.message)) {
                                            return <li key={index} className="comment">
                                                <p dangerouslySetInnerHTML={{ __html: value.message.replace(/\r\n|\r|\n/g, "<br />") }}>
                                                </p>
                                                <p className="comment-info">
                                                    <span className="comment_author">{value.sender}</span> - <span>{moment(new Date(value.updatedAt)).format("hh:mm:ss A MM/DD/YYYY")}</span>
                                                </p>
                                            </li>
                                        }
                                    })
                                }
                                </ul>}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={8}>
                                {!self.state.closed && <FormGroup>
                                    <TextField field={self.replySupportFrm.$('content')} />
                                </FormGroup>}
                                {!self.state.closed && <Button color="info" onClick={self.replySupportFrm.onSubmit.bind(this)}><FormattedMessage id="Reply" /></Button>}
                                <Button color="secondary" onClick={() => {
                                    // browserHistory.push({
                                    //     pathname: "/" + (currentUser.role == "user" ? Url.support : Url.supportAdmin)
                                    // });
                                    browserHistory.goBack()
                                }}>
                                    {!self.state.closed ? <FormattedMessage id="Cancel" /> : <FormattedMessage id="Back" />}
                                </Button>
                            </Col>
                        </Row>
                    </div>}
            </div>
        )
    }
}
export default injectIntl(observer(SupportDetail));