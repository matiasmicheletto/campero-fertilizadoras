import { Block, BlockTitle, Row, Col, List, Button } from 'framework7-react';
import CustomInput from '../Inputs';
import { CalculatorButton } from '../Buttons';
import { useState } from 'react';
import Toast from '../Toast';

const SectionDosif = props => {
    const [inputs, setInputs] = useState({
        dose: 0, // Dosis real (medida)
        width: 0, // Ancho de labor
        distance: 0, // Distancia recorrida
        time: 0, // Tiempo de medicion
        speed: 0, // Velocidad de labor
        recolected: 0 // Peso recolectado
    });

    const updateInput = (name, value) => {
        const update = {};
        update[name] = parseFloat(value);
        if( isNaN(update[name]) )
            update[name] = 0;
        setInputs({...inputs, ...update});
        props.setResults({show:false});
    };

    const computeResults = () => {        
        // Control de inputs
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
        if(distance === 0 && props.method === "direct"){
            Toast("error", "Debe indicar distancia recorrida", 2000, "center");
            return;
        }
        if(time === 0 && props.method === "indirect"){
            Toast("error", "Debe indicar tiempo de medición", 2000, "center");
            return;
        }
        if(speed === 0 && props.method === "indirect"){
            Toast("error", "Debe indicar tiempo de medición", 2000, "center");
            return;
        }
        if(recolected === 0){
            Toast("error", "Debe indicar el peso recolectado", 2000, "center");
            return;
        }
        if(props.method === "indirect")
            distance = speed*10/36*time;
        
        // Calculo de outputs
        const calculateddose = recolected/distance/width*10000;
        const res = {
            show: true, // Habilitar bloque de resultados
            dose: calculateddose, 
            diffp: (calculateddose-dose)/dose*100, 
            diffkg: calculateddose-dose 
        }   
        props.setResults(res);
    };

    return (
        <Block style={{marginBottom:"0px"}}>
            <BlockTitle>Control de dosificación</BlockTitle>
            <List form noHairlinesMd style={{marginBottom:"10px"}}>
                <CustomInput
                    outline
                    floatingLabel
                    clearButton
                    slot="list"
                    label="Dosis"
                    type="number"                
                    unit="Kg/Ha"                    
                    value={inputs.dose || ''}
                    onChange={v=>updateInput("dose", v.target.value)}
                    ></CustomInput>
                <CustomInput
                    outline
                    floatingLabel
                    clearButton
                    slot="list"
                    label="Ancho de labor"
                    type="number"
                    unit="m"
                    value={inputs.width || ''}
                    onChange={v=>updateInput("width", v.target.value)}
                    ></CustomInput>
                {props.method==="direct" ?
                    <CustomInput
                        outline
                        floatingLabel
                        clearButton
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
                            outline
                            floatingLabel
                            clearButton
                            label="Tiempo"
                            type="number"
                            unit="seg"
                            value={inputs.time || ''}
                            onChange={v=>updateInput("time", v.target.value)}       
                            ></CustomInput>
                        <Row>
                            <Col width="80">
                                <CustomInput                                
                                    outline
                                    floatingLabel
                                    clearButton                        
                                    label="Velocidad"
                                    type="number"
                                    unit="Km/h"
                                    value={inputs.speed || ''}
                                    onChange={v=>updateInput("speed", v.target.value)}       
                                    ></CustomInput>
                            </Col>
                            <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
                                <CalculatorButton href="/velocity/" onClick={()=>Toast("info", "No implementado", 2000, "center")}/>
                            </Col>
                        </Row>
                    </div>
                }
                <CustomInput
                    outline
                    floatingLabel
                    clearButton
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
                    <Button fill onClick={computeResults}>Calcular</Button>
                </Col>
                <Col></Col>
            </Row>
        </Block>
    );
}

export default SectionDosif;