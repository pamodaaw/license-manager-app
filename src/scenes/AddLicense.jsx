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

import React, {Component} from 'react';
import {Link, hashHistory, withRouter} from 'react-router';
import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableBody,
    TableRowColumn,
} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ServiceManager from '../services/msf4j/ServiceManager';
import styles from '../styles';
import StepComponent from "../components/StepComponent";
import ProgressComponent from "../components/ProgressComponent";
import HeaderComponent from "../components/HeaderComponent";
import {Checkbox} from "material-ui";

/**
 * @class AddLicense
 * @extends {Component}
 * @description Add licenses for the jars if missing any
 */
class AddLicense extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nameDefinedJars: this.props.location.state.nameMissingJars,
            packName: this.props.location.state.packName,
            openError: false,
            confirmLicense: false,
            displayProgress: 'block',
            displayFormLicense: 'none',
            displayDownload: 'none',
            displayComponentTable: 'none',
            displayLibraryTable: 'none',
            checked: false,
            header: 'Add Licenses for the jars',
            licenseMissingComponents: [],
            licenseMissingLibraries: [],
            license: [],
            stepIndex: 2,
            errorMessage: '',
        };
        this.handleAddLicense = this.handleAddLicense.bind(this);
        this.handleComponentSelect = this.handleComponentSelect.bind(this);
        this.handleLibrarySelect = this.handleLibrarySelect.bind(this);
        this.openError = this.openError.bind(this);
        this.closeError = this.closeError.bind(this);
        this.openConfirmation = this.openConfirmation.bind(this);
        this.closeConfirmation = this.closeConfirmation.bind(this);
        this.redirectToNext = this.redirectToNext.bind(this);
        this.handleError = this.handleError.bind(this);
        this.updateCheck = this.updateCheck.bind(this);
    }

    componentWillMount() {
        ServiceManager.selectLicense().then((response) => {
            if (response.data.responseType === "Done") {
                if (response.data.responseData.length !== 0) {
                    this.setState(() => {
                        return {
                            license: response.data.responseData,
                        };
                    });
                }
            } else {
                this.handleError(response.data.responseMessage);
            }
        }).catch(() => {
            this.handleError("Network Error");
        });
        ServiceManager.enterJars(this.state.nameDefinedJars).then((response) => {
            if (response.data.responseType === "Done") {
                if (response.data.component.length === 0 && response.data.library.length === 0) {
                    this.redirectToNext();
                } else {
                    this.setState(() => {
                        return {
                            displayFormLicense: 'block',
                            displayProgress: 'none',
                            header: 'Add Licenses for the jars',
                            licenseMissingComponents: response.data.component,
                            licenseMissingLibraries: response.data.library,
                            stepIndex: 2,
                        };
                    });
                }
            } else {
                this.handleError(response.data.responseMessage);
            }
        }).catch(() => {
            this.handleError("Network Error");
        });
    }

    handleError(message) {
        this.setState(() => {
            return {
                errorMessage: message,
            };
        });
        this.openError();
    }

    handleAddLicense(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState(() => {
            return {
                displayProgress: 'block',
                displayFormLicense: 'none',
                confirmLicense: false,
            };
        });
        ServiceManager.addLicense(this.state.licenseMissingComponents, this.state.licenseMissingLibraries).then((response) => {
            if (response.data.responseType === 'Done') {
                this.redirectToNext();
            } else {
                this.handleError(response.data.responseMessage)
            }
        }).catch(() => {
            this.handleError("Network Error");
        });
    }

    openConfirmation(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState(() => {
            return {
                confirmLicense: true,
            };
        });
    }

    closeConfirmation() {
        this.setState(() => {
            return {
                confirmLicense: false,
            };
        });
    }

    /**
     * Handle open error message
     */
    openError() {
        this.setState(() => {
            return {
                openError: true,
            };
        });
    }

    /**
     * Handle close error message
     */
    closeError() {
        this.setState(() => {
            return {
                openError: false,
            };
        });
    }

    /**
     * Redirect to the next page based on the response.
     */
    redirectToNext() {
        hashHistory.push({
            pathname: '/service/licenseGenerator',
            state: {
                packName: this.state.packName,
            }
        });
    }

    /**
     * Handle the check box click event.
     */
    updateCheck() {
        this.setState((oldState) => {
            return {
                checked: !oldState.checked
            };
        });
    }

    /**
     * Handle the event when licenses are selected for a component.
     * @param {any} event event
     * @param {any} j event
     * @param {any} n event
     * @param {any} m event
     */
    handleComponentSelect(event, j, n, m) {
        const comp = this.state.licenseMissingComponents.map((jar, i) => {
            if (i !== event) {
                return jar;
            } else {
                const jarFile = {
                    index: jar.index,
                    name: jar.name,
                    version: jar.version,
                    type: jar.type,
                    previousLicense: jar.previousLicense,
                    licenseKey: m,
                };
                return (jarFile);
            }
        });
        this.setState(() => {
            return {
                licenseMissingComponents: comp,
            };
        });
    }

    /**
     * Handle the event when licenses are selected for a library.
     * @param {any} event event
     * @param {any} j event
     * @param {any} n event
     * @param {any} m event
     */
    handleLibrarySelect(event, j, n, m) {
        const lib = this.state.licenseMissingLibraries.map((jar, i) => {
            if (i !== event) {
                return jar;
            } else {
                const jarFile = {
                    index: jar.index,
                    name: jar.name,
                    version: jar.version,
                    type: jar.type,
                    previousLicense: jar.previousLicense,
                    licenseKey: m,
                };
                return (jarFile);
            }
        });
        this.setState(() => {
            return {
                licenseMissingLibraries: lib,
            };
        });
    }

    render() {
        const licenseConfirmActions = [
            <FlatButton
                label="Save"
                primary={true}
                onClick={this.handleAddLicense}
            />,
            <FlatButton
                label="Recheck"
                primary={true}
                onClick={this.closeConfirmation}
            />
        ];
        const actionsError = [
            <Link to={'/service/packManager'}>
                <FlatButton
                    label="Back"
                    primary={true}
                />
            </Link>,

        ];
        const component = [];
        const library = [];
        const license = [];
        const licenseList = this.state.license;

        let displayComponent = 'none';
        let displayLibrary = 'none';
        let k = 0;
        for (let i = 0; i < licenseList.length; i++) {
            license.push(
                <MenuItem
                    value={licenseList[i].LICENSE_KEY}
                    key={licenseList[i].LICENSE_ID}
                    primaryText={licenseList[i].LICENSE_KEY}
                />
            );
        }
        if (this.state.licenseMissingComponents.length > 0) {
            let i = 0;
            const jars = this.state.licenseMissingComponents;
            for (i = 0; i < jars.length; i++) {
                let previousLicenseTextColor = {color: '#000000'};
                let licenseTextColor;
                if (jars[i].previousLicense !== 'apache2') {
                    previousLicenseTextColor = {color: '#008080'}
                }
                if (jars[i].licenseKey !== 'apache2') {
                    licenseTextColor = {color: '#008080'}
                }
                component.push(
                    <TableRow style={previousLicenseTextColor} key={i}>
                        <TableRowColumn style={{fontSize: '14px', width: '35%'}}
                                        key={k}>{jars[i].name}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '15%'}}
                                        key={k + 1}>{jars[i].version}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '15%'}}
                                        key={k + 2}>{jars[i].type}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '15%'}}
                                        key={k + 3}>{jars[i].previousLicense}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '20%'}} key={k + 4}>
                            <SelectField
                                style={styles.selectField}
                                labelStyle={licenseTextColor}
                                autoWidth={true}
                                value={this.state.licenseMissingComponents[i].licenseKey}
                                onChange={this.handleComponentSelect.bind(this, i)}
                                maxHeight={200}
                                underlineStyle={{borderColor: '#00bcd461'}}
                            >
                                {license}
                            </SelectField>
                        </TableRowColumn>
                    </TableRow>
                );
                k = k + 3;
            }
            displayComponent = 'block';
        } else {
            displayComponent = 'none';
        }
        if (this.state.licenseMissingLibraries.length > 0) {
            let i;
            const jars = this.state.licenseMissingLibraries;
            for (i = 0; i < jars.length; i++) {
                let previousLicenseTextColor = {color: '#000000'};
                let licenseTextColor;
                if (jars[i].previousLicense !== 'apache2') {
                    previousLicenseTextColor = {color: '#008080'}
                }
                if (jars[i].licenseKey !== 'apache2') {
                    licenseTextColor = {color: '#008080'}
                }

                library.push(
                    <TableRow style={previousLicenseTextColor} key={i}>
                        <TableRowColumn style={{fontSize: '14px', width: '35%'}}
                                        key={k}>{jars[i].name}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '15%'}}
                                        key={k + 1}>{jars[i].version}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '15%'}}
                                        key={k + 2}>{jars[i].type}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '15%'}}
                                        key={k + 3}>{jars[i].previousLicense}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '20%'}} key={k + 4}>
                            <SelectField
                                style={styles.selectField}
                                labelStyle={licenseTextColor}
                                value={this.state.licenseMissingLibraries[i].licenseKey}
                                onChange={this.handleLibrarySelect.bind(this, i)}
                                maxHeight={200}
                                underlineStyle={{borderColor: '#00bcd461'}}
                                selectedMenuItemStyle={{color: '#2874A6'}}
                            >
                                {license}
                            </SelectField>
                        </TableRowColumn>
                    </TableRow>
                );
                k = k + 4;
            }
            displayLibrary = 'block';
        } else {
            displayLibrary = 'none';
        }
        return (
            <div className="container">
                <HeaderComponent header={this.state.header}/>
                <StepComponent
                    step={this.state.stepIndex}
                />
                <form onSubmit={this.openConfirmation} style={{display: this.state.displayFormLicense}}>
                    <div style={{display: displayComponent}}>
                        <Subheader style={styles.subHeader}>Components</Subheader>
                        <Table style={{overflow: 'auto'}}>>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow key={0}>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '35%'
                                    }}>Name</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '15%'
                                    }}>Version</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '15%'
                                    }}>Type</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '15%'
                                    }}>License</TableHeaderColumn>
                                    <TableHeaderColumn style={{fontSize: '20px', color: "#000000", width: '20%'}}>Select
                                        License</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}
                                       showRowHover={true}
                            >
                                {component}
                            </TableBody>
                        </Table>
                    </div>
                    <br/>
                    <div style={{display: displayLibrary}}>
                        <Subheader style={styles.subHeader}>Libraries</Subheader>
                        <Table style={{overflow: 'auto'}}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow key={0}>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '35%'
                                    }}>Name</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '15%'
                                    }}>Version</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '15%'
                                    }}>Type</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '15%'
                                    }}>License</TableHeaderColumn>
                                    <TableHeaderColumn style={{fontSize: '20px', color: "#000000", width: '20%'}}>Select
                                        License</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}
                                       showRowHover={true}
                            >
                                {library}
                            </TableBody>
                        </Table>
                    </div>
                    <br/>
                    <Checkbox
                        label='I guarantee that all the licenses added are correct.'
                        checked={this.state.checked}
                        onCheck={this.updateCheck.bind(this)}
                    />
                    <RaisedButton
                        type="submit"
                        label="Accept and Save"
                        style={styles.saveButtonStyle}
                        primary={true}
                        disabled={!this.state.checked}
                    />
                </form>

                <Dialog
                    title="Error"
                    actions={actionsError}
                    modal={false}
                    open={this.state.openError}
                >
                    {this.state.errorMessage}
                </Dialog>

                <div className="container-fluid" style={{display: this.state.displayProgress}}>
                    <ProgressComponent/>
                </div>

                <Dialog
                    title="Confirm"
                    actions={licenseConfirmActions}
                    modal={false}
                    open={this.state.confirmLicense}
                    onRequestClose={this.handleClose}
                >
                    Make sure you have added the correct licenses.
                </Dialog>
            </div>

        );
    }
}

AddLicense = withRouter(AddLicense);
export default AddLicense;
