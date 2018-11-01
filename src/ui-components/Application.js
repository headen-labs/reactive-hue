import React from 'react';
import Header from './Header';
import HueBridgeSetUp from './HueBridgeSetUp';

export default class Application extends React.Component {
    constructor(props) {
        super(props)

        this._handleBridgeConnect = this._handleBridgeConnect.bind(this);

        this.state = {
            bridge: null
        };
    }

    render() {
        return (
            <div className="container-fluid">
                <Header/>
                <HueBridgeSetUp connectClickHandler={this._handleBridgeConnect}/>
            </div>
        );
    }

    _handleBridgeConnect(hostname) {
        console.log(hostname);
    }
}
