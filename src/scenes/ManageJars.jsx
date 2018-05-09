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
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ServiceManager from '../services/msf4j/ServiceManager';
import styles from '../styles';
import {Paper} from "material-ui";
import StepComponent from "../components/StepComponent";
import ProgressComponent from "../components/ProgressComponent";
import HeaderComponent from "../components/HeaderComponent";

/**
 * @class ManageJars
 * @extends {Component}
 * @description Get the name and version missing jars for the pack and take the user input for name and version.
 */
class ManageJars extends Component {

    constructor(props) {
        super(props);
        this.state = {
            packName: props.location.query.selectedPack,//eslint-disable-line
            header: 'Define name and version of jars',
            nameMissingJars: [],
            // nameDefinedJars: [],
            openSaveData: false,
            openError: false,
            buttonState: false,
            displayProgress: 'block',
            displayStatus: 'none',
            displayForm: 'none',
            stepIndex: 1,
            errorMessage: '',
            statusMessage: ''
        };
        this.handleOpenSaveData = this.handleOpenSaveData.bind(this);
        this.handleCloseSaveData = this.handleCloseSaveData.bind(this);
        this.openError = this.openError.bind(this);
        this.closeError = this.closeError.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.setName = this.setName.bind(this);
        this.setVersion = this.setVersion.bind(this);
        this.backToMain = this.backToMain.bind(this);
        this.redirectToNext = this.redirectToNext.bind(this);
    }

    componentWillMount() {

        ServiceManager.extractJars(this.state.packName).then((response) => {
            if (response.data.responseType === 'Done') {
                this.setState(() => {
                    return {
                        statusMessage: response.data.responseMessage,
                        displayStatus: 'block',
                    };
                });
                let intervalID = setInterval(function () {
                    ServiceManager.checkProgress().then((responseNext) => {
                        if (responseNext.data.responseStatus === "complete") {
                            if (responseNext.data.responseData.length === 0) {
                                this.redirectToNext();
                            } else {
                                this.setState(() => {
                                    return {
                                        nameMissingJars: responseNext.data.responseData,
                                        // nameDefinedJars: response.data.responseData,
                                        displayProgress: 'none',
                                        displayStatus: 'none',
                                        displayForm: 'block',
                                    };
                                });
                            }
                            clearTimeout(intervalID);
                        } else if (responseNext.data.responseStatus === "running") {
                            this.setState(() => {
                                return {
                                    statusMessage: responseNext.data.responseMessage,
                                    displayStatus: 'block',

                                };
                            });
                        } else {
                            this.handleError(responseNext.data.responseMessage)
                        }
                    }).catch((error) => {
                        this.handleError("Network Error")
                    });

                }.bind(this), 5000);

            } else {
                this.handleError(response.data.responseMessage);
            }
        }).catch(() => {

            // this.setState(() => {
            //     return {
            //         nameMissingJars:             [{"index":0,"name":"patcsssssssssssssssssssssssh.jar","version":"patch.jar"}],
            //
            //         // nameDefinedJars: response.data.responseData,
            //         displayProgress: 'none',
            //         displayStatus: 'block',
            //         displayForm: 'block',
            //     };
            // });

            this.handleError("Network Error");
        });

    }

    /**
     * For all errors display customized message.
     * @param message
     */
    handleError(message) {
        this.setState(() => {
            return {
                errorMessage: message,
            };
        });
        this.openError();
    }

    /**
     * Set the version of the jar.
     * @param event text field change event.
     * @param i     index of the jar file.
     */
    setVersion(event, i) {
        const newVersion = event.target.value;
        this.state.nameMissingJars[i].version = newVersion;
    }

    /**
     * Set the name of the jar.
     * @param event text field change event.
     * @param i     index of the jar file.
     */
    setName(event, i) {
        const newName = event.target.value;
        this.state.nameMissingJars[i].name = newName;
    }

    /**
     * Handle open save data confirmation message.
     * @param e     button click event.
     */
    handleOpenSaveData(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState(() => {
            return {
                openSaveData: true,
            };
        });
    }


    /**
     * Handle the save data confirmation dialog close.
     */
    handleCloseSaveData() {
        this.setState(() => {
            return {
                openSaveData: false,
            };
        });
    }

    /**
     * handle open error message.
     */
    openError() {
        this.setState(() => {
            return {
                openError: true,
            };
        });
    }

    /**
     * Handle error message close.
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
        this.props.router.push({
            pathname: '/service/licenseAdder',
            state: {
                packName: this.state.packName,
                nameMissingJars: this.state.nameMissingJars,
            }
        });

    }

    /**
     * Handle Previous
     */
    handlePrev() {
        this.backToMain();
    }

    /**
     * Reload page.
     */
    reloadPage() {
        window.location.reload();
    }

    /**
     * Redirect to the main page.
     */
    backToMain() {
        hashHistory.push('/');
    }

    render() {
        const actions = [
            <FlatButton
                label="No"
                primary={true}
                onClick={this.handleCloseSaveData}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.redirectToNext}
            />,
        ];
        const actionsError = [
            <Link to={'/service/packManager'}>
                <FlatButton
                    label="Back"
                    primary={true}
                />
            </Link>,

        ];
        const table = [];
        let k = 0;
        if (this.state.nameMissingJars.length > 0) {
            let i;
            const jars = this.state.nameMissingJars;
            for (i = 0; i < jars.length; i++) {
                let index = i;
                let name = this.state.nameMissingJars[i].name.toString();
                table.push(
                    <TableRow key={i}>
                        <TableRowColumn style={{fontSize: '14px', width: '45%'}}
                                        key={k}>{name}</TableRowColumn>
                        <TableRowColumn style={{width: '35%'}} key={k + 1}>
                            <TextField
                                style={{fontSize: '14px'}}
                                defaultValue={this.state.nameMissingJars[i].name.toString()}
                                onChange={(event) => this.setName(event, index)}
                                underlineStyle={{borderColor: '#00bcd461'}}
                            />
                        </TableRowColumn>
                        <TableRowColumn style={{width: '20%'}} key={k + 2}>
                            <TextField
                                style={{fontSize: '14px'}}
                                defaultValue='1.0.0'
                                onChange={(event) => this.setVersion(event, index)}
                                underlineStyle={{borderColor: '#00bcd461'}}
                            />
                        </TableRowColumn>
                    </TableRow>
                );
                k = k + 4;
            }
        }

        return (
            <div className="container" style={{overflow:'auto'}}>
                <HeaderComponent header={this.state.header}/>
                <StepComponent
                    step={this.state.stepIndex}
                />

                {/*The table to enter the name and the version of name missing jars.*/}
                <form onSubmit={this.handleOpenSaveData} style={{display: this.state.displayForm}}>
                    <Table style={{overflow: 'auto'}}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow key={0}>
                                <TableHeaderColumn style={{fontSize: '20px', color: "#000000", width: '45%'}}>JAR File
                                    Name</TableHeaderColumn>
                                <TableHeaderColumn
                                    style={{fontSize: '20px', color: "#000000", width: '35%'}}>Name</TableHeaderColumn>
                                <TableHeaderColumn style={{
                                    fontSize: '20px',
                                    color: "#000000",
                                    width: '20%'
                                }}>Version</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={false}
                            showRowHover={true}
                        >
                            {table}
                        </TableBody>
                    </Table>
                    <br/>
                    <div className='test' style={styles.downloadArea}>
                        <RaisedButton
                            type="button"
                            label="Cancel"
                            onClick={this.reloadPage}
                            style={styles.saveButtonStyle}
                        />
                        <RaisedButton
                            type="submit"
                            label="Save"
                            style={styles.saveButtonStyle}
                            primary={true}
                            disabled={this.state.buttonState}
                        />
                    </div>
                </form>

                {/*Display the progress and the status.*/}
                <div style={{display: this.state.displayProgress}}>
                    <Paper style={styles.statusNote}>
                        <strong>Please Wait</strong><br/>
                        <p>{this.state.statusMessage}</p>
                    </Paper>
                    <ProgressComponent/>
                </div>

                <Dialog
                    title="Error"
                    actions={actionsError}
                    modal={false}
                    open={this.state.openError}
                >
                    {this.state.errorMessage}
                </Dialog>

                <Dialog
                    title="Confirm"
                    actions={actions}
                    modal={false}
                    open={this.state.openSaveData}
                >
                    Are you sure you want to save this data ?
                </Dialog>
            </div>

        );
    }
}

ManageJars = withRouter(ManageJars);
export default ManageJars;
