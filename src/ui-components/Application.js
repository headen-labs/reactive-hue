import React from 'react';
import Greeting from './Greeting';

export default function Application() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 text-center">
                    <Greeting/>
                </div>
            </div>
        </div>
    );
}
