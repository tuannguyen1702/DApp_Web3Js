import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash"
import { Container, Row, Col, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, Dropdown, DropdownMenu, DropdownItem, Button, Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap';
import logo from "../../images/logo.png";
import userDefault from "../../images/user-default.png";
import { browserHistory } from "react-router";
import { injectIntl, IntlProvider, FormattedMessage, addLocaleData, FormattedNumber } from 'react-intl';
import zhLocaleData from 'react-intl/locale-data/zh'
import enLocaleData from 'react-intl/locale-data/en'
import koLocaleData from 'react-intl/locale-data/ko'
import zh_CNMessages from '../../langs/zh-CN.json';
import zh_TWMessages from '../../langs/zh-TW.json';
import enMessages from '../../langs/en-US.json';
import koMessages from '../../langs/ko-KR.json';
import { Url, Origin } from '../../commons/consts/config';
import { isAnonymousUrl } from '../../commons/permission';
import ReduxModal, { modal, actions } from 'react-redux-modal'
import MessageModal from './_messageModal';
import ConfirmModal from './_confirmModal';
import LoginModal from './_loginModal';
import VerifyEmailMessage from './_verifyEmail';
import BonusAlert from './_bonusAlert';
import KycAlert from './_kycAlert';
import { setUserInfo } from '../../actions'
import ReferralUserModal from './_referralUserModal';
import NewVersionAlert from './_newVersionAlert';
import ICOStopped from "./_icoStopped"

import { Langs } from '../../commons/consts/config';
import { utils } from '../../commons/utils';
import { onChangePassword } from '../../pages/user/changePassword'
import moment from "moment"
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

class MasterLayout extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this);
    this.toggleLange = this.toggleLange.bind(this);
    this.state = {
      user: "",
      dropdownOpen: false,
      dropdownOpenLang: false,
      locale: props.locale ? props.locale.code : "en",
      langFile: props.locale ? props.locale.code : "en",
      langName: props.locale ? props.locale.text : "ENG",
      avatar: props.userInfo != null ? props.userInfo.avatarImageId : userDefault,
      menuShow: '',
      backPageURL: "/",
      backPageText: <FormattedMessage id="Back to Homepage" />,
      showKYC: false,
      icoEnd: false,
      estCap: "31000000",
      noOfSoldTokens: "61500000000",
      noOfLeftTokens: "8511100000"
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
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleLange() {
    this.setState({
      dropdownOpenLang: !this.state.dropdownOpenLang
    });
  }

  checkEmailStatus() {
    const { userInfo, location } = this.props;
    if (userInfo.emailStatus == "unconfirmed") {
      return true
    } else {
      return false
    }
  }

  checkICODay() {
    const now = new Date()
    const { userInfo, checkDate } = this.props;

    if (!checkDate["check-preopen-date"]) {
      // if (now <= new Date(Common.ICOOpenDate)) {
      if (userInfo != null) {
        if (userInfo.role == 'user') {
          browserHistory.push({
            pathname: "/count-down"
          })
        } else {
          browserHistory.push({
            pathname: window.location.pathname
          })
        }
      } else {
        browserHistory.push({
          pathname: "/count-down"
        })
      }


    } else {
      if (!localStorage.getItem("token")) {
        browserHistory.push({
          pathname: "/user/login"
        });
      }
    }
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
    var { userInfo, location, checkDate } = self.props
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
              estCap: !_.isEmpty(response.estCapConfig) ? response.estCapConfig : "31000000",
              noOfSoldTokens: !_.isEmpty(response.noOfSoldTokens) ? response.noOfSoldTokens : "61500000000",
              noOfLeftTokens: !_.isEmpty(response.noOfLeftTokens) ? response.noOfLeftTokens : "8500000000",
            })
          }

        },
        function onError(e) {
          //self.setState({ isMozoAddress: false })
        },
        function onCompleted() {

        }
      )

      if (userInfo.role == 'user') {
        if ((location.pathname == "/" || location.pathname.indexOf("/" + Url.buyToken) >= 0)) {
          this.checkICODay()
        } else {
          window.location = "/" + Url.buyToken
        }
      } else {
        this.checkICODay()
      }
    } else {
      this.checkICODay()
    }

  }

  goToUrl(url) {
    this.showMenu()
    browserHistory.push({
      pathname: url
    });
  }

  backHeader() {
    var self = this
    browserHistory.push({
      pathname: self.state.backPageURL
    });
  }

  showMenu() {
    this.setState({ menuShow: !this.state.menuShow ? "show" : "" })
  }

  changepassword() {
    onChangePassword()
  }

  logout() {
    localStorage.removeItem("token")
    this.props.dispatch(setUserInfo(null))
    window.location = "/login"
    // browserHistory.push({
    //   pathname: "/user/login"
    // });
  }

  showLoginModal() {
    modal.add(LoginModal, {
      title: "Login",
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: false,
      hideTitleBar: true,
      hideCloseButton: true
    });
  }

  showKYC() {
    this.setState({ showKYC: true })
  }

  setActive(url) {
    const { location } = this.props;
    var activeClass = ""

    if (location.pathname.indexOf("/" + url) >= 0) {
      activeClass = "active"
    }

    if (url == Url.dashBoard && (location.pathname == "/" || location.pathname == "")) {
      activeClass = "active"
    }

    return activeClass
  }

  showModalMessage(message) {
    var self = this
    var modalID = modal.add(MessageModal, {
      title: "Message",
      size: 'small', // large, medium or small,
      mesId: message.id,
      //id: "MessageModal",
      values: message.values || {},
      closeOnOutsideClick: false,
      hideTitleBar: false,
      hideCloseButton: false
    });
  }

  closeModal(callBack) {
    this.props.dispatch(actions.clearAll())

    var deplayTime = setTimeout(() => {
      callBack()
      clearTimeout(deplayTime)
    }, 500)
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

  showRefrralUserModal(email, rate) {
    var self = this
    var { userInfo } = self.props
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

  transferMozoToken() {
    browserHistory.push({
      pathname: "/" + Url.transferToken + "/to-eth-address/mozo-token-contract/unknow-address/unknow-number/0"
    });
  }

  transferMozoSaleToken() {
    browserHistory.push({
      pathname: "/" + Url.transferToken + "/to-eth-address/ico-contract/unknow-address/unknow-number/0"
    });
  }

  render() {
    var self = this
    const { children, userInfo, location, checkDate } = this.props;

    var newChildren = React.Children.map(children, child =>
      React.cloneElement(child, {
        backHeader: (url, text) => self.setState({ backPageURL: url, backPageText: <FormattedMessage id={text} /> }),
        resetBackHeader: () => self.setState({ backPageURL: "/", backPageText: <FormattedMessage id="Back to Homepage" /> }),
        showMessgageModal: (message) => self.showModalMessage(message),
        showConfirmModal: (message, callBack) => self.showModalConfirm(message, callBack),
        checkEmailStatus: () => self.checkEmailStatus(),
        showLoginModal: () => self.showLoginModal(),
        currentUser: userInfo,
        closeModal: (callBack) => self.closeModal(callBack),
        showRefrralUserModal: (email, rate) => self.showRefrralUserModal(email, rate),
        showKYC: () => { self.showKYC() }
      }));

    return (
      <IntlProvider locale={this.state.locale} messages={messages[this.state.langFile]}>
        {userInfo != null ?
          <div className={"master-page " + userInfo.role + ((this.state.icoEnd && userInfo.role == "user") ? " end-ico-removed" : "")}>
            <div className="header">
              <Container fluid={true}>
                {/* {(this.state.icoEnd && userInfo.role == "user") && <Row className="ico-end-header">
                  <Col className="text-center" xs="12">
                    <h6 style={{ margin: 0 }}><b>CROWDSALE ENDED - <span style={{ color: "#113A4F" }}>$<FormattedNumber
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
                      {!_.isEmpty(userInfo.emailAddress) && <Dropdown className="dropdown-name" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
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
                      {/* {userInfo.role == "anonymous" ?
                        <div className="dropdown-name"><span className="box-label box-label-info"><FormattedMessage id="Guest" /></span></div>
                        : <div className="dropdown-name"><span><FormattedMessage id="Hello" />, {userInfo.emailAddress}</span></div>} */}
                      {(userInfo.role == "user" && checkDate["check-ico-end-date"] != true) && <div className="dropdown-name"><span className="box-label box-label-info"><a target="_blank" href="http://news.mozocoin.io/index.php/2018/07/17/how-to-buy-mozo-tokens" ><FormattedMessage id="How To Buy" /></a></span></div>}
                      {(userInfo != null && checkDate != null) && ((userInfo.role == "user" && userInfo.origin == Origin.referral && checkDate["check-preopen-date"] && checkDate["check-ico-end-date"] != true) && (<div className="dropdown-name" onClick={() => self.goToUrl("/" + Url.referral + "/" + Url.referralInfo)}><span className="box-label"><FormattedMessage id="Referral Program" /></span></div>))}
                      {userInfo.role == "user" && (location.pathname.indexOf("/" + Url.support) < 0 ? <div className="dropdown-name" onClick={() => self.goToUrl("/" + Url.support)}><span className="box-label"><FormattedMessage id="Support" /></span></div> :
                        <div className="dropdown-name" onClick={() => self.goToUrl("/" + Url.buyToken)}><span className="box-label"><FormattedMessage id="Buy Mozo Token" /></span></div>)}
                      {/* {!_.isEmpty(userInfo.emailAddress) && <div className="dropdown-name"><span><FormattedMessage id="Hello" />, {userInfo.emailAddress}</span></div>} */}
                      <Dropdown className="dropdown-name" isOpen={this.state.dropdownOpenLang} toggle={this.toggleLange}>
                        {/* <DropdownToggle className="box-label" tag="span" caret>
                          {this.state.langName}
                        </DropdownToggle>
                        <DropdownMenu right={true}>
                          {Langs.map((item, index) => {
                            return <DropdownItem key={index} onClick={() => self.changeLang(item.code, item.text)}>
                              {item.text}
                            </DropdownItem>
                          })}
                        </DropdownMenu> */}
                      </Dropdown>
                      {/* <div className="dropdown-name">
                        {userInfo.role != "anonymous" ? <NavLink onClick={() => self.logout()}>
                          <i className="fas fa-sign-out-alt"></i> <FormattedMessage id="Logout" /></NavLink> :
                          <NavLink onClick={() => self.showLoginModal()}>
                            <FormattedMessage id="Login" /> <i className="fas fa-sign-in-alt"></i></NavLink>}
                      </div> */}
                    </div>

                  </Col>
                </Row>
              </Container>
            </div>

            {userInfo.role == "user" && checkDate["check-ico-end-date"] == true ? <ICOStopped /> :
              <Container className="content" fluid={true}>
                <Row>
                  <Col className={"sidebar " + self.state.menuShow}>
                    <div>
                      <h1 className="logo-container">
                        <img src={logo} className="logo" alt="mozo"
                          onClick={() => {
                            window.location = '/'
                          }} />
                      </h1>
                    </div>
                    <Nav vertical>
                      <NavItem>
                        <NavLink className={self.setActive(Url.dashBoard)} onClick={() => self.goToUrl("/" + Url.dashBoard)}>
                          <FormattedMessage id="Dashboard" /></NavLink>
                      </NavItem>
                      {/* <NavItem>
                      <NavLink className={self.setActive(Url.checkAddress)} onClick={() => self.goToUrl("/" + Url.checkAddress)}>
                        <FormattedMessage id="Check Mozo Address" /></NavLink>
                    </NavItem> */}
                      {userInfo.role.toUpperCase() == "FOUNDER" &&
                        <NavItem>
                          <NavLink className={self.setActive(Url.smartContract)} onClick={() => self.goToUrl("/" + Url.smartContract)}>
                            <FormattedMessage id="Smart Contract" /></NavLink>
                        </NavItem>
                      }
                      {userInfo.role.toUpperCase() == "FOUNDER" &&
                        <NavItem>
                          <NavLink className={self.setActive("to-eth-address/mozo-token-contract")} onClick={() => self.transferMozoToken()}>
                            <FormattedMessage id="Transfer Mozo Token" /></NavLink>
                        </NavItem>
                      }

                      {userInfo.role.toUpperCase() == "FOUNDER" &&
                        <NavItem>
                          <NavLink className={self.setActive("to-eth-address/ico-contract")} onClick={() => self.transferMozoSaleToken()}>
                            <FormattedMessage id="Transfer Mozo Sale Token" /></NavLink>
                        </NavItem>
                      }

                      {userInfo.role.toUpperCase() == "FOUNDER" &&
                        <NavItem>
                          <NavLink className={self.setActive(Url.transferBonus)} onClick={() => self.goToUrl("/" + Url.transferBonus)}>
                            <FormattedMessage id="Transfer Bonus Token" /></NavLink>
                        </NavItem>
                      }
                      {userInfo.role.toUpperCase() == "FOUNDER" &&
                        <NavItem>
                          <NavLink className={self.setActive(`${Url.airdropToken}/airdrop-mozo-contract`)}
                            onClick={() => self.goToUrl(`/${Url.airdropToken}/airdrop-mozo-contract`)}>
                            <FormattedMessage id="Airdrop Mozo Token" /></NavLink>
                        </NavItem>
                      }
                      {userInfo.role.toUpperCase() == "FOUNDER" && <NavItem>
                        <NavLink className={self.setActive(`${Url.airdropToken}/airdrop-smzo-contract`)}
                          onClick={() => self.goToUrl(`/${Url.airdropToken}/airdrop-smzo-contract`)}>
                          <FormattedMessage id="Airdrop Mozo Sale Token" /></NavLink>
                      </NavItem>
                      }
                      {userInfo.role == "user" && <NavItem>
                        <NavLink className={self.setActive(Url.buyToken)} onClick={() => self.goToUrl("/" + Url.buyToken)}>
                          <FormattedMessage id="Buy Token" /></NavLink>
                      </NavItem>}
                      {userInfo.role.toUpperCase() == "FOUNDER" && <NavItem>
                        <NavLink className={self.setActive(Url.BTC)} onClick={() => self.goToUrl("/" + Url.BTC)}>
                          <FormattedMessage id="BTC" /></NavLink>
                      </NavItem>}
                      {userInfo.role.toUpperCase() == "FOUNDER" && <NavItem>
                        <NavLink className={self.setActive(Url.FIAT)} onClick={() => self.goToUrl("/" + Url.FIAT)}>
                          <FormattedMessage id="FIAT" /></NavLink>
                      </NavItem>}
                      {userInfo.role != "user" && <NavItem>
                        <NavLink className={self.setActive(Url.supportAdmin)} onClick={() => self.goToUrl("/" + Url.supportAdmin)}>
                          <FormattedMessage id="Support" /></NavLink>
                      </NavItem>}
                      {/* {userInfo.role == "user" && <NavItem>
                      <NavLink className={self.setActive(Url.referralProgram)} onClick={() => self.goToUrl("/" + Url.referralProgram)}>
                        <FormattedMessage id="Referral Program" /></NavLink>
                    </NavItem>}
                    {userInfo.role == "founder" && <NavItem>
                      <NavLink className={self.setActive(Url.referralProgram)} onClick={() => self.goToUrl("/" + Url.referralProgram + "/founder")}>
                        <FormattedMessage id="Referral Program" /></NavLink>
                    </NavItem>} */}
                      {userInfo.role.toUpperCase() == "FOUNDER" &&
                        <NavItem>
                          <NavLink className={self.setActive(Url.presale)} onClick={() => self.goToUrl("/" + Url.presale)}>
                            <FormattedMessage id="Presale" /></NavLink>
                        </NavItem>
                      }
                    </Nav>
                    {/* <Nav className="logout-nav" vertical>
                    <NavItem>
                      <NavLink onClick={() => self.logout()}>
                      <i className="fas fa-sign-out-alt"></i><FormattedMessage id="Logout" /></NavLink>
                    </NavItem>
                  </Nav> */}

                  </Col>
                  <Col sm="12" className="main-content">
                    <div className="bottom-right-area">
                      <KycAlert showKYC={this.state.showKYC} closeHandle={() => {
                        self.setState({ showKYC: false })
                      }} />
                      {userInfo.role == "user" && <BonusAlert />}
                      {self.checkEmailStatus() &&
                        <VerifyEmailMessage userOrigin={userInfo.origin} messageId="We just send an email to ..." email={userInfo.emailAddress} />
                      }
                    </div>
                    {newChildren}
                  </Col>
                </Row>
              </Container>}

            <ReduxModal />
          </div>
          : <div id="loader"></div>}

      </IntlProvider>
    );
  }
}

MasterLayout.propTypes = {
  checkDate: PropTypes.object,
  userInfo: PropTypes.object,
  modals: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    checkDate: state.checkDate,
    userInfo: state.userInfo,
    modals: state.modals
  };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(MasterLayout);
