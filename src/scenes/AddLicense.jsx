import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router';
import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableBody,
    TableRowColumn,
} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ServiceManager from '../services/msf4j/ServiceManager';
import styles from '../styles';

/**
 * @class NameErrorJarsLicense
 * @extends {Component}
 * @description Get user details
 */
class AddLicense extends Component {
    /**
     * @class NameErrorJarsLicense
     * @extends {Component}
     * @param {any} props props for constructor
     * @description Sample React component
     */
    constructor(props) {
        super(props);
        this.state = {
            userEmail: this.props.location.state.userEmail,//eslint-disable-line
            nameJars:this.props.location.state.nameJars,
            openError: false,
            openSuccess: false,
            openLicense: false,
            confirmLicense: false,
            errorIcon: '',
            displayProgress: 'block',
            displayLoader: 'none',
            displayFormLicense: 'none',
            displayDownload: 'none',
            displayComponentTable: 'none',
            displayLibraryTable: 'none',
            displayErrorBox: 'none',
            buttonState: false,
            header: 'Please add Licenses for the jars.',
            licenseMissingComponents: [],
            licenseMissingLibraries: [],
            license: [],
            stepIndex: 1,
            errorMessage: '',
        };
        this.handleAddLicense = this.handleAddLicense.bind(this);
        this.handleComponentSelect = this.handleComponentSelect.bind(this);
        this.handleLibrarySelect = this.handleLibrarySelect.bind(this);
        this.handleOpenError = this.handleOpenError.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.handleOpenConfirm = this.handleOpenConfirm.bind(this);
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.backToMain = this.backToMain.bind(this);
    }

    /**
     * @class NameErrorJarsLicense
     * @extends {Component}
     * @description componentWillMount
     */
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
                this.setState(() => {
                    return {
                        errorMessage: response.data.responseMessage,
                    };
                });
                this.handleOpenError();
            }
        }).catch((error) => {
            throw new Error(error);
        });
        ServiceManager.enterJars(this.state.nameJars, this.state.userEmail).then((responseNxt) => {
            if (responseNxt.data.responseType === 'Done') {
                if (responseNxt.data.component.length === 0 && responseNxt.data.library.length === 0) {
                    this.setState(() => {
                        return {
                            displayDownload: 'block',
                            displayFormLicense: 'none',
                            displayLoader: 'none',
                            displayProgress: 'none',
                            header: 'Download License Here',
                            licenseMissingComponents: responseNxt.data.component,
                            licenseMissingLibraries: responseNxt.data.library,
                            stepIndex: 3,
                        };
                    });
                } else {
                    this.setState(() => {
                        return {
                            displayFormLicense: 'block',
                            displayLoader: 'none',
                            displayProgress: 'none',
                            header: 'Select License for these JARs',
                            licenseMissingComponents: responseNxt.data.component,
                            licenseMissingLibraries: responseNxt.data.library,
                            stepIndex: 2,
                        };
                    });
                }
            } else {
                this.handleOpenError();
                this.setState(() => {
                    return {
                        displayFormLicense: 'none',
                        displayProgress: 'none',
                        displayLoader: 'none',
                        header: 'Unknown Error occured.',
                    };
                });
            }
        }).catch((error) => {
            throw new Error(error);
        });
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
        ServiceManager.addLicense(this.state.licenseMissingComponents, this.state.licenseMissingLibraries).then((responseNxt) => {
            if (responseNxt.data.responseType === 'Done') {
                this.setState(() => {
                    return {
                        displayDownload: 'block',
                        displayFormLicense: 'none',
                        displayLoader: 'none',
                        displayProgress: 'none',
                        header: 'Download License Here',
                        stepIndex: 3,
                    };
                });
            } else {
                console.log("error while adding license license");
            }
        }).catch((error) => {
            throw new Error(error);
        });
    }

    handleOpenConfirm() {
        this.setState(() => {
            return {
                confirmLicense: true,
            };
        });
    }

    handleCloseConfirm() {
        this.setState(() => {
            return {
                confirmLicense: false,
            };
        });
    }

    /**
     * handle open error message
     */
    handleOpenError() {
        this.setState(() => {
            return {
                openError: true,
            };
        });
    }

    /**
     * handle close
     */
    handleCloseError() {
        this.setState(() => {
            return {
                openError: false,
            };
        });
    }

    /**
     * handle Next
     */
    handleNext() {
        let stepIndexNo = this.state.stepIndex;
        stepIndexNo += 1;
        this.setState(() => {
            return {
                stepIndex: stepIndexNo,
            };
        });
    }

    /**
     * handle Prev
     */
    handlePrev() {
        let stepIndexNo = this.state.stepIndex;
        stepIndexNo -= 1;
        if (stepIndexNo > 0) {
            this.setState(() => {
                return {
                    stepIndex:stepIndexNo,
                };
            });
        }
    }

    /**
     * reload page
     */
    reloadPage() {
        window.location.reload();
    }

    /**
     * reload page
     */
    backToMain() {
        hashHistory.push('/');
    }

    /**
     * handleComponentSelect
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
                    licenseId: m,
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
     * handleLibrarySelect
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
                    licenseId: m,
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

    /**
     * @class WaitingRequests
     * @extends {Component}
     * @description Sample React component
     */
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
                onClick={this.handleCloseConfirm}
            />
        ];
        const actionsError = [
            <Link to={'/app/managePacks'}>
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
                    value={licenseList[i].LICENSE_ID}
                    key={licenseList[i].LICENSE_ID}
                    primaryText={licenseList[i].LICENSE_KEY}
                />
            );
        }
        if (this.state.licenseMissingComponents.length > 0) {
            /* eslint-disable */
            let i = 0;
            const jars = this.state.licenseMissingComponents;
            let index = -1;
            for (i = 0; i < jars.length; i++) {
                index = index + 1;
                component.push(
                    <TableRow key={i}>
                        <TableRowColumn key={k}>{jars[i].name}</TableRowColumn>
                        <TableRowColumn key={k + 1}>{jars[i].version}</TableRowColumn>
                        <TableRowColumn key={k + 2}>{jars[i].type}</TableRowColumn>
                        <TableRowColumn key={k + 3}>
                            <SelectField
                                value={this.state.licenseMissingComponents[i].licenseId}
                                onChange={this.handleComponentSelect.bind(this, i)}
                                maxHeight={200}
                                floatingLabelText="Select license"
                            >
                                {license}
                            </SelectField>
                        </TableRowColumn>
                    </TableRow>
                );
                k = k + 3;
            }
            displayComponent = 'block';
            /* eslint-enable */
        } else {
            displayComponent = 'none';
        }
        if (this.state.licenseMissingLibraries.length > 0) {
            /* eslint-disable */
            let i = 0;
            const jars = this.state.licenseMissingLibraries;
            for (i = 0; i < jars.length; i++) {
                library.push(
                    <TableRow key={i}>
                        <TableRowColumn key={k}>{jars[i].name}</TableRowColumn>
                        <TableRowColumn key={k + 1}>{jars[i].version}</TableRowColumn>
                        <TableRowColumn key={k + 2}>{jars[i].type}</TableRowColumn>
                        <TableRowColumn key={k + 3}>
                            <SelectField
                                value={this.state.licenseMissingLibraries[i].licenseId}
                                onChange={this.handleLibrarySelect.bind(this, i)}
                                maxHeight={200}
                                floatingLabelText="Select license"
                            >
                                {license}
                            </SelectField>
                        </TableRowColumn>
                    </TableRow>
                );
                k = k + 3;
            }
            displayLibrary = 'block';
            /* eslint-enable */
        } else {
            displayLibrary = 'none';
        }
        return (
            <div className="container-fluid">
                <h2 className="text-center">{this.state.header}</h2>
                <br/>
                <Stepper activeStep={this.state.stepIndex}>
                    <Step>
                        <StepLabel>Upload Pack</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Check JAR Names</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Check Missing License</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Download License</StepLabel>
                    </Step>
                </Stepper>
                {/* eslint-disable max-len */}
                <form onSubmit={this.handleOpenConfirm} style={{display: this.state.displayFormLicense}}>
                    <div style={{display: displayComponent}}>
                        <Subheader style={styles.subHeader}>Components</Subheader>
                        <Table>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow key={0}>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>Version</TableHeaderColumn>
                                    <TableHeaderColumn>File Name</TableHeaderColumn>
                                    <TableHeaderColumn>Select License</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false} ref={(c) => {
                                this.com = c;
                            }}>
                                {component}
                            </TableBody>
                        </Table>
                    </div>
                    <br/>
                    <div style={{display: displayLibrary}}>
                        <Subheader style={styles.subHeader}>Libraries</Subheader>
                        <Table>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow key={0}>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>Version</TableHeaderColumn>
                                    <TableHeaderColumn>File Name</TableHeaderColumn>
                                    <TableHeaderColumn>Select License</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {library}
                            </TableBody>
                        </Table>
                    </div>
                    <br/>
                    <RaisedButton
                        type="submit"
                        label="Accept and Save"
                        style={styles.saveButtonStyle}
                        labelColor='#ffffff'
                        backgroundColor='#2196F3'
                        disabled={this.state.buttonState}
                    />
                </form>

                <div className="container-fluid" style={{display: this.state.displayLoader}}>
                    <br/><br/><br/>
                    <div className="row">
                        <div className="col-lg-5"/>
                        <div className="col-lg-4">
                            <CircularProgress color="#f47c24" size={100} thickness={7}/>
                            <div className="12" style={{
                                float: 'left',
                                padding: '20px',
                                color: '#d62c1a',
                                marginBottom: '15px'
                            }}>
                                <strong>Status: </strong>{this.state.statusMessage}

                            </div>
                        </div>
                        <div className="col-lg-3"/>
                    </div>
                </div>
                <Dialog
                    title="Error"
                    actions={actionsError}
                    modal={false}
                    open={this.state.openError}
                    onRequestClose={this.goBackToRequest}
                >
                    {this.state.errorMessage}
                </Dialog>

                <div className="container-fluid" style={{display: this.state.displayProgress}}>
                    <br/><br/><br/>
                    <div className="row">
                        <div className="col-lg-5"/>
                        <div className="col-lg-4">
                            <CircularProgress color="#f47c24" size={100} thickness={7}/>
                        </div>
                        <div className="col-lg-3"/>
                    </div>
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

export default AddLicense;
