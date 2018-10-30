import {expect} from 'chai';
import Sinon from 'sinon';
import HueBridge from '../src/hue/HueBridge';
import {LINK_BUTTON_ERROR_TYPE} from '../src/hue/HueBridgeErrorCodes';
import LinkButtonException from '../src/hue/LinkButtonException';
import NotLoggedInException from '../src/hue/NotLoggedInException';
import Assert from 'assert';
import HueLight from '../src/hue/HueLight';

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
    });

    describe("#getLights", () => {
        it('should throw a NotLoggedInException if not authenticated', (done) => {
            let xhr = Sinon.useFakeXMLHttpRequest();
            let ajax = new xhr();

            let bridge = new HueBridge('172.0.0.1', ajax);
            bridge.getLights().then(
                () => {},
                (error) => {
                    expect(error).to.be.instanceOf(NotLoggedInException);
                }
            ).then(done, done);
        });

        it('should make the correct AJAX calls', (done) => {
            let xhr = Sinon.useFakeXMLHttpRequest();
            let ajax = new xhr();

            let bridge = new HueBridge('172.0.0.1', ajax);
            bridge.username = 'abc123';

            bridge.getLights().then((lights) => {
                expect(ajax.url).to.equal('http://172.0.0.1/api/' + bridge.username + '/lights');
                expect(ajax.method).to.equal('GET');
                expect(ajax.requestHeaders['Content-Type']).to.equal('application/json;charset=utf-8');
            }).then(done, done);

            ajax.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(getHueLightsDiscoveryJson())
            );
        });

        it('should provide a list of discovered HueLight objects', (done) => {
            let xhr = Sinon.useFakeXMLHttpRequest();
            let ajax = new xhr();
            let mockXhrResponseData = getHueLightsDiscoveryJson();

            let expectedLights = [];
            expectedLights.push(new HueLight("1", mockXhrResponseData["1"]));
            expectedLights.push(new HueLight("2", mockXhrResponseData["2"]));

            let bridge = new HueBridge('172.0.0.1', ajax);
            bridge.username = 'abc123';

            bridge.getLights().then((lights) => {
                expect(lights).to.deep.equal(expectedLights);
            }).then(done, done);

            ajax.respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(mockXhrResponseData)
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

function getHueLightsDiscoveryJson() {
    return {
        "1": {
            "state": {
                "on": false,
                "bri": 254,
                "alert": "none",
                "mode": "homeautomation",
                "reachable": true
            },
            "swupdate": {
                "state": "noupdates",
                "lastinstall": "2018-01-01T00:00:00"
            },
            "type": "Dimmable light",
            "name": "Bed Lamp",
            "modelid": "LWB006",
            "manufacturername": "Philips",
            "productname": "Hue white lamp",
            "capabilities": {
                "certified": true,
                "control": {
                    "mindimlevel": 5000,
                    "maxlumen": 800
                },
                "streaming": {
                    "renderer": false,
                    "proxy": false
                }
            },
            "config": {
                "archetype": "classicbulb",
                "function": "functional",
                "direction": "omnidirectional"
            },
            "uniqueid": "00:00:00:00:00:00:00:00-00",
            "swversion": "0.0.0.0"
        },
        "2": {
            "state": {
                "on": true,
                "bri": 254,
                "alert": "none",
                "mode": "homeautomation",
                "reachable": true
            },
            "swupdate": {
                "state": "noupdates",
                "lastinstall": "2018-01-01T00:00:00"
            },
            "type": "Dimmable light",
            "name": "Desk Lamp",
            "modelid": "LWB006",
            "manufacturername": "Philips",
            "productname": "Hue white lamp",
            "capabilities": {
                "certified": true,
                "control": {
                    "mindimlevel": 5000,
                    "maxlumen": 800
                },
                "streaming": {
                    "renderer": false,
                    "proxy": false
                }
            },
            "config": {
                "archetype": "classicbulb",
                "function": "functional",
                "direction": "omnidirectional"
            },
            "uniqueid": "00:00:00:00:00:00:00:00-00",
            "swversion": "0.0.0.0"
        }
    }
}