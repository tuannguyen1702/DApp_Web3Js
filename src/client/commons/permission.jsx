  import {Url} from "./consts/config"

  export const isAnonymousUrl = (url) => {
    url = url.replace(/\//, "")
    var result = false
        switch (url) {
            case "":
            case "/":
            case Url.buyToken:
            case Url.dashBoard:
            case Url.checkAddress:
                result = true
                break
        }
        return result
  }

  export const isFounderUrl = (url) => {
    url = url.replace(/\//, "")
    var result = false
        switch (url) {
            case Url.buyToken:
            case Url.dashBoard:
            case Url.checkAddress:
            case Url.smartContract:
                result = true
                break
        }
        return result
  }