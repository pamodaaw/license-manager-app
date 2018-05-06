import React, {Component} from 'react';
import Person from 'material-ui/svg-icons/social/person';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ValidateUser from '../../services/authentication/ValidateUser';
import logo from '../../assets/images/logo-inverse.svg';
import styles from "../../styles";
import {Link} from "react-router";

/**
 * @class AppHeader
 * @extends {Component}
 * @description Header of the application for any user.
 */
class AppHeader extends Component {
    /**
     * constructor
     */
    constructor() {
        super();
        this.state = {
            username: null,
        };
    }

    componentWillMount() {

        ValidateUser.getUserDetails().then((response) => {
            this.setState(() => {
                return {
                    username: response.username,
                };
            });
        })

    }

    render() {
        return (
            <nav className="navbar navbar-inverse" style={{backgroundColor: "#000000", height: '100%'}}>
                <div className="container-fluid">

                    <Link
                        to={{
                            pathname: '/',
                        }}
                    >
                        <div className="navbar-header">
                            <img id="logo" style={{height: '50px'}} src={logo} alt="wso2"/>
                            <a className="navbar-brand" href=''
                               style={{color: "#FBFCFC", fontSize: '40px', paddingLeft: '20px'}}>License Manager</a>
                        </div>
                    </Link>

                    <ul className="nav navbar-nav navbar-right">
                        <li><a style={{color: "#FBFCFC"}}>{this.state.username}</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default AppHeader;
