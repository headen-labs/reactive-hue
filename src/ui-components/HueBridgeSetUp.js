import React from 'react';

export default class HueBridgeSetUp extends React.Component {
    constructor(props) {
        super(props);

        this._updateHostname = this._updateHostname.bind(this);

        this.state = {hostname: null};
    }

    render() {
        return (
            <div class="row">
                <div class="col-4 offset-4 text-center">
                    <input 
                        className="form-control form-control-lg"
                        type="text"
                        id="bridgeHostname"
                        placeholder="Hue Bridge Hostname or IP..."
                        onChange={this._updateHostname}/>
                    <br/>
                    <button className="btn btn-lg btn-success" onClick={ () => this.props.connectClickHandler(this.state.hostname) }>Connect</button>
                </div>
            </div>
        );
    }

    _updateHostname(event) {
        this.setState({
            hostname: event.target.value
        });
    }
}