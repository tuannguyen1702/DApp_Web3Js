import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Container, Col, Row, Button, Form, FormGroup } from 'reactstrap';

class ConfirmModal extends React.Component {
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
        const { mesId, values = {} } = self.props

        return (
            <div>
                <Form>
                    <Row>
                        <Col xs="12">
                            <FormattedMessage id={mesId} values={values} />
                        </Col>
                    </Row>
                    <Row className="mt-md">
                        <Col xs="12" className="text-right">
                            <Button color="info"
                                onClick={() => self.callBackHandle()} ><FormattedMessage id="OK" /></Button>
                            <Button color="secondary" onClick={() => self.cancel()} ><FormattedMessage id="Cancel" /></Button>
                        </Col>
                    </Row>
                </Form>
            </div>

        )
    }
}

export default injectIntl((ConfirmModal))
