import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { injectIntl, FormattedMessage, FormattedRelative } from 'react-intl';
import { browserHistory } from "react-router";

class BottomPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <p>Trong trường hợp bạn cần hỗ trợ vui lòng liên hệ email <a href="mailto: support@vinfin.vn" ><span className="email">support@vinfin.vn</span></a> hoặc truy cập:</p>
        <FormGroup>
          <Button outline color="secondary" className="full-width ico-btn-left far fa-question-circle"
            onClick={() => {
              window.open('//vinfin.io/', '_blank')
            }}><FormattedMessage id="Frequently Asked Questions" /></Button>
        </FormGroup>
        <FormGroup>
          <Button outline color="secondary" className="full-width ico-btn-left fab fa-whatsapp"
            onClick={() => {
              window.open('//vinfin.io/', '_blank')
            }}><FormattedMessage id="support" /></Button>
        </FormGroup>
        <FormGroup>
          <Button color="secondary" className="full-width"
            onClick={() => {
              browserHistory.push({
                pathname: "/"
              })
            }}><FormattedMessage id="Back Home Page" /></Button>
        </FormGroup>
      </div>
    );
  }
}

export default injectIntl(BottomPage);