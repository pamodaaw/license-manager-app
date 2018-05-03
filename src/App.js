import React, { Component } from 'react';
import { Router, Route, hashHistory} from 'react-router';
import Root from './scenes/Root';
import ManagePacks from './scenes/ManagePacks';
import ManageJars from './scenes/ManageJars';
import AddLicense from './scenes/AddLicense';
import DownloadLicense from './scenes/GenerateLicense';
// import './App.css';

class App extends Component {
  render() {
    return (
        <Router history={hashHistory}>
            <Route path={'/app'} component={Root} >
                <Route path={'managePacks'} component={ManagePacks} />
                <Route path={'manageJars'} component={ManageJars} />
                <Route path={'generateLicense'} component={DownloadLicense} />
                <Route path={'licenseAdder'} component={AddLicense} />
                {/*<Route path={'downloader'} component={DownloadLicense}/>*/}
                <Route path={'/'} component={ManagePacks} />
            </Route>
        </Router>
    );
  }
}

export default App;
