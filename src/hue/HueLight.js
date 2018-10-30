export default class HueLight
{
    constructor(id, lightJson) {
        this.id = id;
        this.name = lightJson.name;
        this.brightness = lightJson.state.bri;
        this.on = lightJson.state.on;
    }
}