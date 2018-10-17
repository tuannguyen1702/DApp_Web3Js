import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Card, CardImg, CardText, CardBody, CardLink, CardTitle, CardSubtitle } from 'reactstrap';

class PrivacyCookieComponent extends Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <div className="privacy-page">
                <Row>
                    <Col lg={{ size: 8, offset: 2 }}>
                        <h2>Mozo Privacy and Cookie Policy</h2>
                        <p>Last updated: April 5, 2018</p>
                        <section>
                            <h3>Privacy</h3>
                            <p>Your privacy is important to us. Therefore, we want to inform you about Mozo’s policies regarding the collection, use and disclosure of your personally-identifying information, including your name, email address, IP, phone number, and browsing data (“Personal Information”), as well as your non-personally-identifying information, including browser type, language preference, referring site, date and time of visits (“Non-Personal Information”), which we may collect or you may provide us while visiting our website.<br />
                                Mozo collects Personal Information for logged-in users, transacting users, and commenting users. Mozo only discloses logged-in user and commenter IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below, except that commenter IP addresses and email addresses are visible and disclosed to the administrators of the site where the comment was left.<br />
                                All Personal Information gathered by us or provided by you will be used for purposes of delivering quality online services for you. Please note that:</p>
                            <ul>
                                <li>We do not resell Personal or Non Personal Information to third parties.</li>
                                <li>We do not use Personal Information or Non-Personal Information for any purpose other than to 	understand how visitors use our site and to assist them in making their shopping journey more 	pleasurable.</li>
                                <li>Customers can request their Personal Information to be deleted at any time they instruct us to do so.</li>
                                <li>All advertisers on our network are registered and confirmed by us.</li>
                                <li>We may employ third party service providers to facilitate our services, to provide certain services on 	our behalf and to assist us in analyzing how our services are used. These third parties may have 	access to your Personal Information but only to perform specific tasks on our behalf and are 	obligated not to disclose or use your information for any other purpose.</li>
                                <li>Our website and services may contain links to other sites that are not operated by us. If you click on a 	third party link, you will be directed to that third party's site. We strongly advise you to review the 	Privacy Policy of every site you visit. We have no control over, and assume no responsibility for the 	content, privacy policies or practices of any third party sites or services.</li>
                                <li>We will disclose your Personal Information where required to do so by law or subpoena or if we 	believe that such action is necessary to comply with the law and the reasonable requests of law 	enforcement or to protect the security or integrity of our services.</li>
                                <li>The security of your Personal Information is important to us, and we strive to implement and maintain 	reasonable security procedures and practices appropriate to the nature of the information we store, in 	order to protect it from unauthorized access, destruction, use, modification, or disclosure. However, 	please be aware that no method of transmission over the internet, or method of electronic storage is 	100% secure and we are unable to guarantee the absolute security of the Personal Information we 	have collected from you.</li>
                                <li>Your information, including Personal Information, may be transferred to and/or maintained on 	computers located outside of your state, province, country or other governmental jurisdiction where 	the data protection laws may differ than those from your jurisdiction.</li>
                                <li>From time to time, Mozo may release Non-Personal Information in the aggregate, e.g., by publishing a 	report on trends in the usage of its website.</li>
                                <li>We may contact you occasionally to inform you of important changes, news or other relevant 	information. You may opt out of receiving any, or all, of these communications from us by following 	the unsubscribe link or instructions provided in any email we send.</li>
                            </ul>
                        </section>
                        <section>
                            <h3>Cookies Policy</h3>
                            <p>This site, like many others, uses small files of letters and numbers, called cookies, to help us customize your experience and to enhance the website's performance and functionality.</p>

                            <p>Cookies are small text files that are stored by the browser on your computer or mobile device. They help websites store data about users so that they are recognized each time they visit the site. This allows us to provide a level of personalization for each user and enhance the user’s experience. Some cookies only remain on your device as long as you keep your browser (session) active, while others remain on your device for longer periods of time (permanent/persistent).</p>

                            <p>The consent you have given to store and read cookies can be withdrawn at any time by setting your browser to disable cookies and/or to remove all cookies from your browser. However, it is important to note that if you change your settings and block certain cookies, you will not be able to take full advantage of the features of Mozo and we might not be able to provide some features you have previously chosen to receive.</p>
                        </section>
                        <section>
                            <h3>Consent</h3>
                            <p>Your consent to this Privacy and Cookies Policy followed by your submission of Personal Information and Non-Personal Information represents your agreement and acceptance of the terms of their use as stated herein.</p>

                            <p>We reserve the right to update or change our Privacy and Cookies Policy at any time and you should check this Privacy and Cookies Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy or Cookies Policy.</p>
                        </section>
                    </Col>
                </Row>
            </div>

        )
    }

}


export default injectIntl(observer(PrivacyCookieComponent))
