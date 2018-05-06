import React, {Component} from 'react';
import { Step, StepLabel, Stepper} from "material-ui";

export default class StepComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stepNumber: props.step
        };
    }

    render() {
        return (
            <div className="col-sm-12">
                <Stepper activeStep={this.state.stepNumber}>
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
            </div>
        );
    }
}
