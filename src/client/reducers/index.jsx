import {combineReducers} from "redux";
import {reducer as modalReducer} from 'react-redux-modal'
import Web3 from 'web3'

const checkBox = (store, action) => {
  if (action.type === "TOGGLE_CHECK") {
    return {
      checked: !store.checked
    };
  }

  return store || {checked: false};
};

const number = (store, action) => {
  if (action.type === "INC_NUMBER") {
    return {
      value: store.value + 1
    };
  } else if (action.type === "DEC_NUMBER") {
    return {
      value: store.value - 1
    };
  }

  return store || {value: 0};
};

const locale = (store, action) => {
  if (action.type === "CHANGE_LANG") {
    return {
      locale: action.locale
    };
  }

  return store || null;
};

const isGuest = (store, action) => {

  return store || false;
}

const userInfo = (store,action) =>{
  if(action.type === "SET_USER_INFO"){
    return  action.userInfo
  }

  return store || null;
}

const fullName = (store, action) =>{
  if(action.type === "UPDATE_FULLNAME"){
    return  action.fullName
  }

  return store || "";
}

const hideProgress = (store, action) =>{
  if(action.type === "UPDATE_USERPROGRESS"){
    return  action.hideProgress
  }

  return store || false;
}

const wallets = (store, action) =>{
  if(action.type === "GET_WALLET"){
    return  store.wallets
  }

  return store || null;
}

const web3 = (store, action) =>{
  if(action.type === "CHANGE_WEB3_PROVIDER"){
    return  action.web3
  }

  return store || null;
}

const checkDate = (store, action) => {
  return store || null;
}

export default combineReducers({
  checkBox,
  number,
  locale,
  isGuest,
  userInfo,
  fullName,
  hideProgress,
  wallets,
  web3,
  checkDate,
  modals: modalReducer
});
