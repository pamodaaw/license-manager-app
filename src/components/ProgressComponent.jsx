import React, {Component} from 'react';
import {CircularProgress} from "material-ui";

export default class ProgressComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
                <div className="row">
                    <div className="col-lg-5"/>
                    <div className="col-lg-4">
                        <CircularProgress color="#00bcd4" size={100} thickness={7}/>
                    </div>
                    <div className="col-lg-3"/>
                </div>
        );
    }
}
