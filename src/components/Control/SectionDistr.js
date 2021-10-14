import { List, Block, BlockTitle, Card, Row, Col, Button } from 'framework7-react';
import { FaArrowCircleLeft, FaArrowCircleRight, FaStopCircle } from 'react-icons/fa';
import { useState, useContext } from 'react';
import CustomInput from '../Inputs';
import openCollectedPrompt from '../Prompts';
import Toast from '../Toast';
import { ModelCtx } from '../../Context';
import SimpleChart from '../SimpleChart';

const SectionDistr = props => {

    const model = useContext(ModelCtx);

    // Campos del formulario
    const [inputs, setInputs] = useState({
        tray_area: 0,
        tray_distance: 0,        
        pass_number: 0
    });

    // Lista de peso de bandejas
    const [trayArray, setTrayArray] = useState([]);

    // Mostrar/ocultar bloque de resultados de perfil medido
    const [results, setResults] = useState(false);

    const updateInput = (name, value) => {        
        // Parseo input
        const update = {};
        update[name] = parseFloat(value);
        if( isNaN(update[name]) )
            update[name] = 0;
        model[name] = update[name];
        setInputs({...inputs, ...update});        
        setResults(false);
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
            model.tray_number = n;
            setTrayArray(tempArr);            
            setResults(false);
        }
    };

    const addCollected = (row, value) => { 
        // Callback prompt
        let tempArr = [...trayArray];
        tempArr[row].collected = value;
        setTrayArray(tempArr);
        setResults(false);
    };

    const getTrayArray = () => trayArray.map(tr=>tr.collected);

    const submit = () => {
        // Calcular perfil de fertilizacion        
        model.tray_data = getTrayArray();  
        const res = model.getProfile(inputs.tray_distance*trayArray.length/2);
        if(res.status === "error")
            Toast("error", res.message, 2000, "center");
        else{
            console.log(res.profile);
            setResults(true);
        }
    };

    const collected_chart_config = { // Configuracion del grafico de barras del perfil
        type: "line",
        title: "Distribución medida",
        yaxis: "Peso (Kg/ha.)",
        tooltip_prepend: "Bandeja ",
        tooltip_append: " gr",
        label_formatter: value => (value/model.pass_number/model.tray_area/10).toFixed(2),
        categories: Object.keys(getTrayArray()).map(v=>parseInt(v)+1),
        series:[{           
            name: "Peso recolectado",
            showInLegend: false, 
            data: getTrayArray(),
            color: "rgb(50,50,250)"
        }]
    };

    const profile_chart_config = { // Configuracion del grafico de barras del perfil
        type: "line",
        title: "Perfil de fertilización",
        yaxis: "Peso (gr.)",
        tooltip_prepend: "",
        tooltip_append: " gr",
        categories: Object.keys(model.current_profile).map(v=>parseInt(v)+1),
        series:[{           
            name: "Peso aplicado",
            showInLegend: false, 
            data: model.current_profile,
            color: "rgb(50,250,50)"
        }]
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
                    value={inputs.tray_area || ''}
                    onChange={v=>updateInput("tray_area", v.target.value)}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    label="Dist. entre bandejas"
                    type="number"
                    unit="m"
                    value={inputs.tray_distance || ''}
                    onChange={v=>updateInput("tray_distance", v.target.value)}
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
                    value={inputs.pass_number || ''}
                    onChange={v=>updateInput("pass_number", v.target.value)}
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
                                    <td>{tr.collected.toFixed(2)} gr</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </Card>
            { trayArray.length > 0 ?
                <Row>
                    <Col>
                        <SimpleChart id="collected_plot" config={collected_chart_config} />
                    </Col>
                </Row>
            :
                null
            }
            <Row>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button onClick={submit} fill style={{textTransform:"none"}}>Calcular perfil</Button>
                </Col>
                <Col width={20}></Col>
            </Row>
            {results ?
                <Row>
                    <Col>
                        <SimpleChart id="profile_plot" config={profile_chart_config} />
                    </Col>
                </Row>
            :
                null
            }
        </Block>
    );
};

export default SectionDistr;