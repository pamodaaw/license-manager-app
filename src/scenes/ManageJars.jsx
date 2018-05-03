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
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import ServiceManager from '../services/msf4j/ServiceManager';
import styles from '../styles';

/**
 * @class NameErrorJarsLicense
 * @extends {Component}
 * @description Get user details
 */
class ManageJars extends Component {
    /**
     * @class NameErrorJarsLicense
     * @extends {Component}
     * @param {any} props props for constructor
     * @description Sample React component
     */
    constructor(props) {
        super(props);
        this.state = {
            packName: props.location.query.selectedPack,//eslint-disable-line

            userEmail: props.location.query.userEmail,//eslint-disable-line
            nameMissingJars: [],
            nameJars: [],
            open: false,
            openError: false,
            errorIcon: '',
            displayProgress: 'block',
            displayStatus: 'none',
            displayForm: 'none',
            displayLoader: 'none',
            displayErrorBox: 'none',
            buttonState: false,
            header: 'Please add Name and Version for following JARs',
            stepIndex: 1,
            errorMessage: '',
            statusMessage: ''
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpenError = this.handleOpenError.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.setName = this.setName.bind(this);
        this.setVersion = this.setVersion.bind(this);
        this.backToMain = this.backToMain.bind(this);
        this.redirectToNext = this.redirectToNext.bind(this);
    }

    /**
     * @class NameErrorJarsLicense
     * @extends {Component}
     * @description componentWillMount
     */
    componentWillMount() {

        ServiceManager.extractJars(this.state.packName).then((response) => {
            if (response.data.responseType === 'Done') {
                let intervalID = setInterval(function () {

                    ServiceManager.checkProgress().then((response) => {
                        if (response.data.responseStatus === "complete") {
                            if (response.data.responseData.length === 0) {
                                this.redirectToNext();
                            } else {
                                this.setState(() => {
                                    return {
                                        nameMissingJars: response.data.responseData,
                                        nameJars: response.data.responseData,
                                        displayProgress: 'none',
                                        displayStatus: 'none',
                                        displayForm: 'block',
                                    };
                                });
                            }
                            clearTimeout(intervalID);
                        } else if (response.data.responseStatus === "running") {
                            this.setState(() => {
                                return {
                                    statusMessage: response.data.responseMessage,
                                    displayStatus: 'block',

                                };
                            });
                        }
                    }).catch((error) => {
                        throw new Error(error);
                    });

                }.bind(this), 5000);

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

    }

    redirectToNext() {

        // this.state.redirectTo = true;
        // this.props.history.push('/apps/licenseAdder');

        this.props.router.push({
            pathname: '/apps/licenseAdder',
            state: {
                userEmail: this.state.username,
                nameMissingJars: this.state.nameJars
            }
        });
    }

    /**
     * @param {any} e event
     * go back to request
     */
    setVersion(e) {
        // const id = parseInt(e.target.name, 10);
        const versionValue = e.target.value;
        const nameJarsList = this.state.nameJars.map((jar, i) => {
            const jarFile = {
                index: i,
                name: jar.name,
                version: versionValue,
            };
            return (jarFile);
        });
        this.setState(() => {
            return {
                nameJars: nameJarsList,
            };
        });
    }

    /**
     * @param {any} e event
     * go back to request
     */
    setName(e) {
        const nameValue = e.target.value;
        const nameJarsList = this.state.nameJars.map((jar, i) => {
            const jarFile = {
                index: i,
                name: nameValue,
                version: jar.version,
            };
            return (jarFile);
        });
        this.setState(() => {
            return {
                nameJars: nameJarsList,
            };
        });
    }


    /**
     * handle open
     * @param {any} e event
     */
    handleOpen(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState(() => {
            return {
                open: true,
            };
        });
    }

    /**
     * handle close
     */
    handleClose() {
        this.setState(() => {
            return {
                open: false,
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
                    stepIndex: stepIndexNo,
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
     * @class Managejars
     * @extends {Component}
     * @description Sample React component
     */
    render() {
        /* eslint-disable */
        const actions = [
            <FlatButton
                label="No"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onClick={this.redirectToNext}
            />,
        ];
        const actionsError = [
            <Link to={'/app/managePacks'}>
                <FlatButton
                    label="Back"
                    primary={true}
                />
            </Link>,

        ];
        const table = [];
        let k = 0;

        if (this.state.nameMissingJars.length > 0) {
            const jars = this.state.nameMissingJars;
            for (i = 0; i < jars.length; i++) {
                table.push(
                    <TableRow key={i}>
                        <TableRowColumn key={k}>{jars[i].name}</TableRowColumn>
                        <TableRowColumn key={k + 1}>
                            <TextField
                                name={jars[i].name.toString()}
                                onChange={this.setName}
                                hintText='Enter name'
                            />
                        </TableRowColumn>
                        <TableRowColumn key={k + 2}>
                            <TextField
                                onChange={this.setVersion}
                                hintText='Enter version'
                            />
                        </TableRowColumn>
                    </TableRow>
                );
                k = k + 4;
            }
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
                <form onSubmit={this.handleOpen} style={{display: this.state.displayForm}}>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow key={0}>
                                <TableHeaderColumn>JAR</TableHeaderColumn>
                                <TableHeaderColumn>Input Name</TableHeaderColumn>
                                <TableHeaderColumn>Input Version</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
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
                            labelColor='#ffffff'
                            backgroundColor='#BDBDBD'
                        />
                        <RaisedButton
                            type="submit"
                            label="Save"
                            style={styles.saveButtonStyle}
                            labelColor='#ffffff'
                            backgroundColor='#2196F3'
                            disabled={this.state.buttonState}
                        />
                    </div>
                </form>
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
                    title="Error"
                    actions={actionsError}
                    modal={false}
                    open={this.state.openError}
                    onRequestClose={this.goBackToRequest}
                >
                    {this.state.errorMessage}
                </Dialog>


                <Dialog
                    title="Confirm"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    Are you sure to save this data ?
                </Dialog>
            </div>

        );
    }
}

export default ManageJars;
