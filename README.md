[![Build Status](https://travis-ci.org/headen-labs/reactive-hue.svg?branch=master)](https://travis-ci.org/headen-labs/reactive-hue)

# Reactive Hue

A fully client-side React.js application to control Phillips Hue lights

## Building the Code

This project makes use of Webpack to build and produce the JavaScript, CSS, and HTML bundles needed to run the application in the browser. To build the code, ensure you have Node.js and NPM installed, then run the following:

```
npm run build
```

This command will then invoke the Webpack build process which could take a few seconds to complete. Once complete, you can run the application by opening the `index.html` file saved to the `build` directory created by Webpack.

## Running Tests

Core code is unit tested using the Mocha, Chai, and Sinon libraries. To run unit tests, simply run the following command:

```
npm test
```

That will run the full unit test suite. If you are on the master branch, it is expected that the build will pass. If you contribute code to Reactive Hue, you must run tests to ensure you don't break anything and add tests for new core code that you introduce.
