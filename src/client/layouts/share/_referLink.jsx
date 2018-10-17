import React, { Component } from "react";
import { IntlProvider } from 'react-intl';
import { APIConfig } from '../../network/API_Config';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Url } from '../../commons/consts/config';

class RefLink extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {

    if(!localStorage.getItem("referCode")){
      const refCode = this.props.params["refCode"]
      refCode && localStorage.setItem("referCode", refCode)
    }

    if(this.props.userInfo) {
      window.location = "/" + Url.buyToken
    } else {
      window.location = APIConfig.landingpage_domain
    }

    // if(this.props.checkDate["check-preopen-date"]) {
    //   window.location = "/" + Url.buyToken
    // } else {
    //   window.location = APIConfig.landingpage_domain
    // }
  }

  render() {
    return (
      <IntlProvider locale="en">
       <div id="loader"></div>
      </IntlProvider>
    );
  }
}


RefLink.propTypes = {
  userInfo: PropTypes.object,
  checkDate: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    checkDate: state.checkDate
  };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(RefLink);