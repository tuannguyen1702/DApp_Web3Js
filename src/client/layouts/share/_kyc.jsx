import React, { Component } from "react";
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import { observer } from 'mobx-react';
import NetworkService from "../../network/NetworkService"
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import { FormGroup } from 'reactstrap';
import { CollapseGroup, Icon } from '../../components'

class Kyc extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var self = this
        var { userInfo, locale } = self.props
        NetworkService.requestKYCToken(userInfo.emailAddress).subscribe(
            function onNext(response) {
                // console.log(userInfo);
                var id = idensic.init(
                    // selector of an iframe container (see above)
                    '#idensic',
                    // configuration object (see preparation steps)
                    {
                        accessToken: response.token,
                        lang: locale.code,
                        applicantDataPage: {
                            "enabled": true,
                            "fields": [
                                {
                                    "name": "firstName",
                                    "required": true
                                },
                                {
                                    "name": "lastName",
                                    "required": true
                                },
                                {
                                    "name": "email",
                                    "required": true
                                },
                                {
                                    "name": "addresses",
                                    "required": true
                                }
                            ]
                        },
                        // uiConf: {
                        //     customCssUrl: "/kyc-custom.css"
                        //   },
                        // steps to require:
                        // identity proof (passport, id card or driving license) and a selfie
                        "requiredDocuments": "IDENTITY:ID_CARD,PASSPORT;SELFIE:SELFIE;PROOF_OF_RESIDENCE:UTILITY_BILL,BANK_CARD,DRIVERS",
                        "excludedCountries": [
                            "USA",
                            "PRK",
                            "VNM"
                        ],
                        "uiConf": {
                            "customLogoUrl": window.location.origin + "/static/mozo-sum-logo.png",
                            "customCssUrl": window.location.origin + "/static/kyc.css"
                        }
                        // "privacyPolicyUrl": window.location.origin + "/privacy-and-cookie-policy",
                        // "userAgreementUrl": window.location.origin + "/term-and-condition",
                    },
                    // function for the iframe callbacks
                    function (messageType, payload) {
                        // just logging the incoming messages
                        if (messageType == 'idCheck.onApplicantCreated') {
                            NetworkService.saveKYCApplicantID(userInfo.emailAddress, payload.applicantId).subscribe(
                                function onNext(response) {
                                    console.log('save done');
                                }
                            );
                        }
                        // console.log('[IDENSIC DEMO] Idensic message:', messageType, payload);
                    }
                )
            },
            function onError(e) {
                console.log("onError")
            },
            function onCompleted() {

            }
        )

    }
    

    render() {
        var self = this
        var { userInfo, collapseShow = false } = self.props
        if (!userInfo) return false

        return (
            <div>
                <CollapseGroup collapseShow={collapseShow} title={<span className="svg-icon-container"><Icon name="kyc" className="stroke" /><FormattedMessage id="AML/KYC" /></span>}>
                    <FormGroup>
                        <div id="idensic"></div>
                    </FormGroup>
                </CollapseGroup>
            </div>
        )
    }

}


Kyc.propTypes = {
    intl: intlShape.isRequired,
    locale: PropTypes.object,
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        locale: state.locale,
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(injectIntl(observer(Kyc)))
