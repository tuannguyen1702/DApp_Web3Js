import React from 'react'
import NetworkManager from './NetworkManager';
import {
    Request
} from './Request';
import {
    API,
    HttpMethod
} from './API';
import moment from 'moment'
import md5 from 'md5'

class NetworkService {
    login(email, pass) {
        var data = {
            emailAddress: email,
            password: md5(pass)
        }
        const request = new Request(API.getFullUrl(API.login), HttpMethod.post, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    loginAsAnonymous() {
        const request = new Request(API.getFullUrl(API.loginAsAnonymous), HttpMethod.post, "application/json")
        request.isAuth = false
        return NetworkManager.call(request)
    }

    checkEmail(username) {
        var data = {
            emailAddress: username
        }

        const request = new Request(API.getFullUrl(API.checkEmail), HttpMethod.get, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    forgotPassword(username) {
        var data = {
            emailAddress: username
        }

        const request = new Request(API.getFullUrl(API.forgotPassword), HttpMethod.post, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    changePassword(currentPassword, newPassword) {
        var data = {
            currentPassword: md5(currentPassword),
            newPassword: md5(newPassword)
        }
        const request = new Request(API.getFullUrl(API.changePassword), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    resetPassword(newPassword, token) {
        var data = {
            token: token,
            newPassword: md5(newPassword)
        }

        const request = new Request(API.getFullUrl(API.resetPassword), HttpMethod.post, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    saveCalData(type, amount, token) {
        var data = {
            type: type,
            amount: amount,
            token: token
        }

        const request = new Request(API.getFullUrl(API.saveCalData), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    changeUserOrigin(origin) {
        var data = {
            origin: origin
        }

        const request = new Request(API.getFullUrl(API.changeUserOrigin), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    checkReferralLink(referralId) {

        const request = new Request(API.getFullUrl(API.checkReferralLink + "/" + referralId), HttpMethod.get, "application/json")
        request.isAuth = false
        return NetworkManager.call(request)
    }

    checkMozoAddress(address) {
        const request = new Request(API.getFullUrl(API.checkMozoAddress), HttpMethod.get, "application/json", {
            address: address
        })
        request.isAuth = false
        return NetworkManager.call(request)
    }

    getContractForBuy(address) {
        const request = new Request(API.getFullUrl(API.getContractForBuy + "/" + address), HttpMethod.get, "application/json")
        request.isAuth = false
        return NetworkManager.call(request)
    }

    getTemplateContract() {
        const request = new Request(API.getFullUrl(API.getTemplateContract), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getTemplateContractDetail(id) {
        const request = new Request(API.getFullUrl(API.getTemplateContractDetail + "/" + id), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getReferralDashboard(d) {
        const request = new Request(API.getFullUrl(API.getReferralDashboard), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getDashboard() {
        const request = new Request(API.getFullUrl(API.dashboard), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }


    getContractByType(type) {
        const request = new Request(API.getFullUrl(API.getContractByType + "/" + type), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getConfig(value) {
        const request = new Request(API.getFullUrl(API.getConfig + "/" + value), HttpMethod.get, "application/json")
        request.isAuth = false
        return NetworkManager.call(request)
    }

    addSmartContract(hash, address, type, agencyAddress = null, coFounders = null) {
        var data = {
            txnHash: hash,
            address: address,
            type: type
        }

        if (agencyAddress) {
            data.agencyAddress = agencyAddress
        }

        if (coFounders) {
            data.coFounders = coFounders
        }

        const request = new Request(API.getFullUrl(API.addSmartContract), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    deleteSmartContract(id) {
        const request = new Request(API.getFullUrl(API.deleteSmartContract + '/' + id), HttpMethod.delete, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getReferralBonusList() {
        const request = new Request(API.getFullUrl(API.getReferralBonusList), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getReferralBonusToTransfer() {
        const request = new Request(API.getFullUrl(API.getReferralBonusToTransfer), HttpMethod.post, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getAirdropTnxToTransfer(coin) {
        const request = new Request(`${API.getFullUrl(API.getAirdropTnxToTransfer)}?coin=${coin}`, HttpMethod.get, "application/json");
        request.isAuth = true;
        return NetworkManager.call(request)
    }

    addAirdropTransaction(formData) {
        const request = new Request(API.getFullUrl(API.addAirdropTnx), HttpMethod.post, "application/json", formData);
        request.isAuth = true;
        return NetworkManager.call(request)
    }

    getWhitelist() {
        const request = new Request(API.getFullUrl(API.getWhitelist), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    addTransferToken(hash, type, txnId, txnOrigination) {
        var data = {
            txnHash: hash,
            txnId: txnId,
            type: type
        }

        if (txnId != null) {
            data.txnId = txnId
        }

        if (txnOrigination != null) {
            data.txnOrigination = txnOrigination
        }

        const request = new Request(API.getFullUrl(API.addTransferToken), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updateSmartContract(hash, address, type) {
        var data = {
            txnHash: hash,
            address: address,
            type: type
        }

        const request = new Request(API.getFullUrl(API.addSmartContract), HttpMethod.put, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    requestBTC(address) {
        var data = {
            address: address
        }

        const request = new Request(API.getFullUrl(API.requestBTC), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    requestBTCAddress() {
        const request = new Request(API.getFullUrl(API.requestBTCAddress), HttpMethod.post, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updateETHAddress(address) {
        var data = {
            address: address
        }

        const request = new Request(API.getFullUrl(API.updateETHAddress), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    referralRequest(address) {
        var data = {
            address: address
        }

        const request = new Request(API.getFullUrl(API.referralRequest), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    referralDettail(id) {
        const request = new Request(API.getFullUrl(API.referralDettail + "/" + id), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    referralHistory() {
        const request = new Request(API.getFullUrl(API.referralHistory), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }


    getAllBTCTransaction(params) {
        const request = new Request(API.getFullUrl(API.getAllBTCTransaction), HttpMethod.get, "application/json", params)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getCurrencyRate(date = null) {
        var data = {}
        if (date != null) {
            data = {
                date: date
            }
        }
        const request = new Request(API.getFullUrl(API.getCurrencyRate), HttpMethod.get, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    getAllFIATTransaction() {
        const request = new Request(API.getFullUrl(API.getAllFIATTransaction), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    addFIATTransaction(formData) {
        var data = {
            emailAddress: formData.email,
            date: formData.date.unix() || (moment(new Date())).unix(),
            amount: parseFloat(formData.amount),
            bankRef: formData.bankAccount,
            token: parseFloat(formData.token) * 100

        }

        if (!formData.exchangeRateId) {
            data.exchangeRateId = formData.exchangeRateId
        }

        const request = new Request(API.getFullUrl(API.addFIATTransaction), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    signUp(email, pass, referralId = null, origin = "user") {
        var data = {
            emailAddress: email,
            password: md5(pass),
            origin: origin
        }

        if (referralId != null) {
            data.referralId = referralId
        }

        const request = new Request(API.getFullUrl(API.signUp), HttpMethod.post, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    requestReferral(rate) {
        var data = {
            rate: rate
        }

        const request = new Request(API.getFullUrl(API.requestReferral), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    requestKYCToken(userId) {
        var data = {
            userId: "mozo-ico-kyc-" + (userId)
        }
        const request = new Request(API.getFullUrl(API.requestKYCToken), HttpMethod.get, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    saveKYCApplicantID(userId, applicantID) {
        let data = {
            username: "mozo-ico-kyc-" + (userId),
            applicantId: applicantID
        }
        const request = new Request(API.getFullUrl(API.saveApplicantIDKYC), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getPresaleData() {
        const request = new Request(API.getFullUrl(API.getPresaleData), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updatePresaleData(amount, currency, description) {
        var data = {
            amount: parseFloat(amount),
            currency: currency,
            description: description
        }

        const request = new Request(API.getFullUrl(API.updatePresaleData), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    confirmEmail(token) {
        var data = {
            token: token
        }
        const request = new Request(API.getFullUrl(API.confirmEmail), HttpMethod.post, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    resendConfirmEmail() {
        const request = new Request(API.getFullUrl(API.resendConfirmEmail), HttpMethod.post, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    fetchProfile() {
        const request = new Request(API.getFullUrl(API.fetchProfile), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getAvatar() {
        const request = new Request(API.getFullUrl(API.getAvatar), HttpMethod.get, "image/png")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getUserInfo() {
        const request = new Request(API.getFullUrl(API.getUserInfo), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    sendVerifyCode(user_id, value) {
        var data = {
            code: value
        }
        const request = new Request(API.getFullUrl(API.sendVerifyCode) + user_id + "/verify?", HttpMethod.get, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getBankAccountVinFin() {
        var data = {
            "isTenant.equals": true,
            "enable.equals": true
        }
        const request = new Request(API.getFullUrl(API.getBankAccountVinFin), HttpMethod.get, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updatePhoneOrEmail(user_id, value, token) {
        const request = new Request(API.getFullUrl(API.sendVerifyCode) + user_id + "/verify?code=" + value + "&token=" + token, HttpMethod.post, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getBanks() {
        const request = new Request(API.getFullUrl(API.getBanks), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updateBankAccount(user_id, form) {
        var data = {
            accountNumber: form.bankID,
            accountName: form.bankAccountName,
            bankId: parseInt(form.bank),
            customerId: user_id
        }
        const request = new Request(API.getFullUrl(API.updateBankAccount), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    updateCustomer(user_id, form) {
        var data = {
            firstname: form.firstName,
            lastname: form.lastName,
            birthDate: form.birthDate.format('x'), //get timestamp format
            gender: form.gender,
            id: user_id
        }
        const request = new Request(API.getFullUrl(API.updateCustomer), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    loans(user_id, productId, customerAccountId, form) {
        var reasons = []

        if (form.loanPurpose.length > 0) {
            form.loanPurpose.map((x) => {
                reasons.push({
                    id: x
                })
            })
        }


        var data = {
            productId: productId,
            customerAccountId: customerAccountId,
            otherReason: form.anotherPurposeText,
            reasons: reasons,
            customerId: user_id,
            applyDate: moment(new Date()).format('x')
        }
        const request = new Request(API.getFullUrl(API.loans), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    friendVerify(user_id, form) {
        var data = {
            name: form.name,
            facebook: form.facebook,
            type: "FRIEND",
            customerId: user_id
        }
        const request = new Request(API.getFullUrl(API.friendVerify), HttpMethod.post, "application/json", data)
        request.isAuth = false
        return NetworkManager.call(request)
    }

    uploadImage(user_id, file, file_name) {
        var data = new FormData();
        data.append(file_name, file)
        data.append('id', user_id)
        const request = new Request(API.getFullUrl(API.uploadImage), HttpMethod.post, "multipart/form-data", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getLoanProducts() {
        const request = new Request(API.getFullUrl(API.getLoanProducts), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getLoanPurposes() {
        const request = new Request(API.getFullUrl(API.getLoanPurposes), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    getLoanHistory(user_id) {
        var data = {
            "customerId.equals": user_id,
            page: 0,
            size: 20,
            sort: "applyDate,desc"
        }
        const request = new Request(API.getFullUrl(API.getLoanHistory), HttpMethod.get, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    loanDetail(id) {
        const request = new Request(API.getFullUrl(API.loanDetail + id), HttpMethod.get, "application/json")
        request.isAuth = true
        return NetworkManager.call(request)
    }

    sendBill(user_id, form) {
        var data = {
            phoneNumber: "+84" + form.phoneNumber,
            amount: form.amount,
            loanId: parseInt(form.loanId),
            bankAccountId: form.bankAccountId,
            customerId: user_id
        }
        const request = new Request(API.getFullUrl(API.sendBill), HttpMethod.post, "application/json", data)
        request.isAuth = true
        return NetworkManager.call(request)
    }

    // Support services
    getSupportList(params) {
        const request = new Request(API.getFullUrl(API.getSupportList), HttpMethod.get, "application/json", params)
        request.isAuth = true;
        return NetworkManager.call(request);
    }

    getSupportListAll(params) {
        const request = new Request(API.getFullUrl(API.getSupportListAll), HttpMethod.get, "application/json", params)
        request.isAuth = true;
        return NetworkManager.call(request);
    }

    createSupport(frm_fields) {
        let data = {
            title: frm_fields.title,
            message: frm_fields.content,
        }
        const request = new Request(API.getFullUrl(API.createSupport), HttpMethod.post, "application/json", data)
        request.isAuth = true;
        return NetworkManager.call(request);
    }

    replySupport(id, content) {
        let data = {
            id: id,
            message: content,
        }
        const request = new Request(API.getFullUrl(API.replySupport), HttpMethod.post, "application/json", data)
        request.isAuth = true;
        return NetworkManager.call(request);
    }

    closeTicket(id, content) {
        let data = {
            id: id
        }
        const request = new Request(API.getFullUrl(API.closeTicket), HttpMethod.post, "application/json", data)
        request.isAuth = true;
        return NetworkManager.call(request);
    }

    getGasPrice() {
        const request = new Request("https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=C6ZGZ85J5FRPQA7PM19B262MGSVJPK1J55", HttpMethod.get, "application/json")
        request.isAuth = false;
        return NetworkManager.call(request);
    }
}

var networkServiceInstance = new NetworkService()
export default networkServiceInstance
