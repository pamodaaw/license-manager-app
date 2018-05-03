import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme  from 'material-ui/styles/baseThemes/lightBaseTheme';
import AppHeader from '../components/layouts/AppHeader';
import ValidateUser from '../services/authentication/ValidateUser';

/**
* @class Root
* @extends {Component}
* @description Root component
*/
class Root extends Component {
    /**
    * constructor
    * @param {any} props props
    */
    constructor(props) {
        super(props);
        this.state = {
            isValid: null,
            displayChildren: 'block',
            displayNav: 'block',
            displayHeader: 'block',
            userDetail: null,
        };
    }
    /**
    * @class Root
    * @extends {Component}
    * @description componentWillMount
    */
    componentWillMount() {
        ValidateUser.getUserDetails().then((response) => {
            if (response.isValid) {
                this.setState(() => {
                    return {
                        userDetail: response,
                    };
                });
            } else {
                hashHistory.push('/');
            }
        });
    }
    /**
    * @class Root
    * @extends {Component}
    * @description render
    */
    render() {
        const props = this.props;
        /* eslint-disable max-len */
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div className="container-fluid" style={{ paddingLeft: '0px', paddingRight: '0px', height:'20px' }}>
                    <div className="row" id="header">
                        <div className="col-sm-12" style={{ display: this.state.displayHeader, paddingTop: '0px',paddingLeft: '0px', paddingRight: '0px' }} >
                            <AppHeader userDetail={this.state.userDetail} />
                        </div>
                    </div>
                    <div className="row"  style={{ display: this.state.displayChildren, padding: "0 !important", overflowY: 'auto', overflowX: 'hidden' }}>
                        <div className="col-sm-12"
                             style={{ display: this.state.displayChildren,
                                 height:'100%',
                                 marginLeft:'1%',
                                 marginRight:'1%',
                                 paddingLeft: '2%',
                                 paddingRight: '2%'
                             }} >
                            {props.children}
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );

    }
}

export default Root;
