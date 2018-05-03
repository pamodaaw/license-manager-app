import { Component } from 'react';
import axios from 'axios';
import MainData from '../MainData';
// import Token from './Token';

/**
* @class ValidateUser
* @extends {Component}
* @description validate user details
*/
class ValidateUser extends Component {
    /**
    * get valid user details
    * @returns {Promise} promise
    */
    getUserDetails() {
        const url = MainData.appServiceURL + "userdetails";
        const requestHeaders = { withCredentials: true };
        return axios.get(url, requestHeaders).then((response) => {
            return response.data;
        }).catch((error) => {
            return "unknown";
        });
    }
}

export default (new ValidateUser());
