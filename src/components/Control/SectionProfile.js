import { Row, Col, Button, Range, BlockTitle } from 'framework7-react';
import { useState, useContext } from 'react';
import { ModelCtx } from '../../Context';
import SimpleChart from '../SimpleChart';
import PatternSelector from './PatternSelector';
import ResultsProfile from './ResultsProfile';


const SectionProfile = () => {

    const model = useContext(ModelCtx);

    const [inputs, setInputs] = useState({
        ww: model.tray_number*model.tray_distance/2,
        pattern: "linear"
    });

    // Resultado del perfil
    const results = model.getProfile(inputs.ww, inputs.pattern);
    console.log(results);

    // Rango del deslizador de ancho de labor
    const ww_min = 1;
    const ww_max = model.tray_number*model.tray_distance;
    const ww_steps = ww_max; // Cantidad de pasos == valor maximo --> paso = 1mt.

    // Configuracion del grafico del perfil
    const profile_chart_config = { 
        type: "line",
        title: "",
        height: "60%",
        yaxis: "Peso (gr.)",
        tooltip_prepend: "",
        tooltip_append: " gr",
        categories: Object.keys(results.profile).map(v=>parseInt(v)+1),
        series:[{
            name: "Peso aplicado",
            showInLegend: false, 
            data: results.profile,
            color: "rgb(50,250,50)"
        }]
    };

    return (
        <>
            <PatternSelector pattern={inputs.pattern} onChange={v => setInputs({ww: inputs.ww, pattern:v})}/>
            <Row style={{marginTop:10, marginBottom:30}}>
                <BlockTitle>Ancho de labor: {inputs.ww} mts.</BlockTitle>
                <Range
                    min={ww_min}
                    max={ww_max}
                    label={true}
                    step={1}
                    value={inputs.ww}
                    scale={true}
                    scaleSteps={ww_steps}
                    scaleSubSteps={3}
                    onRangeChange={v=>setInputs({pattern: inputs.pattern, ww: parseFloat(v)})}
                />
            </Row>
            <ResultsProfile results={results}/>
            <Row>
                <Col>
                    <SimpleChart id="profile_plot" config={profile_chart_config} />
                </Col>
            </Row>
            <Row>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill style={{textTransform:"none"}}>Agregar a reporte</Button>
                </Col>
                <Col width={20}></Col>
            </Row>
        </>
    );
};

export default SectionProfile;