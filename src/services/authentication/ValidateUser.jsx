import { Component } from 'react';
import axios from 'axios';
import MainData from '../MainData';

/**
* @class ValidateUser
* @extends {Component}
* @description validate user details
*/
class ValidateUser extends Component {
    /**
    * Get valid user details
    * @returns {Promise} promise
    */
    getUserDetails() {
        const url = MainData.appServiceURL + "userdetails";
        const requestHeaders = { withCredentials: true };
        return axios.get(url, requestHeaders).then((response) => {
            return response.data;
        }).catch((error) => {
            throw error;
        });
    }
}

export default (new ValidateUser());
