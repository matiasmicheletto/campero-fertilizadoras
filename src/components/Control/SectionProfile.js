import { Row, Col, Button, Range, BlockTitle } from 'framework7-react';
import { useState, useContext } from 'react';
import { ModelCtx } from '../../Context';
import SimpleChart from '../SimpleChart';
import PatternSelector from './PatternSelector';
import ResultsProfile from './ResultsProfile';
import api from '../../Api';
import Toast from '../Toast';


const SectionProfile = props => {

    const model = useContext(ModelCtx);

    const [inputs, setInputs] = useState({
        tray_data: model.tray_data,
        tray_number: model.tray_number,
        tray_distance: model.tray_distance,
        work_width: model.work_width,
        work_pattern: model.work_pattern
    });

    const updateWW = (value) => {        
        model.work_width = parseFloat(value);
        setInputs({...inputs, work_width: model.work_width});
    };

    const updatePattern = (value) => {
        model.work_pattern = value;
        setInputs({...inputs, work_pattern: value});
    };

    // Resultado del perfil        
    const results = api.computeDistributionProfile(inputs);
    console.log(results);
    if(results.status === 'error'){
        Toast("error", model.error_messages[results.wrong_keys[0]], 2000, "center");
        props.hideResults();
        return null;
    }    

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
            <PatternSelector pattern={inputs.work_pattern} onChange={v => updatePattern(v)}/>
            <Row style={{marginTop:10, marginBottom:30}}>
                <BlockTitle>Ancho de labor: {inputs.work_width} mts.</BlockTitle>
                <Range
                    min={ww_min}
                    max={ww_max}
                    label={true}
                    step={1}
                    defaultValue={inputs.work_width}
                    scaleSteps={ww_steps}
                    scaleSubSteps={3}
                    onRangeChange={v=>updateWW(v)}
                />
            </Row>
            <ResultsProfile results={results} expected_dose={model.expected_dose} computed_dose={model.computed_dose}/>
            <Row>
                <Col>
                    <SimpleChart id="profile_plot" config={profile_chart_config} />
                </Col>
            </Row>
            <Row style={{marginTop:20}}>
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