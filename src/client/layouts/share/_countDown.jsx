import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Row, Col, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Button, Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';
import logo from "../../images/logo2.png";
import { browserHistory } from "react-router";
import { injectIntl, IntlProvider, FormattedMessage, addLocaleData } from 'react-intl';

import zhLocaleData from 'react-intl/locale-data/zh'
import enLocaleData from 'react-intl/locale-data/en'
import koLocaleData from 'react-intl/locale-data/ko'
import zh_CNMessages from '../../langs/zh-CN.json';
import zh_TWMessages from '../../langs/zh-TW.json';
import enMessages from '../../langs/en-US.json';
import koMessages from '../../langs/ko-KR.json';
import ChooseLang from './_chooseLang';

import NetworkService from "../../network/NetworkService"

addLocaleData(zhLocaleData)
addLocaleData(enLocaleData)
addLocaleData(koLocaleData)

const messages = {
  zh_tw: zh_TWMessages,
  zh_cn: zh_CNMessages,
  ko: koMessages,
  en: enMessages
}

class CountDownLayout extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);
    this.state = {
      user: "",
      dropdownOpen: false,
      locale: props.locale ? props.locale.code : "en",
      langFile: props.locale ? props.locale.code : "en",
      langName: props.locale ? props.locale.text : "ENG",
    }
  }

  changeLang(lang) {
    this.setState({
      locale: (lang == "zh_tw" || lang == "zh_cn") ? "zh": lang,
      langFile: lang
    });
  }

  toggle() {
    console.log(!this.state.dropdownOpen)
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  goToUrl(url) {
    browserHistory.push({
      pathname: url
    });
  }

  render() {
    var self = this
    const {dispatch, children } = this.props;

    return (
      <IntlProvider locale={this.state.locale} messages={messages[this.state.langFile]}>
        <div className="count-down-page guest-page">
          <Container className="header" fluid={true}>
            <Row>
              <Col xs="12">
                <h1 className="logo-container">
                  <img src={logo} className="logo" alt="mozo"
                    onClick={() => {
                      window.location = '/'
                    }} />
                </h1>
              </Col>
            </Row>
          </Container>
          <Container className="content" fluid={true}>
            {children}
          </Container>
          <Container className="footer" fluid={true}>
            <Row>
              <Col>
                {/* ssssss */}
              </Col>
            </Row>
          </Container>
        </div>
      </IntlProvider >
    );
  }
}

CountDownLayout.propTypes = {
  dispatch: PropTypes.func.isRequired,
  locale: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    locale: state.locale
  };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(CountDownLayout);