import React from "react";
import { render } from "react-dom";
import { routes } from "./routes";
import _ from "lodash"
import { Router, browserHistory } from "react-router";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers";
import { combineReducers } from "redux";
import NetworkService from "./network/NetworkService"
import "./styles/index.styl";
import { Url, Common, Langs } from './commons/consts/config';

import Rx from 'rxjs/Rx';

window.webappStart = () => {
  const initialState = window.__PRELOADED_STATE__;

  const store = createStore(rootReducer, initialState);

  const renderApp = (store) => {
    render(
      <Provider store={store}>
        <Router history={browserHistory}>{routes}</Router>
      </Provider>
      ,
      document.querySelector(".js-content")
    );
  }

  const redirectTo = () => {
    if (window.location.pathname.indexOf("/" + Url.userReferral) < 0) {
      const now = new Date()

      if ( !store.getState().checkDate["check-preopen-date"] ) {
      // if (now <= new Date(Common.ICOOpenDate)) {
        // browserHistory.push({
        //   pathname: "/count-down"
        // })
        window.location = "/count-down"
      }
      else {
        window.location = "/user/login"
      }
    }
    else {
      window.location = window.location.pathname
    }

  }

  var token = localStorage.getItem("token")
  var lang = localStorage.getItem("lang") || "en"
  var locale = null
  if(lang) {
    var langItem = _.filter(Langs, { code: lang });
    locale = {code: lang, text: langItem[0].text}
  }
  if (token) {

      Rx.Observable.forkJoin(
            NetworkService.getUserInfo(),
            NetworkService.getConfig("check-date"),
            function (user_info, check_date) {
                return {
                    user_info,
                    check_date
                }
            }
        )
        .subscribe(
            function onNext({ user_info, check_date }) {
                store.getState().checkDate = check_date

                //sessionStorage.setItem("firstStart", true)
                if(sessionStorage.getItem("newVer")) {
                  sessionStorage.setItem("version", sessionStorage.getItem("newVer"))
                } 
                

                if (user_info) {
                  //user_info.airdropToken = "100000"

                  // var newTotalToken = parseInt(user_info.totalToken) - parseInt(user_info.airdropToken)
                  
                  // if(newTotalToken < 0 ){
                  //   user_info.totalToken = "0"
                  // } else {
                  //   user_info.totalToken = newTotalToken.toString()
                  // }
                  store.getState().userInfo = user_info
                  store.getState().locale = locale
                  renderApp(store)
                  //checkICODay()
                }
            },
            function onError(e) {
                localStorage.removeItem("token")
                //window.location = "/user/login"
                redirectTo()
            },
            function onCompleted() {

                }
            )


    // NetworkService.getUserInfo().subscribe(
    //   function onNext(response) {
    //     if (response) {
    //       store.getState().userInfo = response
    //       store.getState().locale = locale
    //       renderApp(store)
    //       //checkICODay()
    //     }
    //   },
    //   function onError(e) {
    //     localStorage.removeItem("token")
    //     //window.location = "/user/login"
    //     redirectTo()
    //   },
    //   function onCompleted() {
    //
    //   }
    // )

  } else {
      NetworkService.getConfig("check-date").subscribe(
        function onNext(response) {
          store.getState().checkDate = response
          store.getState().locale = locale
          renderApp(store)
          
          //sessionStorage.setItem("firstStart", true)
          if(sessionStorage.getItem("newVer")) {
            sessionStorage.setItem("version", sessionStorage.getItem("newVer"))
          } 
        },
        function onError(e) {
            console.log("Error", e);
        },
        function onCompleted() {

        }
      )

    // store.getState().userInfo = {role: "anonymous"}
    // store.getState().locale = locale
    // renderApp(store)
    //checkICODay()
  }
};
