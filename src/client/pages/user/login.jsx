import React, { Component } from "react";
import _ from 'lodash'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import FormModel from '../../commons/forms/_.extend'
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row } from 'reactstrap';

import { Url, Common } from '../../commons/consts/config';

class LoginComponent extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var self = this

        var { showLoginModal, userInfo, locale, checkDate } = self.props


        if (locale == null) {

            setTimeout(() => {
                self.props.showChooseLang()
            }, 300)

            return false
        }

        var { refCode } = self.props.params

        const now = new Date()

        // if (now <= new Date(Common.ICOOpenDate)) {
        if( !checkDate["check-preopen-date"] ){
            window.location = "/count-down"
        } else {
            if (!localStorage.getItem("token")) {
                setTimeout(() => {
                    showLoginModal()
                }, 300)
            } else {
                window.location = userInfo.role == "user" ? "/" : ("/" + Url.smartContract)
            }
        }
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
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        checkDate: state.checkDate,
        userInfo: state.userInfo,
        locale: state.locale
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(LoginComponent)))
