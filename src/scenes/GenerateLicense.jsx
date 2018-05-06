import React, {Component} from 'react';
import {Link, hashHistory, withRouter} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ServiceManager from '../services/msf4j/ServiceManager';
import styles from '../styles';
import textFile from '../assets/images/txt-file.png';
import StepComponent from "../components/StepComponent";
import HeaderComponent from "../components/HeaderComponent";

/**
 * @class GenerateLicense
 * @extends {Component}
 * @description Generates the licenses text and provide to download.
 */
class GenerateLicense extends Component {

    constructor(props) {
        super(props);
        this.state = {
            packName: this.props.location.state.packName,
            openError: false,
            displayStatus: 'none',
            displayForm: 'none',
            displayLoader: 'none',
            displayDownload: 'block',
            displayErrorBox: 'none',
            buttonState: false,
            header: 'Download the license text',
            stepIndex: 3,
            errorMessage: '',
        };
        this.handleOpenError = this.handleOpenError.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.generateLicense = this.generateLicense.bind(this);
        this.backToMain = this.backToMain.bind(this);
    }

    componentWillMount() {
    }

    /**
     * Sends the API call to generate the licenses text.
     * @param e button click event
     */
    generateLicense(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState(() => {
            return {
                displayForm: 'none',
                displayDownload: 'none',
            };
        });
        ServiceManager.getLicense().then(() => {
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
        this.backToMain();

    }

    /**
     * Handle open error message.
     */
    handleOpenError() {
        this.setState(() => {
            return {
                openError: true,
            };
        });
    }

    /**
     * Handle close error message.
     */
    handleCloseError() {
        this.setState(() => {
            return {
                openError: false,
            };
        });
    }

    /**
     * Reloads the page.
     */
    reloadPage() {
        window.location.reload();
    }

    /**
     * Redirects to the main page.
     */
    backToMain() {
        hashHistory.push('/');
    }

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
            <div className="container">
                <HeaderComponent header={this.state.header}/>
                <StepComponent
                    step={this.state.stepIndex}
                />
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
                        primary={true}
                        disabled={this.state.buttonState}
                    />
                    <RaisedButton
                        type="button"
                        label="Back to main"
                        onClick={this.backToMain}
                        style={styles.buttonStyle}
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

            </div>

        );
    }
}
GenerateLicense = withRouter(GenerateLicense);
export default GenerateLicense;
