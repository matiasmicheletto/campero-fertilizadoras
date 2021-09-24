import { Link, Block } from 'framework7-react';
import { FaArrowLeft, FaStopwatch } from 'react-icons/fa';
import classes from './Buttons.module.css';

const BackButton = ({gray, f7router}) => (
    <Block className={classes.Container}>
        <Link tooltip="Volver" 
            onClick={() => f7router.back()}
            className={classes.RoundButton} 
            style={gray?{color:"black", backgroundColor:"rgba(200,200,200,.8)"}:{}}
        >
            <FaArrowLeft />
        </Link>
    </Block>   
); 

const CalculatorButton = () => (
    <Block style={{textAlign: "center", margin:"0px", padding:"0px"}}>
        <Link tooltip="Medir" href="/velocity/" className={classes.RoundButton}>
            <FaStopwatch size={20}/>
        </Link>
    </Block>   
);

export { BackButton, CalculatorButton };