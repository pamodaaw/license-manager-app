import React, { Component } from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Description from 'material-ui/svg-icons/action/description';
import { Link } from 'react-router';
import styles from '../../styles';

/**
* @class LeftNav
* @extends {Component}
* @description Admin left nav
*/
class LeftNav extends Component {
    /**
    * @class Root
    * @extends {Component}
    * @description Admin left nav render method
    */
    render() {
        return (
                <Menu style={styles.menu}>
                    <Link to="/app/managePacks" >
                        <MenuItem
                            className="icon-menu-wrapper"
                            primaryText="Home"
                            leftIcon={<Description />}
                        />
                    </Link>
                </Menu>
        );
    }
}

export default LeftNav;
