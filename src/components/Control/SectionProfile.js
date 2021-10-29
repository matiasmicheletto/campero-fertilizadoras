import { Row, Col, Button, Range, BlockTitle } from 'framework7-react';
import { useState, useContext } from 'react';
import { ModelCtx } from '../../Context';
import SimpleChart from '../SimpleChart';
import PatternSelector from './PatternSelector';
import ResultsProfile from './ResultsProfile';


const SectionProfile = () => {

    const model = useContext(ModelCtx);

    const [inputs, setInputs] = useState({
        ww: model.work_width,
        pattern: model.work_pattern
    });

    const updateWW = (value) => {        
        model.work_width = parseFloat(value);
        setInputs({...inputs, ww: model.work_width});
    };

    const updatePattern = (value) => {
        model.work_pattern = value;
        setInputs({...inputs, pattern: value});
    };

    // Resultado del perfil    
    const results = model.getProfile();
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
            <PatternSelector pattern={inputs.pattern} onChange={v => updatePattern(v)}/>
            <Row style={{marginTop:10, marginBottom:30}}>
                <BlockTitle>Ancho de labor: {inputs.ww} mts.</BlockTitle>
                <Range
                    min={ww_min}
                    max={ww_max}
                    label={true}
                    step={1}
                    value={inputs.ww}                    
                    scaleSteps={ww_steps}
                    scaleSubSteps={3}
                    onRangeChange={v=>updateWW(v)}
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