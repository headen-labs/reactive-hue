import {LINK_BUTTON_ERROR_TYPE} from './HueBridgeErrorCodes';
import LinkButtonException from './LinkButtonException';
import NotLoggedInException from './NotLoggedInException';
import HueLight from './HueLight';

export default class HueBridge
{
    constructor(ipAddress, ajax) {
        this.ipAddress = ipAddress;
        this.ajax = ajax;
        this.username = null;
    }

    authenticate() {
        return new Promise((resolve, reject) => {
            this.ajax.addEventListener('load', () => {
                let response = JSON.parse(this.ajax.responseText);
                if (response[0].error && response[0].error.type == LINK_BUTTON_ERROR_TYPE) {
                    reject(new LinkButtonException());
                    return;
                }

                this.username = response[0].success.username;
                resolve();
            });
            
            this.ajax.open('POST', 'http://' + this.ipAddress + '/api');
            this.ajax.setRequestHeader('Content-Type', 'application/json');

            this.ajax.send(JSON.stringify({
                devicetype: 'reactive-hue'
            }));
        });
    }

    getLights() {
        return new Promise((resolve, reject) => {
            if (this.username == null) {
                reject(new NotLoggedInException());
            }

            this.ajax.addEventListener('load', () => {
                let response = JSON.parse(this.ajax.responseText);
                let lights = Object.keys(response).map((lightId) => {
                    return new HueLight(lightId, response[lightId]);
                });

                resolve(lights);
            });

            this.ajax.open('GET', 'http://' + this.ipAddress + '/api/' + this.username + '/lights');
            this.ajax.setRequestHeader('Content-Type', 'application/json');
            this.ajax.send();
        });
    }
}