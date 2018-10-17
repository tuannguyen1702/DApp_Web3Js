import React, { Component } from "react";
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import Web3 from 'web3'
import { observer } from 'mobx-react';
import TransferTokenComponent from "./_transferToken"
import { injectIntl } from 'react-intl';

class TransferSaleToken extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        var self = this

        var { btcRequestID, transferType, ethAddress, coinNumber } = self.props.params
        var { web3 } = self.props

        var renderContent = () => {
            return <TransferTokenComponent parentProps={self.props} coinNumber={coinNumber} ethAddress={ethAddress} web3={web3} btcRequestID={btcRequestID}  type={"ico-contract"} transferType={transferType}/>
        }
        
        return (
            <div>
                {renderContent()}
            </div>

        )
    }

}


TransferSaleToken.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        web3: state.web3 || new Web3(Web3.givenProvider)
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(TransferSaleToken)))
