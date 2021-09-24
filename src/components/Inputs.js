import { ListInput } from "framework7-react";
import classes from './Inputs.module.css'

const CustomInput = props => {
    return (
        <div className={classes.Container} style={props.style}>
            <ListInput
                {...props}
                outline
                floatingLabel
                clearButton
                ></ListInput>
            {props.unit ? <span className={classes.UnitLabel}>{props.unit}</span> : null}
        </div>
    );
}

export default CustomInput;