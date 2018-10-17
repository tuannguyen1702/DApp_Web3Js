import React, { Component } from "react";
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row } from 'reactstrap';

import { Url, Common, Origin } from '../../commons/consts/config';
import { utils } from '../../commons/utils'

class LoginComponent extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var self = this

        var { showLoginModal, locale } = self.props

        if (locale == null) {
            setTimeout(() => {
                self.props.showChooseLang()
            }, 300)
            
           
        } else{
            var { refCode } = self.props.params

            if (!localStorage.getItem("token")) {
                setTimeout(() => {
                    showLoginModal()
                }, 300)
            } else {
                self.goToPage()
            }
        }

        
    }

    goToPage() {
        var { userInfo, checkDate } = this.props
        utils.redirectAfterLogin(userInfo.role, userInfo.origin, checkDate)
    }

    render() {
        var self = this
        return (
            <Row>
            </Row>

        )
    }

}

LoginComponent.propTypes = {
    checkDate: PropTypes.object,
    userInfo: PropTypes.object,
    locale: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
        checkDate: state.checkDate,
        locale: state.locale
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(LoginComponent)))

