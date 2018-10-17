import React from 'react';
import { Label, Input, FormText, FormGroup, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Fade } from 'reactstrap';
import { observer } from 'mobx-react';
import FormModel from '../../commons/forms/_.extend'
import { injectIntl, FormattedMessage } from 'react-intl';
import RadioButton from "../radioButton/RadioButton"
import TextField from '../textField/TextField'

const addressModel = {
    fields: {
        address: {
            value: -1,
            type: 'radio',
            label: 'Address',
            placeholder: 'Address',
            options: {
                validateOnChange: true,
            },
        }
    }
}



class AddressModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            accountOptions: []
        }

        this.initFormModel()
    }

    initFormModel() {
        var self = this
        addressModel.fields.address.value = self.props.defaultValue

        self.addressForm = new FormModel({ ...addressModel }, { name: 'MozoToken' })
        self.addressForm.onSuccess = function (form) {
            console.log(form.values());
        }
    }

    removeThisModal() {
        this.props.removeModal();
    }
    componentDidMount() {
        //this.getAccounts()
    }

    unlockWallet() {
        var self = this
        self.props.unlockWalletCallBack(self.addressForm.$("address").value)
        this.props.removeModal();
    }


    render() {
        var self = this
        const { accountOptions, className = '' } = self.props

        return (
            <div>
                {accountOptions.length > 0 ?
                    <div>
                        <div>
                            <RadioButton classNam={className} field={self.addressForm.$("address")} options={accountOptions} />
                        </div>
                        <Button color="primary" onClick={() => self.unlockWallet()}><FormattedMessage id="Unlock" /></Button>
                    </div> : <div>
                        <FormattedMessage id="Can't get your address" />
                    </div>
                }
            </div>
        )
    }
}

export default injectIntl(observer(AddressModal))