import { APIConfig } from './API_Config';

const API = {
    domain: APIConfig.domain,
    domainws: APIConfig.domainws,

    login: 'api/v1/users/login',
    loginAsAnonymous: 'api/v1/anonymous/login',
    checkEmail : "api/v1/users/check-exists",
    confirmEmail: "api/v1/users/confirm-email",
    forgotPassword: "api/v1/users/forgot-password",
    resetPassword: "api/v1/users/reset-password",
    changePassword: "api/v1/users/change-password",
    resendConfirmEmail: "api/v1/users/resend-confirm-email",
    signUp: "api/v1/users/signup",
    checkReferralLink: "api/v1/referral-program",
    getTemplateContract: "api/v1/contract-templates",
    getContractByType: "api/v1/contract-templates/type",
    getTemplateContractDetail: "api/v1/contract-templates",
    checkMozoAddress: "api/v1/check-mozo-address",
    getContractForBuy: "api/v1/addresses",
    dashboard: "api/v1/dashboard",
    getUserInfo: 'api/v1/users/info',
    addSmartContract: "api/v1/contracts",
    deleteSmartContract: "api/v1/contracts",
    requestBTC: "api/v1/bitcoin-address/acquire",
    requestBTCAddress: "api/v1/bitcoin-address",
    getAllFIATTransaction: "api/v1/fiat-txn",
    addFIATTransaction: "api/v1/fiat-txn",
    getAllBTCTransaction: "api/v1/bitcoin-txn",

    fetchProfile:'api/Profile/getMyProfile',
    //getUserInfo: "api/customers/info",
    uploadImage: "api/customers/upload",
    getBanks: "api/banks",
    updateBankAccount: "api/customers/account",
    updateCustomer: "api/customers",
    updatePhoneOrEmail: "api/customers/",
    friendVerify: "api/customers/endorsement",
    sendVerifyCode: "api/customers/",
    getLoanProducts: "api/loan-products",
    getLoanPurposes: "api/loan-purposes",
    loans: "api/loans",
    loanDetail: "api/loans/",
    getBankAccountVinFin: "api/bank-accounts?",
    getLoanHistory: "api/loans?",
    sendBill: "api/payments/sendBill",
    addTransferToken: "api/v1/transactions",
    getReferralBonusList: "api/v1/referral-bonus-transaction",
    getReferralBonusToTransfer: "api/v1/referral-bonus-transaction/pick",
    getAirdropTnxToTransfer: "api/v1/airdrop/find-all",
    addAirdropTnx: "api/v1/airdrop/import",
    getWhitelist: "api/v1/integration/kyc/get-whitelisting-applicants",

    mozoTokenDistribution: "api/v1/mozo-token-distribution",
    icoTokenDistribution: "api/v1/ico-token-distribution",
    investmentDiscountDistribution: "api/v1/investment-discount-distribution",
    presaleTimelineTokenDistribution: "api/v1/presale-timeline-token-distribution",
    presaleAgencyTokenDistribution: "api/v1/presale-agency-token-distribution",
    crowdsaleReferralDistribution: "api/v1/crowdsale-referral-distribution",

    getSupportList: "api/v1/ticket/list",
    getSupportListAll: "api/v1/ticket/listAll",
    getSupportDetail: "api/v1/ticket/",
    createSupport: "api/v1/ticket",
    replySupport: "api/v1/ticket/reply",
    closeTicket: "api/v1/ticket/close",

    referralRequest: "api/v1/referral-request",
    referralDettail: "api/v1/referral-request/details",
    referralHistory: "api/v1/referral-request/history",

    getConfig: "api/v1/configuration",
    updateETHAddress: "api/v1/users/change-receiving-address",
    getCurrencyRate: "api/v1/exchange-rates",
    requestReferral: "api/v1/referral-program/request",

    requestKYCToken: "api/v1/integration/kyc/access-token",
    saveApplicantIDKYC: "api/v1/integration/kyc/save-applicant-id",
    getPresaleData: "api/v1/private-txn",
    updatePresaleData: "api/v1/private-txn",

    getReferralDashboard: "api/v1/referral-program/dashboard",
    saveCalData: "api/v1/save-calculation-tool-data",
    changeUserOrigin: "api/v1/users/change-origin",


    getFullUrl: function (api) {
        return this.domain + "/" + api
    }
};

const HttpMethod = {
    post: "post",
    get: "get",
    put: "put",
    delete: "delete"
};

export {API, HttpMethod};