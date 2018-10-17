import socketIOClient from "socket.io-client";
import sailsIOClient from 'sails.io.js';
import {API} from './API';

class SocketService {

    create(api, handlers) {
        let io = socketIOClient.sails ? socketIOClient : sailsIOClient(socketIOClient);
        io.sails.url = API.domain;
        io.sails.autoConnect = false;

        let socket = io.sails.connect();
        socket.on('connect', () => {
            if (!socket.isConnected()) {
                socket.reconnect();
            }
            else {
                socket["headers"] = {"Accept": "*/*", 'Authorization': `Bearer ${localStorage.getItem("token")}`};
                socket.get("/" + api, (data) => handlers.onGetHandler && handlers.onGetHandler(data));
                socket.on('update', (data) => handlers.onUpdateHandler && handlers.onUpdateHandler(data));
                socket.on('create', (data) => handlers.onCreateHandler && handlers.onCreateHandler(data));
            }
        });
        return socket;
    }

    dashboard(callback) {
        return this.create(API.dashboard, {onGetHandler: callback, onUpdateHandler: callback});
    }

    mozoTokenDistribution(callback, listenContractChange) {
        return this.create(API.mozoTokenDistribution, {
            onGetHandler: callback,
            onUpdateHandler: callback,
            onCreateHandler: listenContractChange
        });
    }

    icoTokenDistribution(callback, listenContractChange) {
        return this.create(API.icoTokenDistribution, {
            onGetHandler: callback,
            onUpdateHandler: callback,
            onCreateHandler: listenContractChange
        });
    }

    investmentDiscountDistribution(callback, listenContractChange) {
        return this.create(API.investmentDiscountDistribution, {
            onGetHandler: callback,
            onUpdateHandler: callback,
            onCreateHandler: listenContractChange
        });
    }

    getSupportDetail(support_id, callback, callbackUpdate) {
        return this.create(API.getSupportDetail + support_id, {
            onGetHandler: callback,
            onUpdateHandler: callbackUpdate
        });
    }

    getTemplateContract(callback, callbackUpdate) {
        return this.create(API.getTemplateContract, {onGetHandler: callback, onCreateHandler: callbackUpdate});
    }

}

const socketServiceInstance = new SocketService();
export default socketServiceInstance