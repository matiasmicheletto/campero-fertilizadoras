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
import iconCollected from '../../img/icons/recolectado_chorrillo.png';
import api from '../../Api';
import { error_messages } from '../../Utils';

const SectionDosif = () => {

    const model = useContext(ModelCtx);

    // Metodo de medicion de distancia direct/indirect
    const [method, setMethod] = useState(model.method); 
    
    // Mostrar/ocultar bloque de resultados parciales
    const [results, setResults] = useState(false);
    
    // Campos del formulario
    const [inputs, setInputs] = useState({
        expected_dose: model.expected_dose || 0, // Dosis real (medida)
        gear: model.gear || 0, // Cambio de la maquinaria
        work_width: model.work_width || 0, // Ancho de labor
        distance: model.distance || 0, // Distancia recorrida
        time: model.time || 0, // Tiempo de medicion
        work_velocity: parseFloat(model.work_velocity) || 0, // Velocidad de labor
        recolected: model.recolected || 0 // Peso recolectado
    });
    
    // Resultados
    const [outputs, setOutputs] = useState({});

    const updateInput = (name, value) => {        
        // Parseo input
        const update = {};
        update[name] = parseFloat(value);
        if( isNaN(update[name]) )
            update[name] = 0;
        model[name] = update[name];
        model.saveToLocalStorage();
        setInputs({...inputs, ...update});
        setResults(false); // Ocultar bloque de resultados
    };

    const updateGear = value => {
        if(value !== ""){
            model.gear = value;
            setInputs({...inputs, gear: value});
            setResults(false); // Ocultar bloque de resultados
        }
    };

    const submit = () => {                
        // Calculo de outputs                
        const res = api.computeDose({method:method, ...inputs});
        console.log(res);        
        if(res.status === "error")
            Toast("error", error_messages[res.wrong_keys[0]], 2000, "center");
        else{
            model.computed_dose = res.dose;
            setOutputs(res);
            setResults(true);
        }
    };

    const clearForm = () => {
        model.clearLocalStorage();        
        const temp = {};
        for(let key in inputs){
            model[key] = null;
            temp[key] = null;
        }           
        setInputs(temp);
        setResults(false); // Ocultar bloque de resultados
    };

    return (
        <div>
            <MethodSelector method={method} onChange={v => {setMethod(v); model.method = v; setResults(false);}}/>
            <Block style={{marginBottom:"0px"}}>
                <BlockTitle>Dosis</BlockTitle>
                <List form noHairlinesMd style={{marginBottom:"10px"}}>
                    <CustomInput                    
                        slot="list"
                        icon={iconDose}
                        label="Dosis prevista"
                        type="number"                
                        unit="Kg/ha"
                        value={inputs.expected_dose || ''}                        
                        onInputClear={() => updateInput('expected_dose', null)}
                        onChange={v=>updateInput("expected_dose", v.target.value)}
                        ></CustomInput>
                    <CustomInput
                        slot="list"
                        icon={iconGear}
                        label="Cambio"
                        type="text"                        
                        value={inputs.gear || ''}
                        onInputClear={() => updateGear(null)}
                        onChange={v=>updateGear(v.target.value)}
                        ></CustomInput>
                    <CustomInput                    
                        slot="list"
                        icon={iconWorkWidth}
                        label="Ancho de labor"
                        type="number"
                        unit="m"
                        value={inputs.work_width || ''}
                        onChange={v=>updateInput("work_width", v.target.value)}
                        ></CustomInput>
                    {method==="direct" ?
                        <CustomInput                        
                            slot="list"
                            icon={iconDistance}
                            label="Distancia"
                            type="number"
                            unit="m"
                            value={inputs.distance || ''}
                            onInputClear={() => updateInput('distance', null)}
                            onChange={v=>updateInput("distance", v.target.value)}       
                            ></CustomInput>
                        :
                        <div slot="list">
                            <CustomInput                            
                                label="Tiempo"
                                icon={iconTime}
                                type="number"
                                unit="seg"
                                value={inputs.time || ''}
                                onInputClear={() => updateInput('time', null)}
                                onChange={v=>updateInput("time", v.target.value)}       
                                ></CustomInput>
                            <Row>
                                <Col width="80">
                                    <CustomInput                                                                                          
                                        label="Velocidad"
                                        icon={iconVelocity}
                                        type="number"
                                        unit="Km/h"
                                        value={inputs.work_velocity || ''}
                                        onInputClear={() => updateInput('work_velocity', null)}
                                        onChange={v=>updateInput("work_velocity", v.target.value)}       
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
                        icon={iconCollected}
                        label="Peso recolectado"
                        type="number"
                        unit="Kg"    
                        value={inputs.recolected || ''}  
                        onInputClear={() => updateInput('recolected', null)}              
                        onChange={v=>updateInput("recolected", v.target.value)}       
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
                {results ?
                    <ResultsDose results={outputs}/>
                :
                    null
                }
            </Block>
        </div>
    );
};

export default SectionDosif;