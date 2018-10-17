import React from 'react';
import { Label, Input, FormText, FormGroup, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Fade } from 'reactstrap';
import { observer } from 'mobx-react';
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import FormModel from '../../commons/forms/_.extend'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import RadioButton from "../radioButton/RadioButton"
import TextField from '../textField/TextField'
import { getReadOnlyWeb3, wallets } from "../../commons/wallets"
import AddressModal from "./AddressModal"
import Rx from 'rxjs/Rx';
import { modal } from 'react-redux-modal'
import { changeWeb3Provider } from '../../actions'

const privateKeyModel = {
    fields: {
        privateKey: {
            value: '',
            type: 'text',
            label: 'Paste your private key',
            placeholder: 'Paste your private key',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        }
    }
}

class WalletOption extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            walletIndex: -1,
            showPrivateKey: false,
            modal: false,
            disabledBntConnectWallet: true,
            accountOptions: []
        }

        this.walletOptions = [
            { text: "Ledger Wallet", value: 0 },
            { text: "MetaMask", value: 1 }
            // { text: "Private Key", value: 2 }
        ]

        this.initFormModel()
        this.toggle = this.toggle.bind(this);
    }

    initFormModel() {
        var self = this
        self.privateKeyForm = new FormModel({ ...privateKeyModel }, { name: 'MozoToken' })
        self.privateKeyForm.onSuccess = function (form) {
            console.log(form.values());
        }
    }

    componentDidMount() {
        // var self = this
        // getReadOnlyWeb3((web3) => {
        //     self.web3 = web3
        //     web3.eth.estimateGas({
        //         data: "0x608060405234801561001057600080fd5b5060405160208061091a833981016040908152905160038054600160a060020a033316600160a060020a031990911681179091556064909102600181905560009182526020829052919020556108af8061006b6000396000f3006080604052600436106100c45763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100c9578063095ea7b31461015357806318160ddd1461018b57806323b872dd146101b2578063313ce567146101dc57806366188463146101f157806370a08231146102155780638da5cb5b1461023657806395d89b4114610267578063a9059cbb1461027c578063d73dd623146102a0578063dd62ed3e146102c4578063e7663079146102eb575b600080fd5b3480156100d557600080fd5b506100de610300565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610118578181015183820152602001610100565b50505050905090810190601f1680156101455780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561015f57600080fd5b50610177600160a060020a0360043516602435610337565b604080519115158252519081900360200190f35b34801561019757600080fd5b506101a06103a1565b60408051918252519081900360200190f35b3480156101be57600080fd5b50610177600160a060020a03600435811690602435166044356103a7565b3480156101e857600080fd5b506101a0610527565b3480156101fd57600080fd5b50610177600160a060020a036004351660243561052c565b34801561022157600080fd5b506101a0600160a060020a0360043516610625565b34801561024257600080fd5b5061024b610640565b60408051600160a060020a039092168252519081900360200190f35b34801561027357600080fd5b506100de61064f565b34801561028857600080fd5b50610177600160a060020a0360043516602435610686565b3480156102ac57600080fd5b50610177600160a060020a036004351660243561077f565b3480156102d057600080fd5b506101a0600160a060020a0360043581169060243516610821565b3480156102f757600080fd5b5061024b61084c565b60408051808201909152600a81527f4d6f7a6f20546f6b656e00000000000000000000000000000000000000000000602082015281565b600160a060020a03338116600081815260026020908152604080832094871680845294825280832086905580518681529051929493927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a350600192915050565b60015490565b6000600160a060020a03831615156103be57600080fd5b600160a060020a0384166000908152602081905260409020548211156103e357600080fd5b600160a060020a038085166000908152600260209081526040808320339094168352929052205482111561041657600080fd5b600160a060020a03841660009081526020819052604090205461043f908363ffffffff61085b16565b600160a060020a038086166000908152602081905260408082209390935590851681522054610474908363ffffffff61086d16565b600160a060020a03808516600090815260208181526040808320949094558783168252600281528382203390931682529190915220546104ba908363ffffffff61085b16565b600160a060020a038086166000818152600260209081526040808320338616845282529182902094909455805186815290519287169391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a35060019392505050565b600281565b600160a060020a0333811660009081526002602090815260408083209386168352929052908120548083111561058957600160a060020a0333811660009081526002602090815260408083209388168352929052908120556105c0565b610599818463ffffffff61085b16565b600160a060020a033381166000908152600260209081526040808320938916835292905220555b600160a060020a0333811660008181526002602090815260408083209489168084529482529182902054825190815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a35060019392505050565b600160a060020a031660009081526020819052604090205490565b600354600160a060020a031690565b60408051808201909152600481527f4d4f5a4f00000000000000000000000000000000000000000000000000000000602082015281565b6000600160a060020a038316151561069d57600080fd5b600160a060020a0333166000908152602081905260409020548211156106c257600080fd5b600160a060020a0333166000908152602081905260409020546106eb908363ffffffff61085b16565b600160a060020a033381166000908152602081905260408082209390935590851681522054610720908363ffffffff61086d16565b600160a060020a03808516600081815260208181526040918290209490945580518681529051919333909316927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a350600192915050565b600160a060020a0333811660009081526002602090815260408083209386168352929052908120546107b7908363ffffffff61086d16565b600160a060020a0333811660008181526002602090815260408083209489168084529482529182902085905581519485529051929391927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a350600192915050565b600160a060020a03918216600090815260026020908152604080832093909416825291909152205490565b600354600160a060020a031681565b60008282111561086757fe5b50900390565b60008282018381101561087c57fe5b93925050505600a165627a7a723058202fcb376453c0fe3c54bb09dddc2047d0899c443b5d0d7349563b140b142cebda0029"
        //     }).then((result)=>{

        //     })
        // })

    }

    componentWillReceiveProps(){
        var self = this
        const {walletIndex} = self.state
        const { field } = this.props
        if(field.value >=0 && walletIndex != field.value){
            self.onChange(field.value)
        }
    }

    onChange(value) {
        var self = this
        const wallet = wallets[value];

        self.setState({ disabledBntConnectWallet: true, walletIndex: value, showPrivateKey: value == 2 ? true : false })

        var getWeb3 = new Promise((resolve, reject) => {
            var web3 = wallet.getWeb3()
            resolve(web3)
        })

        getWeb3.then((web3) => {
            self.props.dispatch(changeWeb3Provider(web3))
            self.getAccounts()
        })
    }

    async getAccounts() {
        var self = this
        var { web3 } = self.props
        web3.eth.getAccounts((err, accounts) => {
            var accountOptions = []
            if (accounts) {
                accounts.map((account) => {
                    accountOptions.push({ text: account, value: account })
                })
            }

            self.setState({ accounts: accountOptions, disabledBntConnectWallet: false })

        })
    }

    setWallet(address){
        this.props.returnAddress(address)
    }

    connectToWallet() {
        var self = this
        var { web3 } = self.props

        var { accounts } = self.state

        if (accounts.length > 0) {
            modal.add(AddressModal, {
                accountOptions: accounts,
                defaultValue: accounts[0].value,
                web3: web3,
                unlockWalletCallBack: (value) => self.setWallet(value),
                title: self.translate(self.props.intl, "Please select the address you would like to interact with"),
                size: 'large', // large, medium or small,
                closeOnOutsideClick: false,
                hideTitleBar: false,
                hideCloseButton: false
            });
        }
        else {
            modal.add(AddressModal, {
                accountOptions: accounts,
                defaultValue: "",
                web3: web3,
                title: self.translate(self.props.intl, "Message"),
                size: 'small', // large, medium or small,
                closeOnOutsideClick: false,
                hideTitleBar: false,
                hideCloseButton: false
            });
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    translate(intl, idM) {
        var message = idM
        const text = message ? intl.formatMessage({ id: message }) : '';
        return text;
    }

    render() {
        var self = this
        const { showPrivateKey, walletIndex, disabledBntConnectWallet} = self.state
        const { field, className = '' } = this.props

        // if(field.value >=0 && walletIndex != field.value){
        //     self.onChange(field.value)
        // }

        return (
            <Row>
                <Col xs="12">
                    <RadioButton classNam={className} field={field} options={this.walletOptions}
                        onChange={(value) => self.onChange(value)}
                    />
                </Col>
                {showPrivateKey && <Col xs="12">
                    <TextField field={self.privateKeyForm.$("privateKey")} />
                </Col>}
                {walletIndex != -1 && <Col xs="12">
                    {!showPrivateKey ? <Button disabled={disabledBntConnectWallet} color="primary"
                        onClick={() => {
                            self.connectToWallet()
                        }} ><FormattedMessage id="Connect to your wallet" /></Button>
                        : <Button color="primary"
                            onClick={self.privateKeyForm.onSubmit.bind(this)} ><FormattedMessage id="Unlock" /></Button>
                    }
                </Col>}
            </Row>
        )
    }
}

WalletOption.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(WalletOption)))