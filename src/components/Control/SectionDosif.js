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
    const [method, setMethod] = useState(model.method); 
    
    // Mostrar/ocultar bloque de resultados parciales
    const [results, setResults] = useState(false);
    
    // Campos del formulario
    const [inputs, setInputs] = useState({
        dose: 0, // Dosis real (medida)
        work_width: 0, // Ancho de labor
        distance: 0, // Distancia recorrida
        time: 0, // Tiempo de medicion
        work_velocity: 0, // Velocidad de labor
        recolected: 0 // Peso recolectado
    });

    useEffect(()=>{        
        inputs.work_velocity = model.work_velocity;
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
        model[name] = update[name];
        setInputs({...inputs, ...update});
        setResults(false); // Ocultar bloque de resultados
    };

    const submit = () => {                
        // Calculo de outputs        
        const res = model.getRealDose();
        if(res.status === "error")
            Toast("error", res.message, 2000, "center");
        else{
            setOutputs(res);
            setResults(true);
        }
    };

    return (
        <div>
            <MethodSelector method={method} onChange={v => {setMethod(v); model.method = v; setResults(false);}}/>
            <Block style={{marginBottom:"0px"}}>
                <BlockTitle>Control de dosificación</BlockTitle>
                <List form noHairlinesMd style={{marginBottom:"10px"}}>
                    <CustomInput                    
                        slot="list"
                        label="Dosis deseada"
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
                        value={inputs.work_width || ''}
                        onChange={v=>updateInput("work_width", v.target.value)}
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
                                        value={inputs.work_velocity || ''}
                                        onChange={v=>updateInput("work_velocity", v.target.value)}       
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
                    <Col width={20}></Col>
                    <Col width={60}>
                        <Button fill onClick={submit} style={{textTransform:"none"}}>Calcular dosis</Button>
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