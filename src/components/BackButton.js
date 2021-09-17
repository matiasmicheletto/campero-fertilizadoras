import { Link, Block } from 'framework7-react';
import classes from './Globals.module.css';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = props => (
    <Block style={{textAlign: "center"}}>
        <Link tooltip="Volver" 
            href={props.to} 
            className={classes.BackButton} 
            style={props.gray?{color:"black", backgroundColor:"rgba(200,200,200,.8)"}:{}}
        >
            <FaArrowLeft />
        </Link>
    </Block>   
); 

export default BackButton;