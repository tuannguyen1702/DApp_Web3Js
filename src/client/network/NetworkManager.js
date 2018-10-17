import axios from 'axios'
import {
    Observable
} from 'rxjs/Observable'
import QueryString from 'query-string'
import {
    HttpMethod
} from './API'
import {
    browserHistory
} from 'react-router'

function call(request) {
    var params = request.params
    if (request.contentType === "application/x-www-form-urlencoded") {
        params = QueryString.stringify(request.params)
    }

    var finalRequest = {
        method: request.method,
        url: request.url
    }

    if (request.method === HttpMethod.get) {
        finalRequest["params"] = params
    } else {
        finalRequest["data"] = params
    }

    // if(request.isAuth && store.currentUser.token && Storage.get('token')!=null){
    //     finalRequest["headers"] = {'Authorization': "Basic "+store.currentUser.token}
    // }
    if (request.isAuth) {
        finalRequest["headers"] = {
            "Accept": "*/*",
            'Authorization': "Bearer " + localStorage.getItem("token")
        }
    }

    if (request.isBlob) {
        finalRequest["responseType"] = 'blob'
    }

    //finalRequest["responseType"] = "arraybuffer"

    return Observable.create(function (observer) {
        axios.request(finalRequest).then(function (response) {
            if (finalRequest["responseType"] == 'blob') {
                observer.next(response)
            } else {
                observer.next(response.data)
            }

            if(response.headers["x-system-version"]) {
                const currentVer = sessionStorage.getItem("version")
                const serverVer = response.headers["x-system-version"]
                
                if (!currentVer) {
                    sessionStorage.setItem("version", serverVer)
                } 
    
                sessionStorage.setItem("newVer", serverVer)
            }

           

            observer.complete()
        }).catch(function (error) {
            // if (error.response.statusText == "Unauthorized") {
            //     //localStorage.removeItem("token")
            //     observer.error(error)
            // } else 
            if (error.response) {
                if (error.response.status == 403) {
                    localStorage.removeItem("token")
                    window.location = "/login"
                }
                observer.error(error)
            } else {
                console.log(error)
                observer.error(error)
            }
        })
    })
}

export default {
    call: call
}