import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Row, Col, Button } from 'reactstrap';
import { browserHistory } from "react-router";
import { Url } from '../../commons/consts/config';

class ICOStopped extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Container className="text-center main-content content ico-stoppped" fluid={true}>
                <Row>
                    <Col>
                        <div className="ico-stop-img"></div>
                    </Col>
                </Row>
                <Row >
                    <Col xs="12">
                        <p>
                            <FormattedMessage id="The 1st tranche is already ended, 2nd tranche will start from November, 2018. Back to homepage to get more information." values={{fromDate: <span className="primary-text"><b>November, 2018</b></span>, br: <br/>, homepage: <a href="//mozocoin.io"><b>home page</b></a>}} />
                        </p>
                        <Button onClick={()=>{
                            browserHistory.push({
                                pathname: "/" + Url.support + "/" + Url.createSupport
                            });
                        }} color="primary" >Send Us Support Ticket</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default injectIntl(observer(ICOStopped))
