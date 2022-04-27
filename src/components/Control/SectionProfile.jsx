import { f7, Row, Col, Button } from 'framework7-react';
import Picker from './Picker';
import { useState, useContext } from 'react';
import { ModelCtx } from '../../context';
import SimpleChart from '../SimpleChart';
import { PatternSelector } from '../Selectors';
import ResultsProfile from './ResultsProfile';
import iconWorkWidth from '../../img/icons/ancho_labor.png';
import { get_closest } from '../../Utils';


const SectionProfile = props => {

    const model = useContext(ModelCtx);

    const [work_pattern, setWorkPattern] = useState(model.work_pattern || "circular");

    // El ancho de labor se configura en esta vista (Picker), pero se actualiza en todo el formulario,
    // por eso viene de props y se debe determinar los resultados de acuerdo al valor de ancho de labor mas cercano.
    const closest = get_closest(props.outputs[work_pattern], "work_width", props.work_width);
    const results = closest ? closest : {profile:[], avg: 0, dst: 0, cv: 0, fitted_dose: null};
    model.update("fitted_dose", results.fitted_dose); // Actualizar dosis ajustada para usar en calculo de insumos

    // Configuracion del grafico del perfil
    const profile_chart_config = { 
        type: "line",
        title: "",
        height: "80%",
        yaxis: "Dosis (kg/ha)",
        tooltip_prepend: "Bandeja ",
        tooltip_append: " gr",
        label_formatter: props.lblFormatter,
        categories: Object.keys(results.profile).map((v,i)=>i+1),
        plotLines: [{ // Linea horizontal del promedio
            color: '#FF0000',
            width: 2,
            value: results.avg 
        }],
        series:[
            {
                name: "Peso aplicado",
                //showInLegend: true, 
                data: results.profile,
                color: "rgb(50,250,50)"
            },
            {
                name: "Promedio",
                color: '#FF0000',
                width: 2,
                marker: {
                    enabled: false
                }
            }
        ]
    };

    const pickerCols = [ // Valores del picker (ancho de labor - cv)
        {
            values: props.outputs[work_pattern].map(v => v.work_width),
            displayValues: props.outputs[work_pattern].map(v => v.work_width+" m - ("+v.cv.toFixed(2)+"%)"),
            textAlign: 'left'
        }
    ];

    const handlePatternChange = v => {
        model.update("work_pattern", v);        
        setWorkPattern(v);
    };

    const handlePickerChange = v => {        
        //console.log("Picker value: ", parseFloat(v.value[0]));                
        props.setWorkWidth(parseFloat(v.value[0]));
    };

    const addResultsToReport = () => {
        model.addDistributionToreport(results);
        f7.panel.open();
    };

    return (
        <>
            <ResultsProfile results={results} />
            <Row style={{marginBottom: 20}}>
                <Col>
                    <SimpleChart id="profile_plot" config={profile_chart_config} />
                </Col>
            </Row>
            <PatternSelector pattern={work_pattern} onChange={handlePatternChange}/>
            <Picker                 
                pattern={work_pattern}
                title={"Ancho de labor"} 
                cols={pickerCols} 
                value={[closest?.work_width]}
                onChange={handlePickerChange}
                icon={iconWorkWidth}
                />
            <Row style={{marginTop:10}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill style={{textTransform:"none"}} onClick={addResultsToReport}>
                        Agregar a reporte
                    </Button>
                </Col>
                <Col width={20}></Col>
            </Row>
        </>
    );
};

export default SectionProfile;