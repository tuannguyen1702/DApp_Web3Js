import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService";
import SocketService from "../../network/SocketService";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Collapse, CardBody, Card } from 'reactstrap';
import { TextField, DatePicker, Select, UploadImage, Progress } from '../../components'
import { Observable } from 'rxjs/Observable'
import Rx from 'rxjs/Rx';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import { Url, Common } from '../../commons/consts/config';

import MozoTokenComponent from "./smartDetailComps/mozoTokenComponent";
import IcoTokenComponent from "./smartDetailComps/icoTokenComponent";
import RefarralContractComponent from "./smartDetailComps/refarralContractComponent";
import InvestmentDiscountComponent from "./smartDetailComps/investmentDiscountComponent";

import MozoTokenChart from "./smartDetailComps/mozoTokens";
import IcoTokenChart from "./smartDetailComps/icoToken";
import TimelineBonusChart from "./smartDetailComps/timelineBonus";


// http://localhost:1337/api/v1/mozo-token-distribution
// http://localhost:1337/api/v1/ico-token-distribution
// http://localhost:1337/api/v1/presale-timeline-token-distribution


// http://localhost:1337/api/v1/presale-agency-token-distribution/3
// http://localhost:1337/api/v1/crowdsale-referral-distribution



let io;
const BtnChart = (props) => {
    return (
        <div className="btn-in-chart" onClick={props.onClick}>
            {props.children}
        </div>
    );
};

class SmartContractDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contract: null
        }


        // HANDLING
        this.handleCreateICO = this.handleCreateICO.bind(this);
    }

    componentDidMount() {
        var self = this
        self.props.backHeader("/" + Url.smartContract, "Back to Smart Contract List")

        let type = this.props.params.type;

        NetworkService.getContractByType(type).subscribe(
            function onNext(response) {
                self.setState({ contract: response.contracts })
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )

    }

    handleCreateICO(e) {
        e.preventDefault();
        // code for btn create ICO is here
        console.log('created ICO');
    };

    showComponent() {
        let type = this.props.params.type;
        var { contract } = this.state
        switch (type) {
            case "mozo-token-contract": return <MozoTokenComponent contract={contract} />
            case "ico-contract": return <IcoTokenComponent contract={contract} />
            case "treasury-contract": return;
            case "investment-discount-contract": return <InvestmentDiscountComponent contract={contract} />
            case "referral-contract": return <RefarralContractComponent contract={contract} />;
            case "vested-token-contract": return;
        }
    }

    render() {
        var self = this
        var { contract } = self.state
        return (
            <div>
                {contract != null ? <div className="main-title-container">
                    <Container fluid className="smart-contract-detail-block">
                        {this.showComponent()}
                    </Container>
                </div> : <div id="loader"></div>}
            </div>
        )
    }
}

export default injectIntl(observer(SmartContractDetail))