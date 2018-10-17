import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { SupportModel } from "./supportModel"
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card, Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Table, Icon, Pagination } from '../../components'
import { Url } from '../../commons/consts/config';
import { browserHistory } from "react-router";
import moment from "moment";

class Support extends Component {
    constructor(props) {
        super(props)

        let { curPage, numberRowsOfPage, status } = props.params

        this.state = {
            supportList: [],
            showList: false,
            total: 0,
            curPage: curPage || 1,
            numberRowsOfPage: numberRowsOfPage || 10,
            status: status || 1,
            dropdownOpen: false,
            dropdownOpen_status: false
        }

        this.toggle = this.toggle.bind(this);
        this.toggle_status = this.toggle_status.bind(this);

        this.handleCreateSupport = this.handleCreateSupport.bind(this);

        this.supportListCol = [
            {
                name: <FormattedMessage id="ID" />,
                mapData: "id"
            },
            {
                name: <FormattedMessage id="Subject" />,
                mapData: "title",
                binding: (data) => {
                    return <a href={"/" + (props.currentUser.role == "user" ? Url.support : Url.supportAdmin) + "/" + Url.supportDetail + "/" + data.id}
                        onClick={(e) => this.goToTicketDetail(e, data.id)}>{data.title}</a>
                }
            },
            {
                name: <FormattedMessage id="Created" />,
                mapData: "createdAt",
                binding: (data) => {
                    return moment(data.createdAt).format("MM/DD/YYYY hh:mm:ss")
                }
            },
            {
                name: <FormattedMessage id="Last Active" />,
                mapData: "updatedAt",
                binding: (data) => {
                    return moment(data.updatedAt).format("MM/DD/YYYY hh:mm:ss")
                }
            },
            {
                name: <FormattedMessage id="Status" />,
                mapData: "status",
                className: "text-center",
                binding: (data, index) => {
                    return data.status == "pending" ? <div><span className="ticket__status ticket__status-pending"><FormattedMessage id="Pending" /></span> <div className="float-active-container"><Button color="info" onClick={() => this.closeTicket(data.id, index)}><FormattedMessage id="Close" /></Button></div> </div> : <span className="ticket__status ticket__status-closed"><FormattedMessage id="Closed" /></span>
                }

            }]

        this.itemNumberList = [{
            text: "10",
            value: 10
        },
        {
            text: "20",
            value: 20
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        }]

        this.statusList = [{
            text: "All",
            value: "1"
        },
        {
            text: "Pending",
            value: "2"
        },
        {
            text: "Closed",
            value: "3"
        }]
    }

    // componentDidUpdate() {
    //     const self = this
    //     const { currentUser, location } = self.props
    //     let { curPage, numberRowsOfPage, status } = self.props.params
    //     if (!curPage) curPage = self.state.curPage
    //     if (!numberRowsOfPage) numberRowsOfPage = self.state.numberRowsOfPage
    //     if (!status) status = self.state.status

    //     if (self.state.status != status ||
    //         self.state.curPage != curPage ||
    //         self.state.numberRowsOfPage != numberRowsOfPage) {

    //         self.setState({ curPage, numberRowsOfPage, status })

    //         if (!curPage) curPage = self.state.curPage
    //         if (!numberRowsOfPage) numberRowsOfPage = self.state.numberRowsOfPage
    //         if (!status) status = self.state.status

    //         curPage = parseInt(curPage)
    //         numberRowsOfPage = parseInt(numberRowsOfPage)

    //         if (!currentUser) {
    //             window.location = '/login#' + encodeURI(window.location.pathname.substring(1))
    //             return false
    //         }

    //         //if (currentUser.emailStatus == "confirmed") {

    //             var getSupportList = NetworkService.getSupportList({
    //                 skip: numberRowsOfPage * (curPage - 1),
    //                 status: (status == 'all') ? undefined : status,
    //                 limit: numberRowsOfPage
    //             })

    //             if (currentUser.role == "operator" || currentUser.role == "founder") {
    //                 getSupportList = NetworkService.getSupportListAll({
    //                     skip: numberRowsOfPage * (curPage - 1),
    //                     status: (status == 'all') ? undefined : status,
    //                     limit: numberRowsOfPage
    //                 })
    //             }

    //             getSupportList.subscribe(
    //                 function onNext(response) {
    //                     console.log("2", response)
    //                     self.setState({ supportList: response.data, total: response.total }, function () {
    //                         self.setState({ showList: true });
    //                     });
    //                 },
    //                 function onError(e) {
    //                     self.setState({ supportList: [] });
    //                 },
    //                 function onCompleted() {
    //                 }
    //             )
    //         //}

    //     }
    // }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    toggle_status() {
        this.setState(prevState => ({
            dropdownOpen_status: !prevState.dropdownOpen_status
        }));
    }

    componentDidMount() {
        this.initalData()
    }

    initalData(params = {}) {
        let self = this;

        const { currentUser, location } = self.props

        var curPage = params.curPage || self.state.curPage
        var numberRowsOfPage = params.numberRowsOfPage || self.state.numberRowsOfPage
        var status = params.status || self.state.status

        curPage = parseInt(curPage)
        numberRowsOfPage = parseInt(numberRowsOfPage)

        // self.props.resetBackHeader()

        if (!currentUser) {
            window.location = '/login#' + encodeURI(window.location.pathname.substring(1))
            return false
        }
        
        status = self.getStatusText(status).toLowerCase()
        
        var getSupportList = NetworkService.getSupportList({
            skip: numberRowsOfPage * (curPage - 1),
            status: (status == 'all') ? undefined : status,
            limit: numberRowsOfPage
        })

        if (currentUser.role == "operator" || currentUser.role == "founder") {
            getSupportList = NetworkService.getSupportListAll({
                skip: numberRowsOfPage * (curPage - 1),
                status: (status == 'all') ? undefined : status,
                limit: numberRowsOfPage
            })
        }

        getSupportList.subscribe(
            function onNext(response) {
                self.setState({ supportList: response.data, total: response.total }, function () {
                    self.setState({ showList: true });
                });
            },
            function onError(e) {
                self.setState({ supportList: [] });
            },
            function onCompleted() {
            }
        )
        //}

    }

    handleCreateSupport() {
        const self = this
        const { currentUser } = self.props

        browserHistory.push({
            pathname: "/" + (currentUser.role == "user" ? Url.support : Url.supportAdmin) + "/" + Url.createSupport
        });
    };

    goToTicketDetail(e, id) {
        const self = this
        const { currentUser } = self.props
        e.preventDefault()

        browserHistory.push({
            pathname: "/" + (currentUser.role == "user" ? Url.support : Url.supportAdmin) + "/" + Url.supportDetail + "/" + id
        });
    }

    closeTicket(id, index) {
        var self = this
        NetworkService.closeTicket(id).subscribe(
            function onNext(response) {
                const supportList = self.state.supportList
                supportList[index].status = "closed"
                self.setState({ supportList: supportList })
            },
            function onError(e) {

            },
            function onCompleted() {
            }
        )
    }

    getStatusText(value) {
        var item = _.filter(this.statusList, {value: value})
        var result = "All"
        if(!_.isEmpty(item)) {
            result = item[0].text
        }

        return result
    }

    changeItemNumber(value) {
        let self = this
        const { currentUser } = self.props
        let { status } = this.state
        this.setState({numberRowsOfPage: value, curPage: "1"})

        browserHistory.push("/" + (currentUser.role == "user" ? Url.support : Url.supportAdmin) + "/" + value + "/1/" + (status || 1))
        self.initalData({numberRowsOfPage: value, curPage: "1"})
       
    }

    changeStatus(value) {
        let self = this
        const { currentUser } = self.props
        let { numberRowsOfPage } = this.state
        this.setState({status: value, curPage: "1"})

        browserHistory.push("/" + (currentUser.role == "user" ? Url.support : Url.supportAdmin) + "/" + (numberRowsOfPage || 10) + "/1/" + value)
        self.initalData({status: value, curPage: "1"})
    }

    changePage(value) {
        let self = this
        const { currentUser } = self.props
        let { numberRowsOfPage, status } = this.state
        this.setState({curPage: value})

        browserHistory.push("/" + (currentUser.role == "user" ? Url.support : Url.supportAdmin) + "/" + (numberRowsOfPage || 10) + "/" + value + "/" + (status || 1))
        self.initalData({curPage: value})
    }

    renderItemsSupport(listArr) {
        if (!listArr.length) return;
        const items = listArr;
        const self = this
        const { currentUser } = self.props

        const listItem = items.map((supportInfo) =>
            <li className="item-ticket" key={supportInfo.id}>
                <div className="ticket">
                    <h3 className="ticket__title">
                        <a href={"/" + (currentUser.role == "user" ? Url.support : Url.supportAdmin) + "/" + Url.supportDetail + "/" + supportInfo.id}>{supportInfo.title}</a>
                    </h3>
                    <span className="ticket__time">{moment(supportInfo.updatedAt).format("L")}</span>
                    <span className="ticket__status ticket__status-pending">{supportInfo.status ? supportInfo.status : 'Pending'}</span>
                </div>
            </li>
        );
        return (
            <ul className="list-ticket">
                {listItem}
            </ul>
        )
    }

    render() {
        var self = this;
        const { currentUser, location } = self.props
        var { requestHistory, disabledRequest, total } = self.state
        let { curPage, numberRowsOfPage, status } = self.props.params
        if (!curPage) curPage = self.state.curPage
        if (!numberRowsOfPage) numberRowsOfPage = self.state.numberRowsOfPage
        if (!status) status = self.state.status

        curPage = parseInt(curPage)
        numberRowsOfPage = parseInt(numberRowsOfPage)
        return (
            <div>
                {currentUser ? <div><div className="main-title-container">
                    <h2 className="main-title"><FormattedMessage id="History Support" /></h2>
                    <Dropdown style={{ float: 'right', marginTop: 20 }} isOpen={this.state.dropdownOpen_status} toggle={this.toggle_status}>
                        <span style={{ marginRight: 10, fontWeight: 'bold' }}>Status: </span>
                        <DropdownToggle caret size="sm" style={{ padding: 5, paddingTop: 0, paddingBottom: 0, margin: 0 }}>
                            {self.getStatusText(status)}
                        </DropdownToggle>
                        <DropdownMenu>
                            {_.map(self.statusList, (item) => {
                                return <DropdownItem onClick={() => {
                                    self.changeStatus(item.value)
                                }} >{item.text}</DropdownItem>
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                    <div>
                        <div>
                            <Row>
                                <Col>
                                    {self.state.showList && <Table className="has-button-hide" tableData={self.state.supportList} colData={self.supportListCol} />}
                                </Col>
                            </Row>
                        </div>
                        {total > 10 && <Row style={{ minWidth: 620 }}>
                            <Col xs={2}>
                                <div >
                                    <Dropdown
                                        isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                        <div style={{ width: 200 }}>
                                            <span style={{ marginRight: 10, fontWeight: 'bold' }}>Show</span>
                                            <DropdownToggle caret size="sm" style={{ padding: 5, paddingTop: 0, paddingBottom: 0, margin: 0 }}>
                                                {numberRowsOfPage}
                                            </DropdownToggle>
                                            <span style={{ marginLeft: 10, fontWeight: 'bold' }}>items</span>
                                        </div>

                                        <DropdownMenu>
                                            {_.map(self.itemNumberList, (item) => {
                                                return <DropdownItem onClick={() => {
                                                    self.changeItemNumber(item.value)
                                                }} >{item.text}</DropdownItem>
                                            })}
                                        </DropdownMenu>
                                    </Dropdown>

                                </div>
                            </Col>
                            {total > numberRowsOfPage && <Col xs={10}>
                                <div style={{
                                    width: 450,
                                    float: 'right'
                                }}>
                                    <div style={{ float: 'right', marginRight: -5 }}>
                                        <Pagination key={Math.ceil(total / numberRowsOfPage) + curPage}
                                            number_of_page={
                                                Math.ceil(total / numberRowsOfPage)
                                            } onChange={(number) => {
                                                self.changePage(number)
                                            }} curPage={curPage}
                                        />
                                    </div>
                                </div>
                            </Col>}
                        </Row>}
                        <div className="controls">
                            <Button className="btn-create-support" style={{ marginTop: 20 }} color="primary" onClick={this.handleCreateSupport}>Create Ticket</Button>
                        </div>
                    </div>

                    {/* {currentUser.emailStatus != "unconfirmed" ?
                        <div>
                            <div>
                                <Row>
                                    <Col>
                                        {self.state.showList && <Table className="has-button-hide" tableData={self.state.supportList} colData={self.supportListCol} />}
                                    </Col>
                                </Row>
                            </div>
                            <Row style={{ minWidth: 620 }}>
                                <Col xs={2}>
                                    <div >
                                        <Dropdown
                                            isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                            <div style={{ width: 200 }}>
                                                <span style={{ marginRight: 10, fontWeight: 'bold' }}>Show</span>
                                                <DropdownToggle caret size="sm" style={{ padding: 5, paddingTop: 0, paddingBottom: 0, margin: 0 }}>
                                                    {numberRowsOfPage}
                                                </DropdownToggle>
                                                <span style={{ marginLeft: 10, fontWeight: 'bold' }}>items</span>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownItem onClick={() => {
                                                    browserHistory.push(SUPPORT_PATH + "5/1/" + status)
                                                }} >5</DropdownItem>
                                                <DropdownItem onClick={() => {
                                                    browserHistory.push(SUPPORT_PATH + "10/1/" + status)
                                                }} >10</DropdownItem>
                                                <DropdownItem onClick={() => {
                                                    browserHistory.push(SUPPORT_PATH + "20/1/" + status)
                                                }} >20</DropdownItem>
                                                <DropdownItem onClick={() => {
                                                    browserHistory.push(SUPPORT_PATH + "50/1/" + status)
                                                }} >50</DropdownItem>
                                                <DropdownItem onClick={() => {
                                                    browserHistory.push(SUPPORT_PATH + "100/1/" + status)
                                                }} >100</DropdownItem>
                                            </DropdownMenu>
                                         </Dropdown>

                                    </div>
                                </Col>
                                <Col xs={10}>
                                    <div style={{
                                        width: 450,
                                        float: 'right'
                                    }}>
                                        <div style={{ float: 'right', marginRight: -5 }}>
                                            <Pagination key={Math.ceil( total / numberRowsOfPage ) + curPage}
                                                number_of_page={
                                                Math.ceil( total / numberRowsOfPage )
                                            } onChange={(number) => {
                                                browserHistory.push(SUPPORT_PATH  + numberRowsOfPage + "/" + number + "/" + status)
                                            }}  curPage={curPage}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="controls">
                                <Button className="btn-create-support" style={{ marginTop: 20 }} color="primary" onClick={this.handleCreateSupport}>Create Ticket</Button>
                            </div>
                        </div> : <Alert color="secondary">
                            <span className="icon-message icon-left svg-icon-container"><Icon name="warning" className="icon icon-lg" /><FormattedMessage id="We only support this feature when your email has been verified. Please verify your email." values={{ br: <br /> }} /></span>

                        </Alert>} */}


                </div> : <div id="loader"></div>}
            </div>
        )
    }

}


export default injectIntl(observer(Support))
