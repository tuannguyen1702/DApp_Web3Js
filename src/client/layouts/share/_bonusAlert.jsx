import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Collapse, Row, Col } from 'reactstrap';
import { Icon } from '../../components'

class BonusAlert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hideVerify: sessionStorage.getItem("showBonusWindow") == 'true' || sessionStorage.getItem("showBonusWindow") == null ? true : false
        }
    }

    render() {
        var self = this
        var { hideVerify } = self.state

        return (
            <div>
                <div className="bottom-right-content">
                    <div className={"bottom-right-content__header" + (!self.state.hideVerify ? " hidden" : "")}>
                        <span className="primary-text">Crowdsale Bonus</span>
                        <a onClick={() => {
                        self.setState({
                            hideVerify: !self.state.hideVerify }, function() {
                            sessionStorage.setItem("showBonusWindow", self.state.hideVerify);
                        })
                    }}><span className="svg-icon-container"><Icon name="arrow" /> { (!self.state.hideVerify) ? 'Show' : 'Hide'}</span></a>
                    </div>
                    <Collapse isOpen={hideVerify}>
                        <h4 className="primary-text"><b><FormattedMessage id="Crowdsale bonus" /></b></h4>
                        <Row style={{paddingTop: 10}} className="line-bottom">
                            <Col xs="3" className="text-center">
                                <h2 className="info-text"><b>20%</b></h2>
                                <span style={{top: -12, position: "relative"}} className="info-text"><b>Best deal</b></span>
                            </Col>
                            <Col style={{paddingTop: 18}} className="pl-none" xs="9">
                                <FormattedMessage id="Value or more in one transaction" values={{value: <b>50 ETH/5 BTC</b>}} />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: 10}} className="line-bottom">
                            <Col xs="3" className="text-center">
                                <h2 className="primary-text"><b>10%</b></h2>
                                <span style={{top: -12, position: "relative"}} className="primary-text"><b>Popular</b></span>
                            </Col>
                            <Col style={{paddingTop: 18}} className="pl-none" xs="9">
                                <FormattedMessage id="Value or more in one transaction" values={{value: <b>1 ETH/0.1 BTC</b>}} />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: 10}}>
                            <Col style={{paddingTop: 22}} xs="3" className="text-center">
                                <span><b>No bonus</b></span>
                            </Col>
                            <Col style={{paddingTop: 15}} className="pl-none" xs="9">
                                <FormattedMessage id="Value or more in one transaction" values={{value: <b>0.1 ETH/0.01 BTC</b>}} />
                            </Col>
                        </Row>
                    </Collapse>
                </div>
            </div>
        )
    }
}
export default injectIntl(observer(BonusAlert))
