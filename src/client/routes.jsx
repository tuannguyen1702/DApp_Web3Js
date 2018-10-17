import React from "react";
import { Route, IndexRoute } from "react-router";
import MasterLayout from "./layouts/share/_master";
import GuestLayout from "./layouts/share/_guest";
import CountDownLayout from "./layouts/share/_countDown";
import { Login, ConfirmEmail, ForgotPassWord } from "./pages/user"
import { Login as RefferralLogin, ReferralUser } from "./pages/referral"
import { Dashboard } from "./pages/dashboard"
import { SmartContract, CreateSmartContract, SmartContractDetail } from "./pages/smartContract"
import { BuyToken } from "./pages/buyToken"
import { TransferToken, TransferSaleToken } from "./pages/transferToken"
import { TransferBonus } from "./pages/transferBonus"
import { AirdropMozoToken, AirdropSaleToken } from "./pages/airdrop"
import { SetWhitelist } from "./pages/setWhitelist"
import { SetCoOwner } from "./pages/setCoOwner"
import { SetRate } from "./pages/setRate"
import { IcoAction } from "./pages/icoAction"
import { CheckMozoAddress } from "./pages/checkMozoAddress"
import { BTC } from "./pages/btc"
import { FIAT } from "./pages/fiat"
import { Support, SupportDetail, CreateSupport } from "./pages/support"
import { ReferralProgram, ReferralProgramUser } from "./pages/referralProgram"
import { CountDown } from "./pages/countDown"
import { KycInfo } from "./pages/kyc"
import { Presale } from "./pages/presale"
import { PrivacyCookie } from './pages/privacyCookie';
import { TermCondition } from './pages/termCondition';
import WelcomeReferral from './pages/welcomReferral';
import RefLink from "./layouts/share/_referLink"

import { Url } from './commons/consts/config';

export const routes = (<Route>
  <Route path="/" component={MasterLayout}>
    <IndexRoute component={BuyToken} />
    <Route path={Url.dashBoard} component={Dashboard} />
    <Route path={Url.smartContract} component={SmartContract} />
    <Route path={Url.smartContract + "/:createType/:type/:contractID"} component={CreateSmartContract} />
    <Route path={Url.smartContractDetail + "/:type"} component={SmartContractDetail} />
    <Route path={Url.checkAddress} component={CheckMozoAddress} />
    <Route path={Url.buyToken} component={BuyToken} />
    <Route path={Url.buyToken + "/:fromType/:fromValue"} component={BuyToken} />
    <Route path={Url.transferBonus} component={TransferBonus} />
    <Route path={`${Url.airdropToken}/airdrop-smzo-contract`} component={AirdropSaleToken} />
    <Route path={`${Url.airdropToken}/airdrop-mozo-contract`} component={AirdropMozoToken} />
    <Route path={Url.setWhitelist + "/:investmentAddress"} component={SetWhitelist} />
    <Route path={Url.setWhitelist} component={SetWhitelist} />
    <Route path={Url.setCoOwner + "/:coOwnerAddress"} component={SetCoOwner} />
    <Route path={Url.setCoOwner} component={SetCoOwner} />
    <Route path={Url.setRate} component={SetRate} />
    <Route path={Url.transferToken + "/:transferType/mozo-token-contract/:ethAddress/:coinNumber/:btcRequestID"} component={TransferToken} />
    <Route path={Url.transferToken + "/:transferType/ico-contract/:ethAddress/:coinNumber/:btcRequestID"} component={TransferSaleToken} />
    {/* <Route path={Url.support} component={Support} /> */}
    {/* <Route path={Url.supportDetail + "/:id"} component={SupportDetail} /> */}
    {/* <Route path={Url.createSupport} component={CreateSupport} /> */}
    <Route path={Url.BTC + "/:numberRowsOfPage/:curPage/:status"} component={BTC} />
    <Route path={Url.BTC} component={BTC} />
    <Route path={Url.FIAT} component={FIAT} />
    <Route path={Url.referralProgram + "/founder"} component={ReferralProgram} />
    <Route path={Url.referralProgram} component={ReferralProgramUser} />
    <Route path={Url.presale} component={Presale} />
    <Route path={Url.contractAction + "/:type/:actionType"} component={IcoAction} />
  </Route>

  <Route path={Url.supportAdmin + "/:numberRowsOfPage/:curPage/:status"} component={MasterLayout}>
      <IndexRoute component={Support} />
      <Route path={Url.supportDetail + "/:id"} component={SupportDetail} />
      <Route path={Url.createSupport} component={CreateSupport} />
  </Route>
  <Route path={Url.support + "/:numberRowsOfPage/:curPage/:status"} component={GuestLayout}>
    <IndexRoute component={Support} />
    <Route path={Url.supportDetail + "/:id"} component={SupportDetail} />
    <Route path={Url.createSupport} component={CreateSupport} />
  </Route>

  <Route path={Url.supportAdmin} component={MasterLayout}>
    <IndexRoute component={Support} />
    <Route path={Url.supportDetail + "/:id"} component={SupportDetail} />
    <Route path={Url.createSupport} component={CreateSupport} />
  </Route>
  <Route path={Url.support} component={GuestLayout}>
    <IndexRoute component={Support} />
    <Route path={Url.supportDetail + "/:id"} component={SupportDetail} />
    <Route path={Url.createSupport} component={CreateSupport} />
  </Route>
  <Route path={Url.buyToken + "/:refCode"} component={RefLink} />
  <Route path="user" component={GuestLayout}>
    <Route path="login" component={Login} />
    <Route path={Url.userReferral} component={Login} />
    <Route path="login/:backUrl" component={Login} />
    <Route path="confirm" component={ConfirmEmail} />
    <Route path="forgot-password" component={ForgotPassWord} />
  </Route>
  <Route path={Url.referral} component={WelcomeReferral} />
  <Route path={Url.referral} component={GuestLayout}>
    <Route path="login" component={RefferralLogin} />
    <Route path={Url.userReferral} component={RefferralLogin} />
    <Route path={Url.referralInfo} component={ReferralUser} />
  </Route>
  <Route path={Url.kyc} component={GuestLayout}>
    <IndexRoute component={RefferralLogin} />
    <Route path="login" component={RefferralLogin} />
    <Route path={Url.kycInfo} component={KycInfo} />
  </Route>
  <Route path="login" component={GuestLayout}>
    <IndexRoute component={RefferralLogin} />
  </Route>
  <Route path="count-down" component={CountDownLayout}>
    <IndexRoute component={CountDown} />
  </Route>
  <Route path="privacy-and-cookie-policy" component={CountDownLayout}>
    <IndexRoute component={PrivacyCookie} />
  </Route>
  <Route path="term-and-condition" component={CountDownLayout}>
    <IndexRoute component={TermCondition} />
  </Route>
</Route>)
