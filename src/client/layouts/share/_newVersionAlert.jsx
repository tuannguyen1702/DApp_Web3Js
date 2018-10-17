import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

class NewVersionAlertModal extends React.Component {
    constructor(props) {
        super(props)
    }

    callBackHandle() {
        sessionStorage.setItem("version",  sessionStorage.getItem("newVer"))
        this.props.removeModal();
        sessionStorage.removeItem("versionAlertIsOpen")

        window.location = window.location.pathname
    }

    cancel() {
        this.props.removeModal();
    }

    componentWillMount() {
        sessionStorage.setItem("versionAlertIsOpen", true)
    }

    render() {
        var self = this
        const { value } = self.props

        return (
            <div className="text-center custom-modal-content">
                <div className="warning-icon setting"></div>
                <h4 className="fail-message"><FormattedMessage id="Sorry, this page is temporarily closed for maintenance" /></h4>
                <FormattedMessage id="We should be back shortly, thank you for your patience." /><br/><br/>
                <a onClick={() => self.callBackHandle()} className="info-text" ><FormattedMessage id="Refresh this page"/></a>
                
            </div>

        )
    }
}

export default injectIntl((NewVersionAlertModal))