import React, { Component } from "react";
import _ from 'lodash'
import { connect } from 'react-redux'
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Col, Row, Button, Form, FormGroup, Label, Input, FormText, Card, CardImg, CardText, CardBody, CardLink, CardTitle, CardSubtitle } from 'reactstrap';

class TermConditionComponent extends Component {
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
            <div className="term-conditions-page">
                <Row>
                    <Col lg={{ size: 8, offset: 2 }}>
                        <h2>Mozo Terms and Conditions</h2>
                        <div className="terms-conditions__content">
                            <p className="bold">Seller</p>
                            <p>BigLabs Pte. Ltd.</p>
                            <p className="bold">Token Name</p>
                            <p>MOZO</p>
                            <p className="bold">Token Definition</p>
                            <p>Token Definition</p>
                            <p className="bold">Total Number of Tokens</p>
                            <p>Five Billion (5,000,000,000)</p>
                            <p className="bold">Total Number of Tokens Sold to Public</p>
                            <p>One Billion Two Hundred Fifty Million (1,250,000,000)</p>
                            <p className="bold">Method of Contribution</p>
                            <p>Presale: ETH, BTC, Fiat Currency<br />
                                Crowdsale: ETH, BTC</p>
                            <p className="bold">Method of Distribution</p>
                            <p>Presale and Crowdsale</p>
                            <p className="bold">Distribution of Tokens not Offered to Public</p>
                            <p>50% (2,500,000,000) placed in Treasury to be used for venue, merchant and consumer acquisition<br />
                                25% (1,250,000,000) allocated amongst, Project MOZO team members, advisers, partners</p>
                            <p className="bold">Token Generation Event Schedule</p>
                            <p>Two (2) Tranches:<br />
                                <ul>
                                    <li>1st Tranche Presale from May 8, 2018 to July 10, 2018. Crowdsale from July 11, 2018 to July 18,
                                                2018</li>
                                    <li>2nd Tranche (Crowdsale only) targeted for Q4 2018</li>
                                </ul>
                            </p>
                            <p className="bold">Hard Cap</p>
                            <p>
                                <ul>
                                    <li>1st Tranche = USD 42,000,000</li>
                                    <li>2nd Tranche = USD 46,000,000</li>
                                </ul>
                            </p>
                            <p className="bold">Token Sale Price</p>
                            <p>Token sale price in USD:
                                        <ul>
                                    <li>1st Tranche = USD 0.09</li>
                                    <li>2nd Tranche = USD 0.12</li>
                                </ul>
                                Token sale price in BTC or ETH will be based on their listed prices as of the date of the signing of the
                                        SAFT.<br />
                                BTC and ETH prices will be calculated based on a weekly average using data from coinmarketcap.com.</p>
                            <p className="bold">Distribution of Tokens Unsold after Token Generation Events</p>
                            <p>
                                <ul>
                                    <li>1st Tranche unsold Tokens will be distributed to 1st Tranche Purchasers on a pro rata basis.</li>
                                    <li>2nd Tranche unsold Tokens will be distributed to 2nd Tranche Purchasers on a pro rata basis.</li>
                                </ul>
                            </p>
                            <p className="bold">Presale Token Bonus</p>
                            <p>1st Tranche (minimum USD 500,000 per transaction).
                                        <ul>
                                    <li>USD 500,000 to USD 1,999,99 = 25%</li>
                                    <li>USD 2,000,000 to USD 4,999,999 = 30%</li>
                                    <li>USD 5,000,000 to USD 9,999,999 = 35%</li>
                                </ul>
                            </p>
                            <p className="bold">Crowdsale Token Bonus</p>
                            <p>1st Tranche (minimum 0.1 ETH or 0.01 BTC per transaction)
                                        <ul>
                                    <li>Greater than or equal to 1 ETH or 0.1 BTC = 10%</li>
                                    <li>Greater than equal to 50 ETH or 5 BTC = 20%</li>
                                </ul>
                            </p>
                            <p className="bold">Use of Proceeds</p>
                            <p>30% - Research and Development<br />
                                40% - Sales and Marketing<br />
                                30% - Operations</p>
                            <p className="bold">Ownership Rights</p>
                            <p>Ownership of the Mozo Token carries no rights, whether express or implied, other than a limited right or expectation to use the Mozo Token (as further specified below), and then only to the extent the Mozo Token and Project Mozo have been successfully launched and accepted by the market. In particular the Purchaser acknowledges and accepts that the Mozo Token does not represent or constitute:
                                        <ol type="a">
                                    <li>any ownership right or stake, share, equity, security, commodity, bond, debt instrument, debenture, liability 	or any other financial instrument or investment carrying equivalent rights;</li>
                                    <li>a capital markets product under the Securities and Futures Act (Cap. 289) (“SFA”);</li>
                                    <li>a unit in a collective investment scheme (“CIS”) (as defined under section 2 (Interpretation) of the SFA) where it represents a right or interest in a CIS, or an option to acquire a right or interest in a CIS;</li>
                                    <li>any right to receive future revenues, profits, income, shares, intellectual property rights, equities, securities 	or any other form of participation or governance right in or relating to the Mozo Token, Project Mozo or the Company;</li>
                                    <li>any form of money or legal tender in any jurisdiction nor do they constitute any representation of money (including electronic money); or</li>
                                    <li>the provision of any goods and/or services as of the date 	of this Agreement.</li>
                                </ol>
                            </p>
                            <p className="bold">Disclaimer of Warranties</p>
                            <p style={{ textTransform: 'uppercase' }}>THE PURCHASER EXPRESSLY AGREES THAT THE PURCHASER IS PURCHASING MOZO TOKENS AT THE PURCHASER'S SOLE RISK AND THAT MOZO TOKENS ARE PROVIDED ON AN "AS IS" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF TITLE OR IMPLIED WARRANTIES, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE (EXCEPT ONLY TO THE EXTENT PROHIBITED UNDER APPLICABLE LAW WITH ANY LEGALLY REQUIRED WARRANTY PERIOD TO THE SHORTER OF THIRTY DAYS FROM FIRST USE OR THE MINIMUM PERIOD REQUIRED). WITHOUT LIMITING THE FOREGOING, NEITHER THE COMPANY NOR ANY OF THE MOZO TEAM WARRANTS THAT THE PROCESS FOR PURCHASING MOZO TOKENS WILL BE UNINTERRUPTED OR ERROR-FREE.</p>
                            <p className="bold">Limitation of Liability</p>
                            <p style={{ textTransform: 'uppercase' }}>THE PURCHASER ACKNOWLEDGES AND AGREES THAT, TO THE FULLEST EXTENT PERMITTED BY ANY APPLICABLE LAW, THE DISCLAIMERS OF LIABILITY CONTAINED HEREIN APPLY TO ANY AND ALL DAMAGES OR INJURY WHATSOEVER CAUSED BY OR RELATED TO (i) USE OF, OR INABILITY TO USE, MOZO TOKENS OR (ii) THE COMPANY, ITS DIRECTORS, SHAREHOLDERS, AND EMPLOYEES, OR ANY MEMBERS OF THE MOZO TEAM, UNDER ANY CAUSE OR ACTION WHATSOEVER OF ANY KIND IN ANY JURISDICTION, INCLUDING, WITHOUT LIMITATION, ACTIONS FOR BREACH OF WARRANTY, BREACH OF CONTRACT OR TORT (INCLUDING NEGLIGENCE) AND THAT NEITHER THE COMPANY NOR ANY OF ITS EMPLOYEES, SHAREHOLDERS, OR DIRECTORS NOR ANY MEMBERS OF PROJECT MOZO SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY OR CONSEQUENTIAL DAMAGES, INCLUDING FOR LOSS OF PROFITS, GOODWILL OR DATA, IN ANY WAY WHATSOEVER ARISING OUT OF THE USE OF, OR INABILITY TO USE, OR PURCHASE OF, OR INABILITY TO PURCHASE, MOZO TOKEN, OR ARISING OUT OF ANY INTERACTION WITH THE SMART CONTRACT IMPLEMENTED IN RELATION TO ANY MOZO TOKEN. THE PURCHASER FURTHER SPECIFICALLY ACKNOWLEDGES THAT THE COMPANY, ITS DIRECTORS, SHAREHOLDERS, AND EMPLOYEES, AND ALL MEMBERS OF THE MOZO TEAM WILL NOT LIABLE FOR THE CONDUCT OF THIRD PARTIES, INCLUDING OTHER PURCHASERS OF MOZO TOKENS, AND THAT THE RISK OF PURCHASING AND USING MOZO TOKENS RESTS ENTIRELY WITH THE PURCHASER. TO THE EXTENT PERMISSIBLE UNDER APPLICABLE LAWS. UNDER NO CIRCUMSTANCES, WILL THE COMPANY, ITS DIRECTORS, SHAREHOLDERS, AND EMPLOYEES, OR ANY MEMBERS OF THE MOZO TEAM BE LIABLE TO ANY PURCHASER FOR MORE THAN THE AMOUNT THE PURCHASERHAS PAID TO THE COMPANY FOR THE PURCHASE OF THE MOZO TOKENS. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR CERTAIN TYPES OF DAMAGES. THEREFORE, SOME OF THE ABOVE LIMITATIONS IN THIS SECTION AND ELSEWHERE IN THE TERMS MAY NOT APPLY TO A PURCHASER. IN PARTICULAR, NOTHING IN THESE TERMS SHALL AFFECT THE STATUTORY RIGHTS OF ANY PURCHASER OR EXCLUDE INJURY ARISING FROM ANY WILFUL MISCONDUCT OR FRAUD OF THE COMPANY, ITS DIRECTORS, SHAREHOLDERS, AND EMPLOYEES, OR ANY MEMBERS OF THE MOZO TEAM.</p>
                            <p className="bold">Acceptance of Risks</p>
                            <p>The Purchaser understands and accepts the risks in connection with the purchase and the creation of the Mozo Token. In particular, the Purchaser understands the inherent risks listed hereinafter as well as in the Purchase Terms:
                                        <ol type="a">
                                    <li>Risk of Software Weaknesses: The Purchaser understands and accepts that the smart contract system concept, the underlying software application and software platform (such as the Ethereum blockchain) is 	still in an early development stage and unproven. There is no warranty or assurance that the process for creating the Mozo Tokens will be uninterrupted or error-free and 	there is an inherent risk that the software could contain weaknesses, vulnerabilities or bugs causing, inter alia, the complete loss of the Contribution Amount or the Mozo Tokens. </li>
                                    <li>Regulatory Risk:  The Purchaser understands and accepts that the blockchain technology allows new forms of interaction and that it is possible that certain jurisdictions will apply existing regulations on, or introduce new regulations addressing, blockchain technology-based applications, which may be contrary to the current setup of a smart contract system and which may, inter alia, result in substantial modifications of the smart contract system and/or the Mozo Token and/or the Company Protocol , including its termination and the loss of the Mozo Tokens for the Purchaser.</li>
                                    <li>Risk of Abandonment / Lack of Success: The Purchaser understands and accepts that the creation of the Mozo Token and the development of the Mozo Token and/or the Company Protocol may be abandoned for a number of reasons, including lack of interest from the public, lack of funding, lack of commercial success or prospects (e.g. caused by competing projects). The Purchaser therefore understands that there is no assurance that, even if the Mozo Token and/or the Company Protocol is partially or fully developed and launched, the Purchaser will receive any benefits through the Mozo Token held 	by him/her/it.</li>
                                    <li>Risk Associated with Other Applications: The Purchaser understands and accepts that the Mozo Token and/or the Company Protocol may give rise to other, alternative projects, promoted by unaffiliated third parties, under 	which the Mozo Token will have no intrinsic value.</li>
                                    <li>Risk of Loss of Private Key: The Mozo Tokens can only be accessed by using an Ethereum wallet with a combination of Purchaser’s account information (address), private key and password. The private key is encrypted with a password. The Purchaser understands 	and accepts that if his/her private key file or password respectively gets lost or stolen, the obtained the Mozo Tokens associated with the Purchaser's account (address) or password will be unrecoverable and will be permanently lost. Additionally, any third party that gains access to the Purchaser’s private key, including by gaining access to the login credentials relating to the Purchaser’s Ethereum wallet, may be able to misappropriate the Purchaser’s the Mozo Tokens.</li>
                                    <li>Risk of Theft: The Purchaser understands and accepts that the Smart Contract System concept, the underlying 	software application and software platform (i.e. the Ethereum blockchain) may be exposed to attacks by hackers or other individuals that could result in theft or loss of Mozo Tokens or Company data, impacting the ability to develop the Mozo Token and/or the Company Protocol.</li>
                                    <li>Risk of Mining Attacks:  The Purchaser understands and accepts that, as with other cryptocurrencies, the blockchain(s) used for the Company’s smart contract system is/are susceptible to mining attacks, including but not limited to double-spend attacks, majority mining 	power attacks, “selfish-mining” attacks, and race condition attacks. Any successful attacks present a risk to the Company’s smart contract system, expected proper execution and sequencing of the Mozo Token transactions, and expected proper execution and sequencing of contract computations.</li>
                                    <li>Risk of Incompatible Wallet Service:  The Purchaser understands and accepts that the wallet or wallet service provider used for receiving Mozo Tokens, must be technically compatible with the Mozo Token. Purchaser acknowledges and accepts that failure to assure the compatibility of his/her wallet or wallet service provider may result in the Purchaser not being 	able to gain access to his/her Mozo Tokens.</li>
                                    <li>Risk of Uninsured Losses: Unlike bank accounts or accounts at some other financial institutions, LSTs are uninsured unless you specifically obtain private insurance to insure them.  Thus, in the event of loss or loss of utility value, there is no public insurer or private 	insurance arranged by us, to offer recourse to you.</li>
                                    <li>Risk arising from taxation: The tax characterization of Mozo Tokens is uncertain. The Contributor must seek 	his/her own tax advice in connection with acquiring Mozo Tokens, which may result in adverse tax consequences to you, including withholding taxes, income taxes and tax reporting requirements.</li>
                                </ol>
                            </p>
                            <p className="bold">Self-Regulation</p>
                            <p>The Purchaser shall ensure that its dealings in and usage of Mozo Tokens does not violate any provisions of any laws, orders or regulations in any applicable jurisdiction.  Without prejudice to the generality of the foregoing, the Purchaser shall further ensure that its dealings in and usage of Mozo Tokens will not be in breach of the Securities and Futures Act (Cap. 289) in Singapore.</p>
                            <p className="bold">Collection of Data</p>
                            <p>The Purchaser consents to the collection, use, storage, disclosure and transmission to an overseas office (if necessary) of its personal data as defined under the Personal Data Protection Act (2012) by the Company, where applicable, for the purposes of KYC, Anti-Money Laundering and Counter-Financing of Terrorism due diligence procedures.</p>
                            <p className="bold">Governing Law</p>
                            <p>Republic of Singapore</p>
                        </div>
                    </Col>
                </Row>
            </div>

        )
    }

}


export default injectIntl(observer(TermConditionComponent))
