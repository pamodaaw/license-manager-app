import { Component } from 'react';
import axios from 'axios';
import MainData from '../MainData';

/**
* @class ServiceManager
* @extends {Component}
* @description all package management services
*/
class ServiceManager extends Component {
    /**
    * getUploadedPacks
    * @returns {Promise} promise
    */
    getUploadedPacks() {
        const url = MainData.microServiceURL + 'getPacks';
        const requestConfig = { withCredentials: true, timeout: 40000000 };

        return axios.get(url, requestConfig).then((response) => {
            return response;
        }).catch((error) => {
            throw error
        });
    }
    /**
    * selectLicense
    * @returns {Promise} promise
    */
    selectLicense() {
        const url = MainData.microServiceURL + 'selectLicense';
        const requestConfig = { withCredentials: true };
        return axios.get(url, requestConfig).then((response) => {
            return response;
        }).catch((error) => {
            throw error
        });
    }
    /**
    * getLicense
    * @returns {Promise} promise
    */
    getLicense() {
        const url = MainData.microServiceURL + 'getLicense';
        const requestConfig = { withCredentials: true, timeout: 40000000 };
        return axios.get(url, requestConfig).then((response) => {
            return response;
        }).catch((error) => {
            throw error
        });
    }
    /**
    * downloadLicense
    * @returns {Promise} promise
    */
    dowloadLicense() {
        const url = MainData.microServiceURL + 'downloadLicense';
        const requestConfig = { withCredentials: true, timeout: 30000 };
        return axios.get(url, requestConfig).then((response) => {
            return response;
        }).catch((error) => {
            throw error
        });
    }

    /**
    * extractJars
    * @returns {Promise} promise
    */
    extractJars(selectedPack) {
        const url = MainData.microServiceURL + 'extractJars';
        const requestConfig = {
            withCredentials: true,
        };
        return axios.post(url, selectedPack, requestConfig).then((response) => {
            return response;
        }).catch((error) => {
            throw error
        });
    }
    /**
    * enterJars
    * @param {json} data json
    * @param {string} email email
    * @returns {Promise} promise
    */
    enterJars(data, email) {
        const url = MainData.microServiceURL + 'enterJars';
        const requestConfig = {
            withCredentials: true,
        };
        const requestData = {
            jars: data,
        };
        return axios.post(url, requestData, requestConfig).then((response) => {
            return response;
        }).catch((error) => {
            throw error
        });
    }
    /**
    * addLicense
    * @returns {Promise} promise
    */
    addLicense(components, libraries) {
        const url = MainData.microServiceURL + 'addLicense';
        const requestConfig = {
            withCredentials: true,
        };
        const licenseData = {
            components: components,
            libraries: libraries,
        };
        return axios.post(url, JSON.stringify(licenseData), requestConfig).then((response) => {
            return response;
        }).catch((error) => {
            throw error
        });
    }
    /**
    * checkprogress
    * @returns {Promise} promise
    */
    checkProgress() {
        const url = MainData.microServiceURL + 'progress';
        const requestConfig = {
            withCredentials: true,
        };
        return axios.get(url, requestConfig).then((response) => {
            return response;
        }).catch((error) => {
            throw error
        });
    }
}

export default (new ServiceManager());
