import { ListInput } from "framework7-react";
import classes from './CustomInput.module.css'

const CustomInput = props => {
    return (
        <div className={classes.Container}>
            <ListInput {...props} className={classes.Input}></ListInput>
            <span className={classes.UnitLabel}>{props.unit}</span>
        </div>
    );
}

export default CustomInput;