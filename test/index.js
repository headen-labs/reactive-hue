import {expect} from 'chai';
import Sinon from 'sinon';
import HueBridge from '../src/hue/HueBridge';
import {LINK_BUTTON_ERROR_TYPE} from '../src/hue/HueBridgeErrorCodes';
import LinkButtonException from '../src/hue/LinkButtonException';
import Assert from 'assert';

describe("HueBridge", () => {
    describe('#constructor', () => {
        it("should construct without errors", () => {
            let bridge = new HueBridge('172.0.0.1', {});
        });
    });

    describe('#authenticate', () => {
        it('should make the correct AJAX calls', (done) => {
            let xhr = Sinon.useFakeXMLHttpRequest();
            let ajax = new xhr();

            let bridge = new HueBridge('172.0.0.1', ajax);
            let authenticationPromise = bridge.authenticate().then(() => {
                expect(ajax.url).to.equal('http://172.0.0.1/api');
                expect(ajax.method).to.equal('POST');
                expect(ajax.requestHeaders['Content-Type']).to.equal('application/json;charset=utf-8');
                expect(ajax.requestBody).to.equal(JSON.stringify({"devicetype": "reactive-hue"}));
            }).then(done, done);

            ajax.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(getHueAuthenticationSuccessJson('abc123'))
            );
        });

        it('should throw a LinkButtonException when a link button click is requred', (done) => {
            let xhr = Sinon.useFakeXMLHttpRequest();
            let ajax = new xhr();

            let bridge = new HueBridge('172.0.0.1', ajax);
            let authenticationPromise = bridge.authenticate().then(
                () => {},
                (error) => {
                    expect(error).to.be.instanceOf(LinkButtonException);
                }
            ).then(done, done);

            ajax.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(getHueErrorResponseJson(LINK_BUTTON_ERROR_TYPE, ""))
            );
        });

        it('should save the username', (done) => {
            let xhr = Sinon.useFakeXMLHttpRequest();
            let ajax = new xhr();

            let bridge = new HueBridge('172.0.0.1', ajax);
            let authenticationPromise = bridge.authenticate().then((username) => {
                expect(bridge.username).to.equal('abc123');
            }).then(done, done);

            ajax.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(getHueAuthenticationSuccessJson('abc123'))
            );
        });
    })
});

function getHueAuthenticationSuccessJson(username) {
    return [
        {
            "success": {
                "username": username
            }
        }
    ];
}

function getHueErrorResponseJson(errorTypeCode, description) {
    return [
        {
            "error": {
                "type": errorTypeCode,
                "address": "",
                "description": description
            }
        }
    ];
}