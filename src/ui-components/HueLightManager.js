import React from 'react';
import HueLightControl from './HueLightControl';

export default class HueLightManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {lights: null};
    }

    componentDidMount() {
        this.props.bridge.getLights().then(
            (lights) => this.setState({lights: lights}),
            () => console.log('Failed to get lights from bridge')
        );
    }

    render() {
        let lightControls = this.state.lights ?
            this.state.lights.map((light) => <HueLightControl bridge={this.props.bridge} light={light}/>) :
            <div class="col-12"><div class="alert alert-danger">No Lights Found</div></div>;

        return (
            <div class="row">
                <div class="col-4 offset-4">
                    <div class="row">
                        {lightControls}
                    </div>
                </div>
            </div>
        );
    }
}