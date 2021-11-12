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
    const [inputs, setInputs] = useState({
        method: model.method || 'direct',
        expected_dose: model.expected_dose || '', // Dosis real (medida)
        gear: model.gear || '', // Cambio de la maquinaria
        work_width: model.work_width || '', // Ancho de labor
        distance: model.distance || '', // Distancia recorrida
        time: model.time || '', // Tiempo de medicion
        work_velocity: parseFloat(model.work_velocity) || '', // Velocidad de labor
        recolected: model.recolected || '' // Peso recolectado
    });
    
    // Resultados
    const [outputs, setOutputs] = useState({
        show: false,
        dose: '',
        diffkg: '',
        diffp: ''
    });

    const setInputValue = (key, value) => {        
        const update = { ...inputs};
        if(value !== '' && key !== "gear" && key !== "method")
            update[key] = parseFloat(value);
        else 
            update[key] = value;        
        console.log(update);
        setInputs(update);
        setOutputs({...outputs, show: false});
    };

    const handleChange = e => {        
        setInputValue(e.target.name, e.target.value);        
    };

    const handleClear = e => {        
        setInputValue(e.target.name, '');
    };

    const submit = () => {        
        const res = api.computeDose(inputs);
        console.log(res);
        if(res.status === "error")
            Toast("error", error_messages[res.wrong_keys[0]], 2000, "center");
        else{
            setOutputs({...res, show: true});            
        }
    };

    const clearForm = () => {  
        const temp = {};
        for(let key in inputs)
            temp[key] = '';
        temp.method = 'direct';
        setInputs(temp);
        setOutputs({...outputs, show: false});
    };

    return (
        <div>
            <MethodSelector value={inputs.method} onChange={handleChange}/>
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
                        value={inputs.expected_dose}
                        onInputClear={handleClear}
                        onChange={handleChange}
                        ></CustomInput>
                    <CustomInput
                        slot="list"
                        name="gear"
                        icon={iconGear}
                        label="Cambio"
                        type="text"
                        value={inputs.gear}
                        onInputClear={handleClear}
                        onChange={handleChange}
                        ></CustomInput>
                    <CustomInput                    
                        slot="list"
                        name="work_width"
                        icon={iconWorkWidth}
                        label="Ancho de labor"
                        type="number"
                        unit="m"
                        value={inputs.work_width}
                        onInputClear={handleClear}
                        onChange={handleChange}
                        ></CustomInput>
                    {inputs.method==="direct" ?
                        <CustomInput                        
                            slot="list"
                            name="distance"
                            icon={iconDistance}
                            label="Distancia"
                            type="number"
                            unit="m"
                            value={inputs.distance}
                            onInputClear={handleClear}
                            onChange={handleChange}      
                            ></CustomInput>
                        :
                        <div slot="list">
                            <CustomInput                            
                                label="Tiempo"
                                name="time"
                                icon={iconTime}
                                type="number"
                                unit="seg"
                                value={inputs.time}
                                onInputClear={handleClear}
                                onChange={handleChange}      
                                ></CustomInput>
                            <Row>
                                <Col width="80">
                                    <CustomInput                                                                                          
                                        label="Velocidad"
                                        name="work_velocity"
                                        icon={iconVelocity}
                                        type="number"
                                        unit="Km/h"
                                        value={inputs.work_velocity}
                                        onInputClear={handleClear}
                                        onChange={handleChange}
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
                        value={inputs.recolected}  
                        onInputClear={handleClear}             
                        onChange={handleChange}
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