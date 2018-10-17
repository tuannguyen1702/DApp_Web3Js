import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash"
import { Container, Row, Col, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Button, Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';
import logo from "../../images/logo.png";
import { browserHistory } from "react-router";
import { injectIntl, IntlProvider, FormattedMessage, addLocaleData, FormattedNumber } from 'react-intl';
import zhLocaleData from 'react-intl/locale-data/zh'
import enLocaleData from 'react-intl/locale-data/en'
import koLocaleData from 'react-intl/locale-data/ko'
import zh_CNMessages from '../../langs/zh-CN.json';
import zh_TWMessages from '../../langs/zh-TW.json';
import enMessages from '../../langs/en-US.json';
import koMessages from '../../langs/ko-KR.json';
import LoginModal from './_loginModal';
import ConfirmModal from './_confirmModal';
import WarningModal from './_warningModal';
import ReferralUserModal from './_referralUserModal';
import ChooseLang from './_chooseLang';
import { ToastContainer, toast } from 'react-toastify'

import NetworkService from "../../network/NetworkService"
import ReduxModal, { modal } from 'react-redux-modal'
import { setUserInfo } from '../../actions'
import { Langs } from '../../commons/consts/config';
import { utils } from '../../commons/utils';
import VerifyEmailMessage from './_verifyEmail';
import { Url, Origin } from '../../commons/consts/config';
import { onChangePassword } from '../../pages/user/changePassword'
import NewVersionAlert from './_newVersionAlert';
import moment from "moment"
import ICOStopped from "./_icoStopped"

addLocaleData(zhLocaleData)
addLocaleData(enLocaleData)
addLocaleData(koLocaleData)

const messages = {
  zh_tw: zh_TWMessages,
  zh_cn: zh_CNMessages,
  ko: koMessages,
  en: enMessages
}

class GuestLayout extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);

    this.state = {
      user: "",
      dropdownOpen: false,
      locale: props.locale ? props.locale.code : "en",
      langFile: props.locale ? props.locale.code : "en",
      langName: props.locale ? props.locale.text : "ENG",
      dropdownOpenLang: false,
      showLang: false,
      chooseLangIsSet: false,
      icoEnd: false,
      estCap: "31000000",
      noOfSoldTokens: "61500000000",
      noOfLeftTokens: "8500000000"
    }
  }

  changeLang(lang, langName) {
    localStorage.setItem("lang", lang)
    this.setState({
      locale: (lang == "zh_tw" || lang == "zh_cn") ? "zh" : lang,
      langFile: lang,
      langName: langName
    });
  }

  toggle() {
    console.log(!this.state.dropdownOpen)
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleLange() {
    this.setState({
      dropdownOpenLang: !this.state.dropdownOpenLang
    });
  }

  goToUrl(url) {
    browserHistory.push({
      pathname: url
    });
  }

  showModalConfirm(message, callBack) {
    var self = this
    modal.add(ConfirmModal, {
      title: "Message",
      size: 'small', // large, medium or small,
      mesId: message.id,
      callBackHandle: callBack,
      values: message.values || {},
      closeOnOutsideClick: false,
      hideTitleBar: false,
      hideCloseButton: false
    });
  }

  showModalWarning(value, callBack) {
    modal.add(WarningModal, {
      title: "Message",
      size: 'medium', // large, medium or small,
      callBackHandle: callBack,
      value: value,
      closeOnOutsideClick: false,
      hideTitleBar: true,
      hideCloseButton: false
    });
  }



  showLoginModal() {
    var self = this
    const origin = utils.getOrigin(self.props.location, self.props.params)
    modal.add(LoginModal, {
      title: "Login",
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: false,
      hideTitleBar: true,
      referralId: self.props.params["refCode"] || null,
      origin: origin,
      hideCloseButton: true,
      langName: self.state.langName,
      showMessage: (messageId) => self.showMessage(messageId)
    });
  }

  showRefrralUserModal(email, rate) {
    modal.add(ReferralUserModal, {
      email: email,
      rate: rate,
      title: "Login",
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: false,
      hideTitleBar: true,
      hideCloseButton: false,
      callBackHandle: () => {
        localStorage.removeItem("userRef_" + userInfo.emailAddress)
      }
    });
  }

  showChooseLang() {
    var self = this
    self.setState({ showLang: false, chooseLangIsSet: true })
    modal.add(ChooseLang, {
      title: "Login",
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: false,
      hideTitleBar: true,
      hideCloseButton: false
    });
  }

  logout() {
    localStorage.removeItem("token")
    this.props.dispatch(setUserInfo(null))
    window.location = "/login"
    // browserHistory.push({
    //   pathname: "/user/login"
    // });
  }

  showMessage(messageId) {
    toast.info(<div>
      <FormattedMessage id={messageId} />
    </div>,
      {
        autoClose: true,
        closeButton: false,
        className: "top-info"
      })
  }

  changepassword() {
    onChangePassword()
  }

  componentWillUpdate() {
    const checkVer = setTimeout(() => {
      const currentVer = sessionStorage.getItem("version")
      if (currentVer) {
        const newVer = sessionStorage.getItem("newVer")
        //const firstStart = sessionStorage.getItem("firstStart")
        const versionAlertIsOpen = sessionStorage.getItem("versionAlertIsOpen")

        if (currentVer != newVer && versionAlertIsOpen == undefined) {
          modal.add(NewVersionAlert, {
            title: "Login",
            size: 'medium', // large, medium or small,
            closeOnOutsideClick: false,
            hideTitleBar: true,
            hideCloseButton: true
          });
        }
      }

      //sessionStorage.removeItem("firstStart")

      clearTimeout(checkVer)
    }, 500)

  }

  componentDidMount() {
    var self = this
    setTimeout(() => {
      !self.state.chooseLangIsSet && self.setState({ showLang: true })
    }, 300)

    var { userInfo, checkDate } = self.props
    if (userInfo != null) {

      if (checkDate["check-ico-end-date"] != undefined) {
        self.setState({ icoEnd: checkDate["check-ico-end-date"] })
        var dateNow = (moment(new Date())).unix()
        var secondTotal = parseInt(checkDate["ico-end-date"]) - dateNow
        if (secondTotal > 0) {
          var endICOCountDown = setInterval(() => {

            secondTotal = secondTotal - 1
            console.log(secondTotal)
            if (secondTotal <= 0) {
              self.setState({ icoEnd: true })
              clearInterval(endICOCountDown)
            }

          }, 1000)
        } else {
          self.setState({ icoEnd: true })
        }
      }

      NetworkService.getDashboard().subscribe(
        function onNext(response) {
          if (response) {
            self.setState({
              estCap: !_.isEmpty(response.estCapConfig)? response.estCapConfig: "31000000",
              noOfSoldTokens: !_.isEmpty(response.noOfSoldTokens)? response.noOfSoldTokens: "61500000000",
              noOfLeftTokens: !_.isEmpty(response.noOfLeftTokens)? response.noOfLeftTokens: "8500000000",
            })
          }

        },
        function onError(e) {
          //self.setState({ isMozoAddress: false })
        },
        function onCompleted() {

        }
      )
    }
  }

  render() {
    var self = this
    const { dispatch, children, userInfo, locale, location, checkDate } = this.props;
    //console.log(self.props.location.pathname.indexOf("/user/login") < 0)

    var newChildren = React.Children.map(children, child =>
      React.cloneElement(child, {
        showRefrralUserModal: (email, rate) => self.showRefrralUserModal(email, rate),
        showLoginModal: () => self.showLoginModal(),
        currentUser: userInfo,
        showChooseLang: () => self.showChooseLang(),
        showConfirmModal: (message, callBack) => self.showModalConfirm(message, callBack),
        showModalWarning: (value, callBack) => self.showModalWarning(value, callBack),
      }));

    return (
      <IntlProvider locale={this.state.locale} messages={messages[this.state.langFile]}>

        <div className={"master-page" + ((this.state.icoEnd && userInfo.role == "user") ? " end-ico-removed" : "")}>
          <ToastContainer closeOnClick={false} hideProgressBar={true} style={{ width: "auto", minWidth: "250px" }} />
          <div className="header">
            <Container fluid={true}>
              {/* {(this.state.icoEnd && userInfo.role == "user") && <Row className="ico-end-header">
                <Col className="text-center" xs="12">
                  <h6 style={{margin: 0}}><b>CROWDSALE ENDED - <span style={{ color: "#113A4F" }}>$<FormattedNumber
                    value={parseFloat(this.state.estCap) / 1000000 || 0}
                    style='decimal'
                    minimumFractionDigits={0}
                    maximumFractionDigits={0}
                  />M RAISED</span></b></h6>
                  <b>{Math.round(parseInt(this.state.noOfSoldTokens) / 100000000) || 0}M</b> tokens sold, <b>{Math.round(parseInt(this.state.noOfLeftTokens) / 100000000) || 0}M</b> unsold tokens will be distributed to all buyers.
                </Col>
              </Row>} */}
              <Row>
                <Col xs="3">
                  <h1 className="logo-container">
                    <img src={logo} className="logo" alt="mozo"
                      onClick={() => {
                        window.location = '/'
                      }} />
                  </h1>
                  {/* <Button color="link" onClick={() => this.backHeader()}><i className="fas fa-arrow-left"></i> {self.state.backPageText}</Button> */}
                </Col>
                <Col xs="9" className="text-right">
                  <div className={"menu-btn d-none " + self.state.menuShow} color="link" onClick={() => self.showMenu()}>
                    <span></span>
                  </div>
                  <div className="avatar-container d-none d-md-block">
                    {!_.isEmpty(userInfo) && <Dropdown className="dropdown-name" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                      <DropdownToggle tag="span" caret>
                        <FormattedMessage id="Hello" />, {userInfo.emailAddress}
                      </DropdownToggle>
                      <DropdownMenu right={true}>
                        <DropdownItem onClick={() => self.changepassword()}>
                          <i className="fas fas fa-key"></i> <FormattedMessage id="ChangePassword" />
                        </DropdownItem>
                        <DropdownItem onClick={() => self.logout()}>
                          <i className="fas fa-sign-out-alt"></i> <FormattedMessage id="Logout" />
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>}
                    {checkDate && checkDate["check-ico-end-date"] != true && (userInfo != null && checkDate != null) && (checkDate["check-preopen-date"] && (location.pathname.indexOf("/" + Url.referral) < 0 && location.pathname.indexOf("/" + Url.support) < 0 ? <div className="dropdown-name" onClick={() => self.goToUrl("/" + Url.referral + "/" + Url.referralInfo)}><span className="box-label"><FormattedMessage id="Referral Program" /></span></div> :
                      <div className="dropdown-name" onClick={() => self.goToUrl("/" + Url.buyToken)}><span className="box-label"><FormattedMessage id="Buy Mozo Token" /></span></div>))}
                    {userInfo && ((userInfo.role == "user" && userInfo.origin == Origin.referral) && (location.pathname.indexOf("/" + Url.support) < 0 ? <div className="dropdown-name" onClick={() => self.goToUrl("/" + Url.support)}><span className="box-label"><FormattedMessage id="Support" /></span></div> :
                      (checkDate && checkDate["check-ico-end-date"] != true && <div className="dropdown-name" onClick={() => self.goToUrl("/" + Url.referral + "/info")}><span className="box-label"><FormattedMessage id="Refferal Program" /></span></div>)))}
                    {/* {this.state.showLang && <Dropdown className="dropdown-name" isOpen={this.state.dropdownOpenLang} toggle={() => self.toggleLange()}>
                      <DropdownToggle className="box-label" tag="span" caret>
                        {this.state.langName}
                      </DropdownToggle>


                      <DropdownMenu right={true}>
                        {Langs.map((item, index) => {
                          return <DropdownItem key={index} onClick={() => self.changeLang(item.code, item.text)}>
                            {item.text}
                          </DropdownItem>
                        })}
                      </DropdownMenu>
                    </Dropdown>} */}
                  </div>

                </Col>
              </Row>
            </Container>
          </div>
          {!_.isEmpty(userInfo) && userInfo.role == "user" && checkDate["check-ico-end-date"] == true && location.pathname.indexOf("/" + Url.support) < 0 ? <ICOStopped /> :
          <Container className="content" fluid={true}>
            <Row>
              <Col sm="12" className="main-content">
                <div className="bottom-right-area">
                  {
                    (userInfo && location.pathname.indexOf("/user/confirm") < 0) && (userInfo.emailStatus == "unconfirmed" && <VerifyEmailMessage userOrigin={userInfo.origin} messageId="We just send an email to ..." email={userInfo.emailAddress} />)
                  }
                </div>
                {newChildren}
              </Col>
            </Row>
          </Container>}
          <ReduxModal />
        </div>

      </IntlProvider>
    );
  }
}

GuestLayout.propTypes = {
  checkDate: PropTypes.object,
  userInfo: PropTypes.object,
  modals: PropTypes.object,
  locale: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    checkDate: state.checkDate,
    modals: state.modals,
    locale: state.locale
  };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(GuestLayout);
