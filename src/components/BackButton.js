import { Link, Block } from 'framework7-react';
import classes from './Globals.module.css';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = props => (
    <Block style={{textAlign: "center"}}>
        <Link tooltip="Volver" href={props.to} className={classes.BackButton} style={{color:"black", backgroundColor:props.gray?"rgba(200,200,200,.8)":"rgba(50,50,200,.8)"}}>
            <FaArrowLeft />
        </Link>
    </Block>   
); 

export default BackButton;