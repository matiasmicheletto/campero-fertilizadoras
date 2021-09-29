import { Page, Navbar, Block, List, Row, Col, Button } from "framework7-react";
import CustomInput from "../Inputs";
import DistanceIcon from "../../img/icons/distancia.png"
import classes from './Velocity.module.css';
import moment from 'moment';
import Timer from './Timer';
import Toast from "../Toast";
import { useContext, useState } from "react";
import { FaPlay, FaStop, FaPlus, FaMinus } from 'react-icons/fa';
import { ModelCtx } from "../../Context";

const timer = new Timer();

const InputBlock = props => ( // Input de distancia
    <List form noHairlinesMd className={classes.Form}>
        <Row slot="list">
            <Col width={20}></Col>
            <Col width={60}>
                <CustomInput
                    value={props.distance || ''}
                    label="Dist. recorrida"
                    type="number"
                    unit="m"
                    onChange={props.onChange}
                ></CustomInput>
            </Col>
            <Col width={20}></Col>
        </Row>
    </List>
);

const PlayButton = props => ( // Boton de control del cronometro
    <Button style={{minHeight:50}} onClick={props.onClick}>
        {
            props.running ? 
                <FaStop color="red" size={40}/>
            :
                <FaPlay color="green" size={40}/>
        }
    </Button>
);

const DataTable = props => ( // Tabla de resultados parciales
    <table className={`data-table ${classes.Table}`}>
        <thead>
            <tr>
                <th>#</th>
                <th>Tiempo</th>
                <th>velocidad</th>
            </tr>
        </thead>
        <tbody>
            {
                props.data.map((d, idx) => (
                    <tr key={idx}>
                        <td>{idx+1}</td>
                        <td>{d.time/1000} seg.</td>
                        <td>{d.vel.toFixed(2)} Km/h</td>
                    </tr>
                ))
            }
        </tbody>
    </table>
);

const OutputBlock = props => ( // Bloque con resultado final a exportar
    <List form noHairlinesMd style={{marginTop:"0px"}}>
        <Row slot="list">
            <Col width={10}></Col>
            <Col width={80}>
                <CustomInput
                    readOnly
                    value={props.output}
                    label="Vel. promedio"
                    type="number"
                    unit="Km/h"
                    clearButton={false}
                ></CustomInput>
            </Col>
            <Col width={10}></Col>
        </Row>
    </List>
);


const Velocity = ({f7router}) => { // View
    
    const model = useContext(ModelCtx);

    const [time, setTime] = useState(0);     
    
    const [running, setRunning] = useState(0);

    const [distance, setDistance] = useState(50);

    const [data, setData] = useState([]);

    const [pushEnabled, setPushEnabled] = useState(false);
    
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
        setPushEnabled(running);
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
    };

    const pushData = () => { // Agregar dato medido
        if(data.length < 3 && time > 0){
            const temp = [...data];
            temp.push({
                time: time,
                vel: distance/time*3600
            });        
            setData(temp);
            setPushEnabled(false);
        }
    };

    const popData = () => { // Quitar último dato medido
        if(data.length > 0){
            const temp = [...data];
            temp.pop();
            setData(temp);
            setPushEnabled(true);
        }
    };

    const dataAvg = () => data.length > 0 ? data.reduce((r, a) => a.vel + r, 0)/data.length : 0;

    const exportData = () => {           
        model.work_velocity = dataAvg();
        f7router.back();
    }

    return (
        <Page>
            <Navbar title="Cronómetro" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Block>
                <img src={DistanceIcon} className={classes.Icon} alt="distance" />
                <InputBlock onChange={v=>updateDistance(parseInt(v.target.value))} distance={distance}/>
            </Block>
            <Block style={{marginTop:"60px", textAlign:"center"}}>
                <p style={{fontSize:"50px", margin:"0px"}}>{getTime()}</p>
                <PlayButton onClick={toggleRunning} running={running} />
            </Block>
            <Block style={{marginBottom: "0px",textAlign:"center"}}>
                <Row style={{alignItems:"center"}}>
                    <Col width={20}>
                        <Row>
                            <Button disabled={!pushEnabled} onClick={pushData}>
                                <FaPlus  color="green" size={30}/>
                            </Button>
                        </Row>
                        <Row>
                            <Button disabled={running || data.length===0} onClick={popData}>
                                <FaMinus color="red" size={30}/>
                            </Button>
                        </Row>
                    </Col>
                    <Col width={80}>
                        <DataTable data={data} />
                    </Col>
                </Row>
            </Block>
            <Block style={{marginTop:"0px",textAlign:"center"}}>
                <OutputBlock output={dataAvg().toFixed(2)}/>
            </Block>
            <Block style={{textAlign:"center"}}>
                <Row>
                    <Col width={20}></Col>
                    <Col width={60}><Button disabled={data.length===0} fill onClick={exportData}>Exportar</Button></Col>
                    <Col width={20}></Col>
                </Row>
            </Block>
        </Page>
    );
};

export default Velocity;