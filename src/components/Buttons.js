import { Link, Block } from 'framework7-react';
import { FaArrowLeft, FaPlus, FaStopwatch, FaTrash } from 'react-icons/fa';
import classes from './Buttons.module.css';

const BackButton = props => (
    <Block className={classes.Container}>
        <Link tooltip="Volver" 
            onClick={() => props.f7router.back()}
            className={classes.RoundButton} 
            style={props.gray?{color:"black", backgroundColor:"rgba(200,200,200,.8)"}:{}}
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

const DeleteButton = props => (
    <div style={{textAlign:"right", padding:"5px", height:"5px"}}>
        <Link
            tooltip="Quitar" 
            onClick={props.onClick}>
            <FaTrash size={15} color={"darkred"}/>
        </Link>   
    </div>
);

const AddButton = props => (
    <Block style={{textAlign: "right", margin:"0px", padding:"0px"}}>
        <Link 
            tooltip="Agregar producto" 
            onClick={props.onClick}
            className={classes.RoundButton}
            style={{backgroundColor:"green", margin:"0px 0px 20px 0px"}}
        >
            <FaPlus size={20}/>
        </Link>
    </Block>   
);

export { BackButton, CalculatorButton, DeleteButton, AddButton };