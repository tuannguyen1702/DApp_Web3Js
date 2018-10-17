import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup } from 'reactstrap';
import { Icon } from '../../components'

class ReferralUserModal extends React.Component {
    constructor(props) {
        super(props)
    }

    callBackHandle() {
        const {callBackHandle } = this.props
        callBackHandle()
        this.props.removeModal();
    }

    cancel() {
        this.props.removeModal();
    }

    render() {
        var self = this
        const { email, rate } = self.props

        return (
            <div>

                <Form>
                    <Row>
                        <Col className="text-center" xs="12">
                            <span className="svg-icon-container users-icon"><Icon name="users" /></span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center" xs="12">
                            <FormattedMessage id="You are joining a referral program referred by friend email" values={{friendEmail: <b>{email}</b>}} /><br />
                            <FormattedMessage id="With each successful transaction, you will receive rate per total purchased token amount" values={{rate: <b>{rate}% </b>}} />
                        </Col>
                    </Row>
                    <Row className="mt-md">
                        <Col xs="12" className="text-center form-group">
                            <Button color="info"
                                onClick={() => self.callBackHandle()} ><FormattedMessage id="I know" /></Button>
                        </Col>
                    </Row>
                </Form>
            </div>

        )
    }
}

export default injectIntl((ReferralUserModal))

