import React from 'react';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Alert } from 'reactstrap';

class NumberBlock extends React.Component {
    constructor(props) {
        super(props)
    }

    callBackHandle() {
        this.props.callBackHandle();
        this.props.removeModal();
    }

    cancel() {
        this.props.removeModal();
    }

    render() {
        var self = this
        const { value, icon, title, unit, subText } = self.props

        return (
            <Alert className="number-block" color="secondary">
                <span className="icon-message icon-left lg-icon">
                    <span className="svg-icon-container">{icon}</span>
                    <span style={{ fontWeight: '600' }}><FormattedMessage id={title} /></span><br />
                    <span className="value-number primary-text">
                        <FormattedNumber
                            value={value}
                            style='decimal'
                            minimumFractionDigits={0}
                            maximumFractionDigits={2}
                        /> {unit}</span>
                        {subText && <span className="sub-text">{subText}</span>}
                </span>
            </Alert>

        )
    }
}

export default injectIntl((NumberBlock))