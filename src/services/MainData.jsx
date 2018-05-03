import { Component } from 'react';

/**
 * @class MainData
 * @extends {Component}
 * @description Main config data exchanging component
 */
class MainData extends Component {
    /**
    * @class MainData
    * @extends {Component}
    * @description constructor
    */
    constructor() {
        super();
        const Config = require('../configuration.json');
        // fetchData(Config.serverUrl + '/Enterprises/...')
        this.microServiceURL = Config.microServiceUrl;
        this.appServiceURL = Config.appServiceUrl;
    }
}

export default (new MainData());
