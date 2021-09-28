import { Block, BlockTitle, Row, Col, List, Button } from 'framework7-react';
import { useContext, useState } from 'react';
import CustomInput from '../Inputs';
import { CalculatorButton } from '../Buttons';
import MethodSelector from './MethodSelector';
import ResultsDose from './ResultsDose';
import Toast from '../Toast';
import { ModelCtx } from '../../Context';
import { useEffect } from 'react/cjs/react.development';

const SectionDosif = () => {

    const model = useContext(ModelCtx);

    // Metodo de medicion de distancia direct/indirect
    const [method, setMethod] = useState("direct"); 
    
    // Mostrar/ocultar bloque de resultados parciales
    const [results, setResults] = useState(false);
    
    // Campos del formulario
    const [inputs, setInputs] = useState({
        dose: 0, // Dosis real (medida)
        width: 0, // Ancho de labor
        distance: 0, // Distancia recorrida
        time: 0, // Tiempo de medicion
        speed: 0, // Velocidad de labor
        recolected: 0 // Peso recolectado
    });

    useEffect(()=>{
        if(model.measured_velocity)
            inputs.speed = parseFloat(model.measured_velocity.toFixed(2));
    });
    

    // Resultados
    const [outputs, setOutputs] = useState({        
        dose: 0, // Dosis deseada
        diffp: 0, // Diferencia porcentual
        diffkg: 0 // Diferencia en kg
    });

    const updateInput = (name, value) => {        
        // Parseo input
        const update = {};
        update[name] = parseFloat(value);
        if( isNaN(update[name]) )
            update[name] = 0;
        setInputs({...inputs, ...update});
        setResults(false); // Ocultar bloque de resultados
    };

    const submit = () => {        
        // Calcular resultados parciales
        const {dose, recolected, width, time, speed} = inputs;
        let distance = inputs.distance; // Calculable

        if(dose === 0){
            Toast("error", "Debe indicar la dosis deseada", 2000, "center");
            return;
        }
        if(width === 0){
            Toast("error", "Debe indicar el ancho de labor", 2000, "center");
            return;
        }
        if(distance === 0 && method === "direct"){
            Toast("error", "Debe indicar distancia recorrida", 2000, "center");
            return;
        }
        if(time === 0 && method === "indirect"){
            Toast("error", "Debe indicar tiempo de medición", 2000, "center");
            return;
        }
        if(speed === 0 && method === "indirect"){
            Toast("error", "Debe indicar tiempo de medición", 2000, "center");
            return;
        }
        if(recolected === 0){
            Toast("error", "Debe indicar el peso recolectado", 2000, "center");
            return;
        }
        if(method === "indirect")
            distance = speed*10/36*time;
        
        // Calculo de outputs
        const calculateddose = recolected/distance/width*10000;
        const res = {            
            dose: calculateddose, 
            diffp: (calculateddose-dose)/dose*100, 
            diffkg: calculateddose-dose 
        }   
        setOutputs(res);
        setResults(true);
    };

    return (
        <div>
            <MethodSelector method={method} onChange={v => {setMethod(v); setResults(false);}}/>
            <Block style={{marginBottom:"0px"}}>
                <BlockTitle>Control de dosificación</BlockTitle>
                <List form noHairlinesMd style={{marginBottom:"10px"}}>
                    <CustomInput                    
                        slot="list"
                        label="Dosis"
                        type="number"                
                        unit="Kg/Ha"                    
                        value={inputs.dose || ''}
                        onChange={v=>updateInput("dose", v.target.value)}
                        ></CustomInput>
                    <CustomInput                    
                        slot="list"
                        label="Ancho de labor"
                        type="number"
                        unit="m"
                        value={inputs.width || ''}
                        onChange={v=>updateInput("width", v.target.value)}
                        ></CustomInput>
                    {method==="direct" ?
                        <CustomInput                        
                            slot="list"
                            label="Distancia"
                            type="number"
                            unit="m"
                            value={inputs.distance || ''}
                            onChange={v=>updateInput("distance", v.target.value)}       
                            ></CustomInput>
                        :
                        <div slot="list">
                            <CustomInput                            
                                label="Tiempo"
                                type="number"
                                unit="seg"
                                value={inputs.time || ''}
                                onChange={v=>updateInput("time", v.target.value)}       
                                ></CustomInput>
                            <Row>
                                <Col width="80">
                                    <CustomInput                                                                                          
                                        label="Velocidad"
                                        type="number"
                                        unit="Km/h"
                                        value={inputs.speed || ''}
                                        onChange={v=>updateInput("speed", v.target.value)}       
                                        ></CustomInput>
                                </Col>
                                <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
                                    <CalculatorButton />
                                </Col>
                            </Row>
                        </div>
                    }
                    <CustomInput                    
                        slot="list"
                        label="Peso recolectado"
                        type="number"
                        unit="Kg"                    
                        onChange={v=>updateInput("recolected", v.target.value)}       
                        ></CustomInput>
                </List>
                <Row>
                    <Col></Col>
                    <Col>
                        <Button fill onClick={submit} style={{textTransform:"none"}}>Calcular</Button>
                    </Col>
                    <Col></Col>
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