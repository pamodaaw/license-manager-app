import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import AppHeader from '../components/layouts/AppHeader';
import ValidateUser from '../services/authentication/ValidateUser';

/**
 * @class Root
 * @extends {Component}
 * @description Root component where the relevant components will mount.
 */
class Root extends Component {

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

    render() {
        const props = this.props;
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div className="container-fluid" style={{paddingLeft: '0px', paddingRight: '0px'}}>

                    <div className="nav"
                         style={{display: this.state.displayHeader, paddingLeft: '0px', paddingRight: '0px', height: '80px'}}>
                        <AppHeader userDetail={this.state.userDetail}/>
                    </div>

                    <div className="container" style={{display: this.state.displayChildren}}>
                        <div className="col-sm-12"
                             style={{
                                 height: '100%',
                                 width:'100%',
                                 marginLeft: '1%',
                                 marginRight: '1%',
                                 paddingLeft: '2%',
                                 paddingRight: '2%'
                             }}>
                            {props.children}
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );

    }
}

export default Root;
