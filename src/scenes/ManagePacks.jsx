import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import ServiceManager from '../services/msf4j/ServiceManager';
import styles from '../styles';

/**
 * @class WaitingRequests
 * @extends {Component}
 * @description Get user details
 */
class ManagePacks extends React.Component {
    /**
     * @class ManagePacks
     * @extends {Component}
     * @param {any} props props for constructor
     * @description Sample React component
     */
    constructor(props) {
        super(props);
        this.state = {
            listOfPacks: [],
            selectedPack: 'none',
            openError: false,
            errorMessage: "",
            errorIcon: '',
            displayProgress: 'block',
            displayBox: 'block',
            displayForm: 'none',
            displayLoader: 'none',
            displayErrorBox: 'none',
            buttonState: false,
        };
        this.selectPack = this.selectPack.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.handleOpenError = this.handleOpenError.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
    }

    /**
     * componentWillMount
     */
    componentWillMount() {
        ServiceManager.getUploadedPacks().then((response) => {
            this.setState(() => {
                return {
                    listOfPacks: response.data.responseData,
                    displayForm: 'block',

                };
            });
        }).catch((error) => {
            this.setState(() => {
                return {
                    errorMessage: 'Server Error',
                };
            });
            this.handleOpenError();
            // throw new Error(error);
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
     * handle open error message
     */
    handleCloseError() {
        this.setState(() => {
            return {
                openError: false,
            };
        });
    }

    backToMain() {
        hashHistory.push('/');
    }

    /**
     * handle the pack selection
     */
    selectPack(e) {
        this.setState({
            selectedPack: e.currentTarget.value,
            buttonState: true,
        });
    }

    /**
     * reload page
     */
    reloadPage() {
        window.location.reload();
    }

    /**
     * @class WaitingRequests
     * @extends {Component}
     * @description Sample React component
     */
    render() {
        const actionsError = [
            <Link to={'/app/'}>
                <FlatButton
                    label="Back"
                    primary={true}
                />
            </Link>,

        ];

        const packs = this.state.listOfPacks;
        const listOfPackNames = packs.map((pack) =>
            <div className="radio">
                <label>
                    <input type="radio" value={pack.name}
                           checked={this.state.selectedPack === pack.name}
                           onChange={this.selectPack}
                    />
                    {pack.name}
                </label>
            </div>);
        const path = this.state.buttonState ? '/app/manageJars' : '/app/managePacks';
        return (

            <div className="container-fluid col-md-10">

                <h2>Select a Pack to Generate Licence</h2>
                <br/>
                <div className="col-md-8" style={{
                    float: 'left',
                    backgroundColor: '#f8cdc1',
                    padding: '20px',
                    color: '#d62c1a',
                    marginBottom: '15px'
                }}>
                    <strong>Note: </strong> Please upload your pack to the given location.

                </div>

                <div className="col-md-8" style={{display: this.state.displayBox}}>


                    <form style={{display: this.state.displayForm}}>
                        {listOfPackNames}

                        <Link
                            to={{
                                pathname: path,
                                query: {selectedPack: this.state.selectedPack}
                            }}
                        >
                            <RaisedButton
                                type="submit"
                                label="Generate"
                                style={styles.generateButtonStyle}
                                labelColor='#ffffff'
                                backgroundColor='#2196F3'
                                disabled={!this.state.buttonState}
                            />
                        </Link>

                    </form>
                    <Dialog
                        title="Error"
                        actions={actionsError}
                        modal={false}
                        open={this.state.openError}
                        onRequestClose={this.backToMain}
                    >
                        {this.state.errorMessage}
                    </Dialog>

                </div>

            </div>
        );
    }
}

export default ManagePacks;
