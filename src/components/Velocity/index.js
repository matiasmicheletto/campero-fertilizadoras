import { Page, Navbar, Block, List, Row, Col } from "framework7-react";
import CustomInput from "../Inputs";
import DistanceIcon from "../../img/icons/distancia.png"
import classes from './Velocity.module.css';
import moment from 'moment';
import Timer from './Timer';
import Toast from "../Toast";
import { useState } from "react";

const timer = new Timer;

const Velocity = props => {
    const [time, setTime] = useState(0);     
    
    const [running, setRunning] = useState(0);

    const [distance, setDistance] = useState(50);

    const [data, setData] = useState([]);
    
    const toggleRunning = () => {
        if(!running){
            timer.clear();
            timer.callback = c => {setTime(c)};            
            timer.start();            
        }else{
            timer.stop();
            timer.callback = ()=>{};            
        }
        setRunning(!running);
    };

    const getTime = () => {
        // unix to min:seg:ms
        return moment(time).format('mm:ss:S');
    };    

    const updateDistance = d => {
        if(d > 0){
            setDistance(d);
            setData(data.map(v => ({
                time: v.time, 
                vel: d/v.time*3600
            })));
        }else
            Toast("error", "Ingrese un valor de distancia mayor que 0 m", 2000, "center");
    }

    const pushData = () => {
        const temp = [...data];
        temp.push({
            time: time,
            vel: distance/time*3600
        });        
        setData(temp);
    };

    return (
        <Page>
            <Navbar title="Cronómetro" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Block>
                <img src={DistanceIcon} className={classes.Icon} alt="distance" />
                <List form noHairlinesMd className={classes.Form}>
                    <Row slot="list">
                        <Col width={20}></Col>
                        <Col width={60}>
                            <CustomInput
                                value={distance || ''}
                                label="Dist. recorrida"
                                type="number"
                                unit="m"
                                onChange={v=>updateDistance(parseInt(v.target.value))}
                            ></CustomInput>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                </List>
            </Block>
            <Block style={{marginTop:"60px", textAlign:"center"}}>
                <div>
                    <p style={{fontSize:"50px"}}>{getTime()}</p>
                    <input type='button' onClick={toggleRunning} value={running ? "Detener":"Iniciar"}/>
                </div>
            </Block>
            <Block style={{textAlign:"center"}}>
                <input type='button' onClick={pushData} value="Agregar"/>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tiempo</th>
                            <th>velocidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((d, idx) => (
                                <tr key={idx}>
                                    <td>{idx+1}</td>
                                    <td>{d.time/1000} seg.</td>
                                    <td>{d.vel.toFixed(2)} Km/h</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </Block>
            <Block style={{textAlign:"center"}}>
                <p>Exportar</p>    
            </Block>
        </Page>
    );
};

export default Velocity;