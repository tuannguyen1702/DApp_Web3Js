import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Fade } from 'reactstrap';

class KycAlert extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        var self = this
        var { showKYC = false, closeHandle } = self.props
        return (
            <div>
                <Fade hidden={!showKYC} className="bottom-right-content">
                    <div className={"bottom-right-content__header"}>
                        <a onClick={() => {
                            closeHandle()
                        }}><span className="svg-icon-container">✖ Close</span></a>
                    </div>
                    <div className="bottom-right-content__content">

                        <div className="bottom-right-content-icon kyc-icon"></div>
                        <div className="bottom-right-content__content-right">
                            <h5 className="fail-message"><FormattedMessage id="AML/KYC Required" /></h5>
                            <p><FormattedMessage id="Investors who wish to invest more than 19,999 SGD (or 15,000 USD) are required going throung AML/KYC procedure." /></p>
                            <a target="_blank" href="//news.mozocoin.io/index.php/2018/07/18/instruction-aml-kyc-verification-on-mozo-platform/" className="info-text pl-none" style={{ textDecoration: "underline" }} ><span><FormattedMessage id="Instruction AML/KYC verification on Mozo platform" /></span></a>
                        </div>
                    </div>
                </Fade>
            </div>
        )
    }
}
export default injectIntl(observer(KycAlert))
