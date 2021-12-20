import { f7, Block, BlockTitle, Row, Col, List, Button } from 'framework7-react';
import { useContext, useEffect, useState } from 'react';
import CustomInput from '../Inputs';
import { CalculatorButton } from '../Buttons';
import MethodSelector from './MethodSelector';
import ResultsDose from './ResultsDose';
import Toast from '../Toast';
import { ModelCtx } from '../../Context';
import iconDose from '../../img/icons/kg_ha_fert.png';
import iconGear from '../../img/icons/cambio.png';
import iconDistance from '../../img/icons/dist_muestreo.png';
import iconWorkWidth from '../../img/icons/ancho_labor.png';
import iconVelocity from '../../img/icons/velocidad.png';
import iconTime from '../../img/icons/tiempo.png';
import iconCollected from '../../img/icons/peso_recolectado.png';
import api from '../../Api';
import { error_messages } from '../../Utils';

const SectionDosif = props => {

    const model = useContext(ModelCtx);
    
    // Campos del formulario
    const [method, setMethod] = useState(model.method || 'direct');
    const [expected_dose, setExpectedDose] = useState(model.expected_dose || '');
    const [gear, setGear] = useState(model.gear || '');    
    const [distance, setDistance] = useState(model.distance || '');
    let [time, setTime] = useState(model.time || '');
    let [work_velocity, setWorkVelocity] = useState(model.work_velocity || '');
    let [recolected, setRecolected] = useState(model.recolected || '');
    
    // Resultados
    const [outputs, setOutputs] = useState({
        show: false,
        dose: '',
        diffkg: '',
        diffp: ''
    });

    useEffect(() => {
        setOutputs(outputs => {return{...outputs, show: false}});
    }, [props.work_width]);

    // Para que actualice datos al volver de las vistas de cronometro
    work_velocity = model.work_velocity;
    recolected = model.recolected;
    time = model.time;

    const updateValue = (name, value) => {
        let f = parseFloat(value);
        if(isNaN(f) || f < 0)
            f = '';
        switch(name){
            case 'method':
                setMethod(value);
                break;
            case 'expected_dose':
                setExpectedDose(f);
                break;
            case 'gear':
                setGear(value);
                break;
            case 'work_width':
                props.setWorkWidth(f);
                break;
            case 'distance':
                setDistance(f);
                break;
            case 'time':
                setTime(f);
                break;
            case 'work_velocity':
                setWorkVelocity(f);
                break;
            case 'recolected':
                setRecolected(f);
                break;
            default:
                break;
        }
        model.update(name, name === 'method' || name === 'gear' ? value : f);
        setOutputs({...outputs, show: false});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateValue(name, value);  
    };

    const handleInputClear = (e) => {
        const { name } = e.target;
        updateValue(name, '');
    };

    const clearForm = () => {  
        setMethod('direct');
        setExpectedDose('');
        setGear('');
        props.setWorkWidth('');
        setDistance('');
        setTime('');
        setWorkVelocity('');
        setRecolected('');
        setOutputs({...outputs, show: false});
        model.clear(["method", "expected_dose","effective_dose", "gear", "work_width", "distance", "time", "work_velocity", "recolected"]);
    };

    const submit = () => {        
        const params = {
            work_width:props.work_width,
            method,
            expected_dose,
            distance,
            time,
            work_velocity,
            recolected
        };        
        const res = api.computeDose(params);
        if(res.status === "error"){
            Toast("error", error_messages[res.wrong_keys[0]], 2000, "center");
            console.log(res);
        }else{
            setOutputs({...res, show: true});
            model.update({
                effective_dose: res.dose, 
                initial_work_width: props.work_width
            });
        }
    };

    const addResultsToReport = () => {
        model.addDoseToReport(outputs);
        f7.panel.open();
    };

    return (
        <div>
            <MethodSelector value={method} onChange={handleInputChange} />
            <Block style={{marginBottom:"0px"}}>
                <BlockTitle>Dosis</BlockTitle>
                <List form noHairlinesMd style={{marginBottom:"10px"}}>
                    <CustomInput                    
                        slot="list"
                        name="expected_dose"
                        icon={iconDose}
                        label="Dosis prevista"
                        type="number"                
                        unit="kg/ha"
                        value={expected_dose}
                        onInputClear={handleInputClear}
                        onChange={handleInputChange}
                        ></CustomInput>
                    <CustomInput
                        slot="list"
                        name="gear"
                        icon={iconGear}
                        label="Cambio"
                        type="text"
                        value={gear}
                        onInputClear={handleInputClear}
                        onChange={handleInputChange}
                        ></CustomInput>
                    <CustomInput                    
                        slot="list"
                        name="work_width"
                        icon={iconWorkWidth}
                        label="Ancho de labor"
                        type="number"
                        unit="m"
                        value={props.work_width}
                        onInputClear={handleInputClear}
                        onChange={handleInputChange}
                        ></CustomInput>
                    {method==="direct" ?
                        <CustomInput                        
                            slot="list"
                            name="distance"
                            icon={iconDistance}
                            label="Distancia"
                            type="number"
                            unit="m"
                            value={distance}
                            onInputClear={handleInputClear}
                            onChange={handleInputChange}
                            ></CustomInput>
                        :
                        <div slot="list">
                            <CustomInput                            
                                label="Tiempo"
                                name="time"
                                icon={iconTime}
                                type="number"
                                unit="seg"
                                value={time}
                                onInputClear={handleInputClear}
                                onChange={handleInputChange}
                                ></CustomInput>
                            <Row>
                                <Col width="80">
                                    <CustomInput                                                                                          
                                        label="Velocidad"
                                        name="work_velocity"
                                        icon={iconVelocity}
                                        type="number"
                                        unit="Km/h"
                                        value={work_velocity}
                                        onInputClear={handleInputClear}
                                        onChange={handleInputChange}
                                        ></CustomInput>
                                </Col>
                                <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
                                    <CalculatorButton href="/velocity/" tooltip="Medir velocidad"/>
                                </Col>
                            </Row>
                        </div>
                    }
                    <Row slot="list">
                        <Col width="80">
                            <CustomInput                    
                                name="recolected"
                                icon={iconCollected}
                                label="Peso recolectado"
                                type="number"
                                unit="kg"    
                                value={recolected}  
                                onInputClear={handleInputClear}
                                onChange={handleInputChange}
                                ></CustomInput>
                        </Col>
                        <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
                            <CalculatorButton href="/recolected/" color="teal" tooltip="Cronómetro"/>
                        </Col>
                    </Row>
                </List>
                <Row>
                    <Col width={20}></Col>
                    <Col width={60}>
                        <Button fill onClick={submit} style={{textTransform:"none"}}>Calcular dosis</Button>
                    </Col>
                    <Col width={20}></Col>
                </Row>
                <Row style={{marginTop:5}}>
                    <Col width={20}></Col>
                    <Col width={60}>
                        <Button fill color="red" onClick={clearForm} style={{textTransform:"none"}}>Borrar formulario</Button>
                    </Col>
                    <Col width={20}></Col>
                </Row>
                {outputs.show ?
                    <ResultsDose results={outputs} onClick={addResultsToReport}/>
                :
                    null
                }
            </Block>
        </div>
    );
};

export default SectionDosif;