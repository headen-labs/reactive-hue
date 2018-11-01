import React from 'react';
import Header from './Header';
import HueBridgeSetUp from './HueBridgeSetUp';
import HueLightManager from './HueLightManager';
import HueBridge from '../hue/HueBridge';
import LinkButtonException from '../hue/LinkButtonException';

export default class Application extends React.Component {
    constructor(props) {
        super(props)

        this._handleBridgeConnect = this._handleBridgeConnect.bind(this);
        this._isBridgeConnected = this._isBridgeConnected.bind(this);

        this.state = {
            bridge: null,
            errorMessage: null
        };
    }

    componentDidMount() {
        let storedHostname = window.localStorage.getItem('bridgeHostname');
        let storedUsername = window.localStorage.getItem('bridgeUsername');

        if (storedHostname && storedUsername) {
            let bridge = new HueBridge(storedHostname, new XMLHttpRequest());
            bridge.username = storedUsername;

            this.setState({bridge: bridge});
        }
    }

    render() {
        let body = this._isBridgeConnected() ?
            <HueLightManager bridge={this.state.bridge}/> :
            <HueBridgeSetUp connectClickHandler={this._handleBridgeConnect} errorMessage={this.state.errorMessage}/>;

        return (
            <div className="container-fluid">
                <Header/>
                {body}
            </div>
        );
    }

    _handleBridgeConnect(hostname) {
        let bridge = new HueBridge(hostname, new XMLHttpRequest());
        bridge.authenticate().then(
            () => {
                window.localStorage.setItem('bridgeHostname', hostname);
                window.localStorage.setItem('bridgeUsername', bridge.username);
                this.setState({bridge: bridge})
            },
            (err) => {
                if (err instanceof LinkButtonException) {
                    this.setState({bridge: null, errorMessage: 'Please press the button on your Hue bridge'});
                }
            }
        )
    }

    _isBridgeConnected() {
        return this.state.bridge != null;
    }
}
