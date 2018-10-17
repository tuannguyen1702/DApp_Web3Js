import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Alert } from 'reactstrap';
import { Common } from '../../../commons/consts/config';
import { Icon } from "../../../components";

class TransactionStatus extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { contract, reCreateContractCallBack } = this.props
        return (
            <div>
                <Alert color="secondary">
                    <FormattedMessage id="Your TX has been broadcast to the network" values={{ br: <br />, hash: <a target="_blank" href={Common.ethNetworkUrl + "/tx/" + contract.txnHash}>{contract.txnHash}</a> }} />
                    <br /><br /><a target="_blank" href={Common.ethNetworkUrl + "/tx/" + contract.txnHash}><i><FormattedMessage id="View your transaction" /></i></a>
                </Alert>
                {contract.txnStatus == "failed" ?  <div><Alert color="dark">
                    <span className="fail-message svg-icon-container"><Icon name="warning" className="icon" /><FormattedMessage id="Create a smart contract failed. Please re-create it." /></span>
                </Alert> <Button color="info" onClick={() => reCreateContractCallBack()}><FormattedMessage id="Re-create" /></Button>
                </div> : <Alert color="dark">
                       <span className="loading"><FormattedMessage id="Waiting for confirmation" /></span>
                    </Alert>
                }
            </div>
        )
    }
}
export default injectIntl(observer(TransactionStatus))