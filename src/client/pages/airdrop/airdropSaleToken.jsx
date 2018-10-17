import React, {Component} from "react";
import {connect} from 'react-redux'
import PropTypes from "prop-types";
import Web3 from 'web3'
import {observer} from 'mobx-react';
import AirdropComponent from "./airdrop"
import {FormattedMessage, injectIntl} from 'react-intl';

class AirdropSaleToken extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const self = this;
        const {web3} = self.props;

        const renderContent = () => {
            return <AirdropComponent
                parentProps={self.props}
                title={<FormattedMessage id="Airdrop Mozo Sale Token"/>}
                web3={web3}
                contractType={"airdrop-smzo-contract"}
                coin={"SMZO"}/>
        };

        return (
            <div>
                {renderContent()}
            </div>

        )
    }

}

AirdropSaleToken.propTypes = {
    web3: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {web3: state.web3 || new Web3(Web3.givenProvider)};
};

export default connect(mapStateToProps, dispatch => ({dispatch}))(injectIntl(observer(AirdropSaleToken)))
