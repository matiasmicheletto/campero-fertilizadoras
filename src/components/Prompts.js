import { f7, List, Row, Col } from 'framework7-react';
import ReactDOMServer from 'react-dom/server';
import IconCollected from '../img/icons/peso_recolectado.png';
import CustomInput from './Inputs';
import React from 'react';

const trayCollectedPrompt = (row, side, n, callback) => { 
    // Modal ingreso de peso recolectado de la bandeja

    const elId = "collectedweightinput"; // Id del input

    const labels = { // Lado de la bandeja
        left: "izquierda",
        middle: "centro",
        right: "derecha"
    };
    
    const content = ReactDOMServer.renderToStaticMarkup(
        <List form noHairlinesMd style={{marginBottom:"0px"}}>
            <CustomInput
                slot="list"
                label="Peso recolectado"
                icon={IconCollected}
                type="number"
                unit="gr"
                inputId={elId}
            ></CustomInput>
        </List>
    );

    const returnValue = () => { // Capturar valor ingresado y retornar
        const inputEl = document.getElementById(elId);                    
        callback(row, parseFloat(inputEl.value) || 0);
    };

    const buttons = [ // Botones del modal
        {
            text: "Cancelar"
        },
        {
            text: "Aceptar",
            onClick: returnValue
        }
    ];

    if(row+1 < n) // Si no es la ultima bandeja, agregar boton de siguiente
        buttons.push({
            text: "Siguiente",
            onClick: ()=>{
                returnValue();
                f7.dialog.close();
                const nextrow = row+1;
                const nextside = nextrow === (n-1)/2 ? "middle" : (nextrow+1 < n/2 ? "left" : "right");
                trayCollectedPrompt(row+1, nextside, n, callback);
            }
        });

    f7.dialog.create({
        title: "Bandeja "+(row+1)+" ("+labels[side]+")",
        content: content,
        buttons: buttons,
        destroyOnClose: true        
    }).open();
};

const openRecipientSizePrompt = callback => { 
    // Modal ingreso de tamanio de recipiente

    const elId = "recipientsizeinput"; // Id del input
    
    const content = ReactDOMServer.renderToStaticMarkup(
        <List form noHairlinesMd style={{marginBottom:"0px"}}>
            <Row slot="list">                
                <CustomInput
                    label="Capacidad"
                    type="number"
                    unit="kg"
                    inputId={elId}
                ></CustomInput>
            </Row>
        </List>
    );

    const buttons = [ // Botones del modal
        {
            text: "Cancelar"
        },
        {
            text: "Aceptar",
            onClick: () => { // Capturar valor ingresado y retornar
                const inputEl = document.getElementById(elId);                    
                callback(parseFloat(inputEl.value) || 0);
            }
        }
    ];

    f7.dialog.create({
        title: "Capacidad del envase",
        content: content,
        buttons: buttons,
        destroyOnClose: true        
    }).open();
};

const timerCollectedPrompt = (callback) => { 
    // Modal ingreso de peso recolectado para dosis

    const elId = "collectedweightinput"; // Id del input
    
    const content = ReactDOMServer.renderToStaticMarkup(
        <List form noHairlinesMd style={{marginBottom:"0px"}}>
            <CustomInput
                slot="list"
                label="Peso recolectado"
                icon={IconCollected}
                type="number"
                unit="kg"
                inputId={elId}
            ></CustomInput>
        </List>
    );

    const returnValue = () => { // Capturar valor ingresado y retornar
        const inputEl = document.getElementById(elId);                    
        callback(parseFloat(inputEl.value) || 0);
    };

    const buttons = [ // Botones del modal
        {
            text: "Cancelar"
        },
        {
            text: "Aceptar",
            onClick: returnValue
        }
    ];

    f7.dialog.create({
        title: "Indique el peso recolectado",
        content: content,
        buttons: buttons,
        destroyOnClose: true        
    }).open();
};


export { trayCollectedPrompt, timerCollectedPrompt, openRecipientSizePrompt };

