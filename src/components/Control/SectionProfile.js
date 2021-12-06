import { Row, Col, Button } from 'framework7-react';
import Picker from './Picker';
import { useState, useContext } from 'react';
import { ModelCtx } from '../../Context';
import SimpleChart from '../SimpleChart';
import PatternSelector from './PatternSelector';
import ResultsProfile from './ResultsProfile';
import iconWorkWidth from '../../img/icons/ancho_labor.png';


const SectionProfile = props => {

    const model = useContext(ModelCtx);

    const [work_pattern, setWorkPattern] = useState(model.pattern || "circular");

    const diffArr = props.outputs[work_pattern].map(v => Math.abs(props.work_width - v.work_width));
    const closestWorkWidth = Math.min(...diffArr);
    const index = diffArr.findIndex(v => v === closestWorkWidth);
    const results = index > 0 ? props.outputs[work_pattern][index] : {profile:[],avg: 0,dst: 0,cv: 0};

    // Configuracion del grafico del perfil
    const profile_chart_config = { 
        type: "line",
        title: "",
        height: "60%",
        yaxis: "Peso (gr.)",
        tooltip_prepend: "",
        tooltip_append: " gr",
        categories: Object.keys(results.profile).map((v,i)=>i+1),
        series:[{
            name: "Peso aplicado",
            showInLegend: false, 
            data: results.profile,
            color: "rgb(50,250,50)"
        }]
    };

    const pickerCols = [
        {
            values: props.outputs[work_pattern].map(v => v.work_width),
            displayValues: props.outputs[work_pattern].map(v => v.work_width+"m - ("+v.cv.toFixed(2)+"%)"),
            textAlign: 'left'
        }
    ];

    const handlePickerChange = v => {        
        //console.log("Picker value: ", parseFloat(v.value[0]));
        props.setWorkWidth(parseFloat(v.value[0]));
    };

    return (
        <>
            <ResultsProfile results={results} expected_dose={model.expected_dose} computed_dose={model.computed_dose}/>
            <Row style={{marginBottom: 20}}>
                <Col>
                    <SimpleChart id="profile_plot" config={profile_chart_config} />
                </Col>
            </Row>
            <PatternSelector pattern={work_pattern} onChange={v => setWorkPattern(v)}/>
            <Picker 
                title={"Ancho de labor"} 
                cols={pickerCols} 
                value={[props.outputs[work_pattern][index].work_width]}
                onChange={handlePickerChange}
                icon={iconWorkWidth}
                />
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