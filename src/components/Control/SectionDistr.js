import { List, Block, BlockTitle, Card, Row, Col, Button } from 'framework7-react';
import { FaArrowCircleLeft, FaArrowCircleRight, FaStopCircle } from 'react-icons/fa';
import { useState, useContext } from 'react';
import CustomInput from '../Inputs';
import { openCollectedPrompt } from '../Prompts';
import { ModelCtx } from '../../Context';
import SimpleChart from '../SimpleChart';
import SectionProfile from './SectionProfile';
import iconTrayDist from '../../img/icons/dist_bandejas.png';
import iconTrayNum from '../../img/icons/cant_bandejas.png';
import iconTrayArea from '../../img/icons/sup_bandeja.png';
import iconPassNumber from '../../img/icons/cant_pasadas.png';
import api from '../../Api';
import Toast from '../Toast';
import { error_messages } from '../../Utils';

const SectionDistr = props => {

    const model = useContext(ModelCtx);

    // Campos del formulario
    const [tray_area, setTrayArea] = useState(model.tray_area || '');
    const [tray_distance, setTrayDistance] = useState(model.tray_distance || '');
    const [tray_data, setTrayData] = useState(model.tray_data || []);
    const [tray_number, setTrayNumber] = useState(model.tray_number || '');
    const [pass_number, setPassNumber] = useState(model.pass_number || '');
    
    // Resultados
    const [outputs, setOutputs] = useState({
        show: false,
        linear: {},
        circular: {},
        ww_range: {}
    });

    const setNumTrays = n => { // Configurar cantidad de bandejas y actualizar tabla
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
            model.update("tray_data", tempArr);
            setTrayData(tempArr);            
            setTrayNumber(n);            
        }
    };

    const addCollected = (row, value) => { 
        // Callback prompt
        let tempArr = [...tray_data];
        tempArr[row].collected = value;
        model.update("tray_data", tempArr);
        setTrayData(tempArr);
        setOutputs(false);
    };

    const updateValue = (name, value) => {
        let f = parseFloat(value);
        let n = parseInt(value);
        if(isNaN(f) || f < 0)
            f = '';
        if(isNaN(n) || n < 0)
            n = '';
        switch(name){
            case "tray_area":
                setTrayArea(f);
                break;
            case "tray_distance":
                setTrayDistance(f);
                break;
            case "pass_number":
                setPassNumber(n);
                break;
            case "tray_number":
                setNumTrays(n);
                break;
            default:
                break;
        }
        model.update(name, name === "tray_area" || name === "tray_distance" ? f : n);
        setOutputs(false);
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
        setTrayArea('');
        setTrayDistance('');
        setPassNumber('');
        setTrayData([]);
        setTrayNumber('');
        setOutputs(false); 
        model.clear(["tray_area", "tray_distance", "pass_number", "tray_data", "tray_number"]);
    };

    const submit = () => { 
        const params = {
            tray_distance,
            tray_data: tray_data.map(v => v.collected),
        };
        const res = api.sweepForProfile(params);
        console.log(res);
        if(res.status === "error")
            Toast("error", error_messages[res.wrong_keys[0]], 2000, "center");
        else
            setOutputs({
                show: true,
                linear: res.linear,
                circular: res.circular,
                ww_range: res.ww_range
            });
    };

    const densityFromRecolected = value => {
        const res = api.computeDensityFromRecolected({
            recolected: value,
            pass_number: pass_number,
            tray_area: tray_area
        });
        return res.density;
    };

    const collected_chart_config = { // Configuracion del grafico de datos medidos
        type: "line",
        title: "Distribución medida",
        yaxis: "Peso (Kg/ha.)",
        tooltip_prepend: "Bandeja ",
        tooltip_append: " gr",
        label_formatter: densityFromRecolected,
        categories: tray_data?.map((v,i)=>i+1),
        series:[{           
            name: "Peso recolectado",
            showInLegend: false, 
            data: tray_data?.map(v=>v.collected),
            color: "rgb(50,50,250)"
        }]
    };

    return (
        <Block>
            <BlockTitle>Distribución y ancho de labor</BlockTitle>
            <List form noHairlinesMd style={{marginBottom:"10px"}}>
                <CustomInput
                    slot="list"
                    name="tray_area"
                    icon={iconTrayArea}
                    label="Superf. de bandeja"
                    type="number"
                    unit="m²"                    
                    value={tray_area}
                    onInputClear={handleInputClear}
                    onChange={handleInputChange}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    name="tray_distance"
                    icon={iconTrayDist}
                    label="Dist. entre bandejas"
                    type="number"
                    unit="m"
                    value={tray_distance}
                    onInputClear={handleInputClear}
                    onChange={handleInputChange}
                    ></CustomInput>
                <CustomInput
                    slot="list"        
                    name="tray_number"            
                    icon={iconTrayNum}
                    label="Cantidad de bandejas"
                    type="number"       
                    value={tray_number}   
                    onInputClear={handleInputClear}
                    onChange={handleInputChange}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    name="pass_number"
                    icon={iconPassNumber}
                    label="Cantidad de pasadas"
                    min={0}
                    type="number"
                    value={pass_number}
                    onInputClear={handleInputClear}
                    onChange={handleInputChange}
                    ></CustomInput>
            </List>
            {
                tray_data?.length > 0 ?
                <Card>
                    <div>
                        <table className="data-table" style={{textAlign:"center", minWidth:"0px", tableLayout:"fixed"}} >
                            <colgroup>
                                <col span={1} style={{width: "30%"}} />
                                <col span={1} style={{width: "30%"}} />
                                <col span={1} style={{width: "40%"}} />
                            </colgroup>
                            <thead style={{backgroundColor:"rgb(200,200,200)"}}>
                                <tr style={{maxHeight:"40px!important"}}>
                                    <th className="label-cell" style={{margin:0, padding:0}}>Bandeja</th>
                                    <th className="label-cell" style={{margin:0, padding:0}}>Lado</th>
                                    <th className="label-cell" style={{margin:0, padding:0}}>
                                        <div>Peso</div><div>recolectado</div>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div style={{maxHeight:"300px",overflow: "auto"}}>
                        <table className="data-table" style={{textAlign:"center", minWidth:"0px", tableLayout:"fixed"}} >                        
                            <colgroup>
                                <col span={1} style={{width: "30%"}} />
                                <col span={1} style={{width: "30%"}} />
                                <col span={1} style={{width: "40%"}} />
                            </colgroup>
                            <tbody style={{maxHeight:"300px",overflow: "auto"}}>
                                {
                                    tray_data.map((tr,idx) => (
                                        <tr key={idx} onClick={()=>openCollectedPrompt(idx, tr.side, tray_data.length, addCollected)}>
                                            <td>{idx+1}</td>
                                            <td className="label-cell">
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
                                            <td className="numeric-cell">{tr.collected.toFixed(2)} gr</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Card>
                :
                <div style={{textAlign:"center", color:"rgb(150,150,150)"}}>
                    <p>Ingrese la cantidad de bandejas</p>
                </div>
            }
            { tray_data.length > 0 && !outputs.show ?
                <>
                    <Row>
                        <Col>
                            <SimpleChart id="collected_plot" config={collected_chart_config} />
                        </Col>
                    </Row>
                    <Row>
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button onClick={submit} fill style={{textTransform:"none"}}>Calcular perfil</Button>
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
                </>
            :
                null
            }
            {outputs.show ?
                <SectionProfile outputs={outputs} setWorkWidth={props.setWorkWidth}/>
            :
                null
            }
        </Block>
    );
};

export default SectionDistr;