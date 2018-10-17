export class Request{
    constructor(url, method, contentType = "application/json", params = null) {
        this.url = url;
        this.method = method;
        this.contentType = contentType;
        this.params = params;
        this.isAuth = true;
    }
}