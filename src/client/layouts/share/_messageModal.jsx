import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

class MessageModal extends React.Component {
    constructor(props) {
        super(props)
    }

    
    render() {
        var self = this
        const { mesId, values = {} } = self.props

        return (
            <div>
                <FormattedMessage id={mesId} values={values} />
            </div>

        )
    }
}

export default injectIntl((MessageModal))