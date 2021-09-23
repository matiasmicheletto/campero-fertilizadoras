import { f7, List, Row, Col } from 'framework7-react';
import ReactDOMServer from 'react-dom/server';
import IconCollected from '../img/icons/recolectado_chorrillo.png';
import CustomInput from './Inputs';
import React from 'react';

const openCollectedPrompt = (row, callback) => { 
    // Modal ingreso de peso recolectado

    //React.useLayoutEffect = React.useEffect;
    
    const content = ReactDOMServer.renderToStaticMarkup(
        <List form noHairlinesMd style={{marginBottom:"0px"}}>
            <Row slot="list">
                <Col width={10}>
                    <img src={IconCollected} width={40} height={40} alt="icon"/>
                </Col>
                <Col width={90}>
                    <CustomInput
                        label="Peso recolectado"
                        type="number"
                        unit="gr"
                        inputId="collectedweightinput"
                    ></CustomInput>
                </Col>
            </Row>
        </List>
    );

    f7.dialog.create({
        title: "Bandeja "+row,
        content: content,
        buttons:[
            {
                text: "Cancelar"
            },
            {
                text: "Aceptar",
                onClick: ()=>{
                    const inputEl = document.getElementById("collectedweightinput");                    
                    callback(row, parseFloat(inputEl.value));
                }
            }
        ],
        destroyOnClose: true        
    }).open();
};

export default openCollectedPrompt;