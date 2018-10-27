import React from 'react';

function Application() {
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

function Greeting() {
    return <h1>Reactive Hue</h1>;
}

export {
    Application,
    Greeting
};
