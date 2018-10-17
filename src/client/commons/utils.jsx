import { Url, Origin } from "./consts/config"
import _ from "lodash"

export const utils = {
    getOrigin: (location, params) => {
        var path = location.pathname

        if(params["refCode"]) {
            return Origin.investor
        }

        if(path.indexOf( "/" + Url.referral) >= 0) {
            return Origin.referral
        }

        if(path.indexOf( "/" + Url.kyc) >= 0) {
            return Origin.kyc
        }

        return Origin.user
    },
    
    redirectAfterLogin: (role, origin, checkDate) => {

        if(!_.isEmpty(window.location.hash)) {
            window.location = "/" + window.location.hash.substring(1)
            return false
        }

        if (role == "user") {
            if (origin == Origin.referral){
                window.location = "/" + Url.referral + "/" + Url.referralInfo
            } else if ( origin == Origin.kyc) {
                if( !checkDate["check-preopen-date"] ) {
                    window.location = "/" + Url.kyc + "/" + Url.kycInfo 
                } else {
                    window.location = "/"
                }
            } else {
                window.location = "/"
            }

        } else {
            window.location = "/" + (role == "founder" ? Url.smartContract : Url.supportAdmin)
        }
    }
}