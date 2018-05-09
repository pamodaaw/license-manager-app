/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import { Router, Route, browserHistory,hashHistory} from 'react-router';
import Root from './scenes/Root';
import ManagePacks from './scenes/ManagePacks';
import ManageJars from './scenes/ManageJars';
import AddLicense from './scenes/AddLicense';
import GenerateLicense from './scenes/GenerateLicense';
import frontPage from './scenes/InitialPage'
import IndexRoute from "react-router/es/IndexRoute";
// import './App.css';

class App extends Component {
  render() {
    return (
//        <Router >
  //          <Route path={'/service'} component={Root} history={browserHistory} >
    //            <IndexRoute component={frontPage} />
      //          <Route path={'packManager'} component={ManagePacks} />
        //        <Route path={'jarManager'} component={ManageJars} />
          //      <Route path={'licenseGenerator'} component={GenerateLicense} />
//                <Route path={'licenseAdder'} component={AddLicense} />
//                <Route path={'/'} component={frontPage} />
//            </Route>
//        </Router>
        <Router history={hashHistory}>
            <Route path={'/service'} component={Root} >
                <Route path={'packManager'} component={ManagePacks} />
                <Route path={'jarManager'} component={ManageJars} />
                <Route path={'licenseGenerator'} component={GenerateLicense} />
                <Route path={'licenseAdder'} component={AddLicense} />
                <Route path={'/'} component={frontPage} />
            </Route>
        </Router>

  //       <Router>
  //       <Route path="/" component={Main} history={browserHistory}>
  //         <IndexRoute component={Home} />
  //     <Route path="/cars" component={Car}/>
  //     <Route path="/about" component={About}/>
  // </Route>
  // </Router>
    );
  }
}

export default App;
