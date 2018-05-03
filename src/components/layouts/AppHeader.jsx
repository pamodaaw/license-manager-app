import React, { Component } from 'react';
import Person from 'material-ui/svg-icons/social/person';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ValidateUser from '../../services/authentication/ValidateUser';
import logo from '../../assets/images/logo-inverse.svg';

/**
* @class AppHeader
* @extends {Component}
* @description Normal user header
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
        this.logout = this.logout.bind(this);
    }
    /**
    * @class AppHeader
    * @extends {Component}
    * @description Normal user header
    */
    componentWillMount() {

        ValidateUser.getUserDetails().then((response) => {
            this.setState(() => {
                return {
                    username: response.username,
                };
            });
        });

    }
    /**
    * logout
    */
    logout() {
        window.close('', '_self');
    }
    /**
    * @class AppHeader
    * @extends {Component}
    * @description Normal user header
    */
    render() {
        return (
            <nav className="navbar navbar-default" style={{marginBottom: '0px', borderRadius:'0px'}} >
                    <div className="navbar-header" style={{padding: '14px'}}>
                        <img id="logo" style={{ height: '40px' }} src={logo} alt="wso2" />
                        <strong style={{ color: 'white', fontSize: '30px', marginLeft: '10px', }}> License Manager</strong>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse" >
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <button>Home</button>
                            </li>
                            <li>
                                <IconMenu
                                    iconButtonElement={<IconButton><Person style={{ paddingTop: 0, paddingBottom: 0 }} /></IconButton>}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem primaryText={this.state.username} disabled={true} style={{ color: '#ffffff' }} />
                                    <MenuItem primaryText="Sign out" onClick={this.logout} />
                                </IconMenu>
                            </li>
                        </ul>
                    </div>
            </nav>
        );
    }
}

export default AppHeader;
