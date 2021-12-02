import { Block, BlockTitle, Row, Col, List, Button } from 'framework7-react';
import { useContext, useState } from 'react';
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

const SectionDosif = () => {

    const model = useContext(ModelCtx);
    
    // Campos del formulario
    const [method, setMethod] = useState(model.method || 'direct');
    const [expected_dose, setExpectedDose] = useState(model.expected_dose || '');
    const [gear, setGear] = useState(model.gear || '');
    const [work_width, setWorkWidth] = useState(model.work_width || '');
    const [distance, setDistance] = useState(model.distance || '');
    const [time, setTime] = useState(model.time || '');
    const [work_velocity, setWorkVelocity] = useState(model.work_velocity || '');
    const [recolected, setRecolected] = useState(model.recolected || '');
    
    // Resultados
    const [outputs, setOutputs] = useState({
        show: false,
        dose: '',
        diffkg: '',
        diffp: ''
    });

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
                setWorkWidth(f);
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
        setWorkWidth('');
        setDistance('');
        setTime('');
        setWorkVelocity('');
        setRecolected('');
        setOutputs({...outputs, show: false});
    };

    const submit = () => {        
        const params = {
            method,
            expected_dose,
            work_width,
            distance,
            time,
            work_velocity,
            recolected
        };
        const res = api.computeDose(params);
        console.log(res);
        if(res.status === "error")
            Toast("error", error_messages[res.wrong_keys[0]], 2000, "center");
        else{
            setOutputs({...res, show: true});            
        }
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
                        unit="Kg/ha"
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
                        value={work_width}
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
                                <Col width="20" style={{paddingTop:"12px", marginRight:"10px"}}>
                                    <CalculatorButton />
                                </Col>
                            </Row>
                        </div>
                    }
                    <CustomInput                    
                        slot="list"
                        name="recolected"
                        icon={iconCollected}
                        label="Peso recolectado"
                        type="number"
                        unit="Kg"    
                        value={recolected}  
                        onInputClear={handleInputClear}
                        onChange={handleInputChange}
                        ></CustomInput>
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
                    <ResultsDose results={outputs}/>
                :
                    null
                }
            </Block>
        </div>
    );
};

export default SectionDosif;