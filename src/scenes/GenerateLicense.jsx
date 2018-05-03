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
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import {red500} from 'material-ui/styles/colors';
import ServiceManager from '../services/msf4j/ServiceManager';
import styles from '../styles';
import textFile from '../assets/images/txt-file.png';

/**
 * @class NameErrorJarsLicense
 * @extends {Component}
 * @description Get user details
 */
class GenerateLicense extends Component {
    /**
     * @class NameErrorJarsLicense
     * @extends {Component}
     * @param {any} props props for constructor
     * @description Sample React component
     */
    constructor(props) {
        super(props);
        this.state = {
            userEmail: props.location.query.userEmail,//eslint-disable-line
            openError: false,
            errorIcon: '',
            displayProgress: 'block',
            displayStatus: 'none',
            displayForm: 'none',
            displayLoader: 'none',
            displayDownload: 'none',
            displayErrorBox: 'none',
            buttonState: false,
            header: 'Download the license text',
            stepIndex: 1,
            errorMessage: '',
            statusMessage: ''
        };
        this.handleAddLicense = this.handleAddLicense.bind(this);
        this.handleOpenError = this.handleOpenError.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.generateLicense = this.generateLicense.bind(this);
        this.backToMain = this.backToMain.bind(this);
    }

    /**
     * @class NameErrorJarsLicense
     * @extends {Component}
     * @description componentWillMount
     */
    componentWillMount() {
        ServiceManager.addLicense(this.state.licenseMissingComponents, this.state.licenseMissingLibraries).then((responseNxt) => {
            if (responseNxt.data.responseType === 'Done') {
                this.setState(() => {
                    return {
                        displayDownload: 'block',
                        displayProgress: 'none',
                        stepIndex: 3,
                    };
                });
            } else {
                console.log("error while adding licenses");
            }
        }).catch((error) => {
            throw new Error(error);
        });

    }

    /**
     * @param {any} e event
     * go back to request
     */
    generateLicense(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState(() => {
            return {
                displayForm: 'none',
                displayDownload: 'none',
                displayLoader: 'block',
            };
        });
        ServiceManager.getLicense().then((response) => {
            ServiceManager.dowloadLicense().then((responseFile) => {
                const url = window.URL.createObjectURL(new Blob([responseFile.data]));
                const link = document.createElement('a');
                const fileNameLength = this.state.packName.length;
                const fileName = 'License(' + this.state.packName.substring(0, fileNameLength - 4) + ').TXT';
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                this.setState(() => {
                    return {
                        displayForm: 'none',
                        displayDownload: 'block',
                        displayLoader: 'none',
                    };
                });
            }).catch((error) => {
                throw new Error(error);
            });
        }).catch((error) => {
            throw new Error(error);
        });
        /* eslint-enable */
        this.backToMain();

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
     * @class WaitingRequests
     * @extends {Component}
     * @description Sample React component
     */
    render() {
        const actionsError = [
            <Link to={'/app/managePacks'}>
                <FlatButton
                    label="Back"
                    primary={true}
                />
            </Link>,

        ];
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
                <form onSubmit={this.generateLicense} style={{display: this.state.displayDownload}}>
                    <br/>
                    <br/>
                    <div style={styles.downloadArea}>
                        <img src={textFile} style={styles.textFile} alt=""/>
                        <br/>
                        <span>
                            <b>
                                {'License(' + this.state.packName.substring(0, this.state.packName.length - 4) + ').TXT'}
                            </b>
                        </span>
                    </div>
                    <br/>
                    <RaisedButton
                        type="submit"
                        label="Download"
                        style={styles.buttonStyle}
                        labelColor='#ffffff'
                        backgroundColor='#2196F3'
                        disabled={this.state.buttonState}
                    />
                    <RaisedButton
                        type="button"
                        label="Back to main"
                        onClick={this.backToMain}
                        style={styles.buttonStyle}
                        labelColor='#ffffff'
                        backgroundColor='#BDBDBD'
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

            </div>

        );
    }
}

export default GenerateLicense;
