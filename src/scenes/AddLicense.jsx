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
import StepComponent from "../components/StepComponent";
import ProgressComponent from "../components/ProgressComponent";
import HeaderComponent from "../components/HeaderComponent";

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
            buttonState: false,
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
        this.reloadPage = this.reloadPage.bind(this);
        this.backToMain = this.backToMain.bind(this);
        this.redirectToNext = this.redirectToNext.bind(this);
        this.handleError = this.handleError.bind(this);
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

    handleError(message){
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
            pathname: '/app/licenseGenerator',
            state: {
                packName: this.state.packName,
            }
        });
    }

    /**
     * Reload the page.
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
            let i = 0;
            const jars = this.state.licenseMissingComponents;
            let index = -1;
            for (i = 0; i < jars.length; i++) {
                index = index + 1;
                component.push(
                    <TableRow key={i}>
                        <TableRowColumn style={{fontSize: '14px', overflowX: 'auto', width: '45%'}}
                                        key={k}>{jars[i].name}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', overflowX: 'auto', width: '20%'}}
                                        key={k + 1}>{jars[i].version}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', overflowX: 'auto', width: '15%'}}
                                        key={k + 2}>{jars[i].type}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '20%'}} key={k + 3}>
                            <SelectField
                                style={styles.selectField}
                                autoWidth={true}
                                value={this.state.licenseMissingComponents[i].licenseId}
                                onChange={this.handleComponentSelect.bind(this, i)}
                                maxHeight={200}
                                underlineStyle={{borderColor : '#00bcd461'}}

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
                library.push(
                    <TableRow key={i}>
                        <TableRowColumn style={{fontSize: '14px', overflowX: 'auto', width: '45%'}}
                                        key={k}>{jars[i].name}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', overflowX: 'auto', width: '20%'}}
                                        key={k + 1}>{jars[i].version}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', overflowX: 'auto', width: '15%'}}
                                        key={k + 2}>{jars[i].type}</TableRowColumn>
                        <TableRowColumn style={{fontSize: '14px', width: '20%'}} key={k + 3}>
                            <SelectField
                                style={styles.selectField}
                                value={this.state.licenseMissingLibraries[i].licenseId}
                                onChange={this.handleLibrarySelect.bind(this, i)}
                                maxHeight={200}
                                underlineStyle={{borderColor : '#00bcd461'}}
                            >
                                {license}
                            </SelectField>
                        </TableRowColumn>
                    </TableRow>
                );
                k = k + 3;
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
                                        width: '45%'
                                    }}>Name</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '20%'
                                    }}>Version</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '15%'
                                    }}>Type</TableHeaderColumn>
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
                                        width: '45%'
                                    }}>Name</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '20%'
                                    }}>Version</TableHeaderColumn>
                                    <TableHeaderColumn style={{
                                        fontSize: '20px',
                                        color: "#000000",
                                        width: '15%'
                                    }}>Type</TableHeaderColumn>
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
                    <RaisedButton
                        type="submit"
                        label="Accept and Save"
                        style={styles.saveButtonStyle}
                        primary={true}
                        disabled={this.state.buttonState}
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
