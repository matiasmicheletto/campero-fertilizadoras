import { Link, Block } from 'framework7-react';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import classes from './Buttons.module.css';

const BackButton = props => (
    <Block className={classes.Container}>
        <Link tooltip="Volver" 
            href={props.to} 
            className={classes.RoundButton} 
            style={props.gray?{color:"black", backgroundColor:"rgba(200,200,200,.8)"}:{}}
        >
            <FaArrowLeft />
        </Link>
    </Block>   
); 

const CalculatorButton = () => (
    <Block style={{textAlign: "center", margin:"0px", padding:"0px"}}>
        <Link tooltip="Calcular" className={classes.RoundButton} >
            <FaCalculator />
        </Link>
    </Block>   
);

export { BackButton, CalculatorButton };