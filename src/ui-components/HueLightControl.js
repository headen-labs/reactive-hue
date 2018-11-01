import React from 'react';

export default class HueLightControl extends React.Component {
    constructor(props) {
        super(props);

        this._handleTurnOffClick = this._handleTurnOffClick.bind(this);
        this._handleTurnOnClick = this._handleTurnOnClick.bind(this);

        this.state = {light: this.props.light};
    }

    render() {
        let onOffButton = this.props.light.on ?
            <a href="#" className="btn btn-light" onClick={this._handleTurnOffClick}>Turn Off</a> :
            <a href="#" className="btn btn-dark" onClick={this._handleTurnOnClick}>Turn On</a>;

        return (
            <div className="col-4">
                <div className="card" style={ {width: "18rem"} }>
                    <div className="card-body">
                        <h5 className="card-title">{this.props.light.name}</h5>
                        {onOffButton}
                    </div>
                </div>
            </div>
        );
    }

    _handleTurnOffClick() {
        this.props.light.on = false;
        this.props.bridge.updateLight(this.props.light).then(() => {
            this.setState({light: this.props.light});
        });
    }

    _handleTurnOnClick() {
        this.props.light.on = true;
        this.props.bridge.updateLight(this.props.light).then(() => {
            this.setState({light: this.props.light});
        });
    }
}