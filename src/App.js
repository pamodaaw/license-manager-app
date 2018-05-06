import React, { Component } from 'react';
import { Router, Route, hashHistory} from 'react-router';
import Root from './scenes/Root';
import ManagePacks from './scenes/ManagePacks';
import ManageJars from './scenes/ManageJars';
import AddLicense from './scenes/AddLicense';
import GenerateLicense from './scenes/GenerateLicense';
import frontPage from './scenes/InitialPage'
// import './App.css';

class App extends Component {
  render() {
    return (
        <Router history={hashHistory}>
            <Route path={'/app'} component={Root} >
                <Route path={'managePacks'} component={ManagePacks} />
                <Route path={'manageJars'} component={ManageJars} />
                <Route path={'licenseGenerator'} component={GenerateLicense} />
                <Route path={'licenseAdder'} component={AddLicense} />
                <Route path={'/'} component={frontPage} />
            </Route>
        </Router>
    );
  }
}

export default App;
