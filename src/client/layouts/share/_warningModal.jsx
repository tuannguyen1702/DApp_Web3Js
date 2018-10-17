import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup } from 'reactstrap';

class WarningModal extends React.Component {
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
        const { value } = self.props

        return (
            <div className="text-center custom-modal-content">
                <div className="warning-icon warning"></div>
                <h4 className="fail-message"><FormattedMessage id="WARNING" /></h4>
                <FormattedMessage id="You are sharing value of your comission with your investors. This action cannot be undone." values={{ br: <br />, value: <span className="info-text" >{value}%</span> }} />
                <Row className="mt-md">
                    <Col xs="12" className="text-center">
                        <Button style={{paddingLeft: "0", paddingRight: "0"}} color="link"
                            onClick={() => self.callBackHandle()} ><span className="info-text" ><FormattedMessage id="I agree to share" values={{value: value}}/></span></Button>
                        <Button style={{minWidth: "150px"}} color="info" onClick={() => self.cancel()} ><FormattedMessage id="Cancel" /></Button>
                    </Col>
                </Row>
            </div>

        )
    }
}

export default injectIntl((WarningModal))