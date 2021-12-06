import { Radio, Row, Col } from 'framework7-react';
import { openRecipientSizePrompt } from '../Prompts';

const PresentationSelector = props => {    

    const setBulk = checked => { // Configurar para granel
        if(checked)
            props.onChange({
                target: {
                    name: 'presentation',                    
                    value: 0
                }
            });
    };

    const openPrompt = checked => { // Configurar para envases
        if(checked)
            openRecipientSizePrompt(v=>props.onChange(
                {
                    target: {
                        name: 'presentation',                        
                        value: v
                    }
                }
            ));
    };
    
    return (
        <Row style={{fontSize:12}}>
            <Col width={33}>
                Presentación
            </Col>
            <Col  width={33}>
                <Radio 
                    name="input-type" 
                    checked={props.value === 0} 
                    onChange={e=>setBulk(e.target.checked)}/> A granel
            </Col>
            <Col width={33}>
                <Radio 
                    name="input-type" 
                    checked={props.value > 0} 
                    onChange={e=>openPrompt(e.target.checked)}/> En envase
                    <br/>
                {
                    props.value>0?
                    <span style={{color:"darkgray", marginLeft:20}}> (de {props.value} kg)</span>
                    :
                    null
                }
                
            </Col>
        </Row>
    );
};

export default PresentationSelector;