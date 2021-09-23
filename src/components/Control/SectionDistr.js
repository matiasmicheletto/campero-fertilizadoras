import { List, Block, BlockTitle, Card, Row, Col, Button } from 'framework7-react';
import { FaArrowCircleLeft, FaArrowCircleRight, FaStopCircle } from 'react-icons/fa';
import { useState } from 'react';
import CustomInput from '../Inputs';
import openCollectedPrompt from '../Prompts';
import Toast from '../Toast';

const SectionDistr = props => {

    // Campos del formulario
    const [inputs, setInputs] = useState({
        trayArea: 0,
        distance: 0,        
        passNumber: 0
    });

    // Lista de peso de bandejas
    const [trayArray, setTrayArray] = useState([]);

    const updateInput = (name, value) => {        
        // Parseo input
        const update = {};
        update[name] = parseFloat(value);
        if( isNaN(update[name]) )
            update[name] = 0;
        setInputs({...inputs, ...update});        
    };

    const setNumTrays = n => { 
        // Configurar cantidad de bandejas y actualizar tabla
        if(n >= 0 && n < 100){
            let tempArr = [];
            for(let idx = 0; idx < n; idx++){
                // Posiciones de las bandejas Izquierda - Centro - Derecha
                const side = idx === (n-1)/2 ? "middle" : (idx < n/2 ? "left" : "right");                
                tempArr.push({                    
                    side: side,
                    collected: 0,
                });
            }
            setTrayArray(tempArr);            
        }
    };

    const addCollected = (row, value) => { 
        // Callback prompt
        let tempArr = [...trayArray];
        tempArr[row].collected = value;
        setTrayArray(tempArr);
    };

    const submit = () => {
        // Calcular perfil de fertilizacion
        const {trayArea, distance, trayNumber, passNumber} = inputs;

        console.log(inputs);

        if(trayArea === 0){
            Toast("error", "Debe indicar la superficie de bandeja", 2000, "center");
            return;
        }
        if(distance === 0){
            Toast("error", "Debe indicar la distancia entre bandejas", 2000, "center");
            return;
        }
        if(trayNumber === 0){
            Toast("error", "Debe indicar la cantidad de bandejas", 2000, "center");
            return;
        }
        if(passNumber === 0){
            Toast("error", "Debe indicar la cantidad de pasadas", 2000, "center");
            return;
        }

        console.log(trayArray.map(tr=>tr.collected));
    };

    return (
        <Block>
            <BlockTitle>Control de distribución</BlockTitle>
            <List form noHairlinesMd style={{marginBottom:"10px"}}>
                <CustomInput
                    slot="list"
                    label="Superf. de bandeja"
                    type="number"
                    unit="m²"                    
                    value={inputs.trayArea || ''}
                    onChange={v=>updateInput("trayArea", v.target.value)}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    label="Dist. entre bandejas"
                    type="number"
                    unit="m"
                    value={inputs.distance || ''}
                    onChange={v=>updateInput("distance", v.target.value)}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    label="Cantidad de bandejas"
                    type="number"                    
                    onChange={v=>setNumTrays(parseInt(v.target.value))}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    label="Cantidad de pasadas"
                    type="number"
                    value={inputs.passNumber || ''}
                    onChange={v=>updateInput("passNumber", v.target.value)}
                    ></CustomInput>
            </List>
            <Card>
                <table className="data-table" style={{textAlign:"center", minWidth:"0px", tableLayout:"fixed"}}>
                    <thead>
                        <tr>
                            <th>Bandeja</th>
                            <th>Lado</th>
                            <th><div>Peso</div><div>recolectado</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trayArray.map((tr,idx) => (
                                <tr key={idx} onClick={()=>openCollectedPrompt(idx, tr.side, addCollected)}>
                                    <td>{idx+1}</td>
                                    <td>
                                    {
                                        tr.side==="middle"?
                                        <FaStopCircle size={20}/>
                                        :
                                        tr.side==="left"?
                                        <FaArrowCircleLeft size={20}/>
                                        :
                                        <FaArrowCircleRight size={20}/>
                                    }
                                    </td>
                                    <td>{tr.collected} gr</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </Card>          
            <Row>
                <Col></Col>
                <Col>
                    <Button onClick={submit} fill style={{textTransform:"none"}}>Calcular</Button>
                </Col>
                <Col></Col>
            </Row>
        </Block>
    );
};

export default SectionDistr;