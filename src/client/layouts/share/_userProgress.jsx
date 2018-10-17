import React, { Component } from "react";
import ReactDOM from 'react-dom'
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, Progress, Row, Col } from 'reactstrap';
import { injectIntl, FormattedMessage, FormattedRelative } from 'react-intl';
import { browserHistory } from "react-router";
import { showUserProgress } from '../../actions'

class UserProfileProgress extends Component {
  constructor(props) {
    super(props)
  }

  checkComplete(isComplete) {
    if (isComplete) {
      return "progress-item complete"
    }
    return "progress-item"
  }

  scrollTo(hash) {
    if(window.innerWidth < 768)
    {
      this.props.dispatch(showUserProgress(true))
    }
    if (typeof this.props.callBackScroll == 'function') {
      typeof this.props.callBackScroll(hash)
    } else {
      browserHistory.push({
        pathname: "/user-profile",
        hash: hash
      })
    }

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenScrollEvent);
  }

  listenScrollEvent() {
    var self = this
    if (self.refs["userProgress"]) {
      const targetNode = ReactDOM.findDOMNode(self.refs["userProgress"])
      const targetNodeContainer = targetNode.parentNode
      if (targetNodeContainer.offsetHeight > targetNode.offsetHeight) {
        if ((document.documentElement.scrollTop || document.body.scrollTop) < targetNodeContainer.offsetHeight - targetNode.offsetHeight) {
          targetNode.style.top = (document.documentElement.scrollTop || document.body.scrollTop) + "px"
          targetNode.style.bottom = "auto"
        } else {
          targetNode.style.top = "auto"
          targetNode.style.bottom = "0"
        }
      } else {
        targetNode.style.top = "auto"
        targetNode.style.bottom = "auto"
      }
    }
  }

  componentDidMount() {
    var self = this
    window.addEventListener('scroll', self.listenScrollEvent.bind(this));
  }

  render() {
    var self = this
    var { progressData, showButton = false, className = "" } = this.props
    return (
      <div>
        <div className={"message-zone " + className + (self.props.hideProgress ? "" : " on")}>
          <div ref="userProgress" id="userProgress" className="user-progress">
            <label className="form-control-label"><FormattedMessage id="Percent of completion" /></label><Button onClick={() => {
              self.props.dispatch(showUserProgress(true))
            }} color="link" className="btn-angle-double"><i className="angle-double down"></i></Button>
            <Row>
              <Col className="pr-none">
                <FormGroup>
                  <Progress className="custom-pregress" value={parseInt(progressData.completedActions / 6 * 100)} />
                </FormGroup>
              </Col>
              <Col>
                <label className="pregress-bar-label"><FormattedMessage id="completed" values={{ number: parseInt(progressData.completedActions / 6 * 100) + "%" }} /></label>
              </Col>
            </Row>
            <FormGroup>
              <p className="smaller">Bạn chỉ có thể đăng ký vay khi hồ sơ cá nhân đã hoàn tất và được duyệt.</p>
            </FormGroup>
            <FormGroup>
              <label className={this.checkComplete(progressData.progress.UPDATE_PERSONAL_INFO.status)}><i className="fas fa-check-circle"></i><a
                onClick={() => {
                  self.scrollTo("#user-info")
                }}><FormattedMessage id="user_info" /></a></label>
            </FormGroup>
            <FormGroup>
              <label className={this.checkComplete(progressData.progress.UPDATE_CONTACT_INFO.status)}><i className="fas fa-check-circle"></i><a
                onClick={() => {
                  self.scrollTo("#contact")
                }}><FormattedMessage id="contact_info" /></a></label>
            </FormGroup>
            <FormGroup>
              <label className={this.checkComplete(progressData.progress.UPDATE_BANK_ACCOUNT.status)}><i className="fas fa-check-circle"></i><a
                onClick={() => {
                  self.scrollTo("#bank")
                }}><FormattedMessage id="bankAccount" /></a></label>
            </FormGroup>
            <FormGroup>
              <label className={this.checkComplete(progressData.progress.UPDATE_GOVERNMENT_INFO.status)}><i className="fas fa-check-circle"></i><a
                onClick={() => {
                  self.scrollTo("#id")
                }}><FormattedMessage id="ID_copy" /></a></label>
            </FormGroup>
            <FormGroup>
              <label className={this.checkComplete(progressData.progress.UPDATE_STUDENT_INFO.status)}><i className="fas fa-check-circle"></i><a
                onClick={() => {
                  self.scrollTo("#student-card")
                }}><FormattedMessage id="student_card_copy" /></a></label>
            </FormGroup>
            <FormGroup>
              <label className={this.checkComplete(progressData.progress.UPDATE_FB_ENDORSEMENT.status)}><i className="fas fa-check-circle"></i><a
                onClick={() => {
                  self.scrollTo("#facebook")
                }}><FormattedMessage id="facebook_friend_verify_progress" values={{ number: progressData.progress.UPDATE_FB_ENDORSEMENT.description }} /></a></label>
            </FormGroup>
            {showButton && <div>
              <Button onClick={() => {
                browserHistory.push({
                  pathname: "/user-profile"
                })
              }} color="info" className="full-width"><FormattedMessage id="Updating user profile" /></Button>
            </div>}
          </div>
        </div>
        <div className={"progress-bottom" + (self.props.hideProgress ? "" : " off")}>
          <Row>
            <Col className="pr-none col1">
              <FormGroup>
                <Progress className="custom-pregress" value={parseInt(progressData.completedActions / 6 * 100)} />
              </FormGroup>
            </Col>
            <Col className="col2">
              <label className="pregress-bar-label"><FormattedMessage id="Profile completed" values={{ number: parseInt(progressData.completedActions / 6 * 100) + "%" }} /></label>
              {" "}<Button onClick={() => {
                self.props.dispatch(showUserProgress(false))
              }} color="link" className="btn-angle-double"><i className="angle-double up"></i></Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

UserProfileProgress.propTypes = {
  hideProgress: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    hideProgress: state.hideProgress
  };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(UserProfileProgress))