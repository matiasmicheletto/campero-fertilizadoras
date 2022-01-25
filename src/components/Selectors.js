import { Block, Radio, Row, Col, BlockTitle } from 'framework7-react';
import { openRecipientSizePrompt } from './Prompts';

const MethodSelector = props => {    
    
    const setMethod = (el,value) => {
        // Alterna estado del selector y retorna valor por prop
        if(el.target.checked)
            props.onChange({
                target: {
                    name: 'method',
                    value: value
                }
            });
    }

    return (
        <Block style={{margin:"0px"}} {...props}>
            <BlockTitle>Método de muestreo</BlockTitle>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <Radio 
                        name="input-type" 
                        checked={props.value==="direct"} 
                        onChange={e=>setMethod(e,"direct")}/> Por distancia
                </Col>
                <Col style={{textAlign:"center"}}>
                    <Radio 
                        name="input-type" 
                        checked={props.value==="indirect"} 
                        onChange={e=>setMethod(e,"indirect")}/> Por tiempo
                </Col>
            </Row>
        </Block>
    );
};

const PatternSelector = props => {    
    
    const setPattern = (el,value) => {
        // Alterna estado del selector y retorna valor por prop
        if(el.target.checked)
            props.onChange(value);
    }

    return (
        <Block style={{margin:"0px"}}>
            <BlockTitle>Patrón de fertilización</BlockTitle>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <Radio 
                        className="help-target-work-pattern"
                        name="input-type" 
                        checked={props.pattern==="linear"} 
                        onChange={e=>setPattern(e,"linear")}/> Ida y vuelta
                </Col>
                <Col style={{textAlign:"center"}}>
                    <Radio 
                        name="input-type" 
                        checked={props.pattern==="circular"} 
                        onChange={e=>setPattern(e,"circular")}/> En círculos
                </Col>
            </Row>
        </Block>
    );
};

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

const ElapsedSelector = props => {

    const setElapsed = (el, value) => {
        if(el.target.checked){
            props.onChange(value);
        }
    };

    return (
        <Block style={{margin:"0px"}}>
            <BlockTitle>Duración del muestreo</BlockTitle>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <Radio 
                        name="input-type" 
                        checked={props.value===30000} 
                        onChange={e=>setElapsed(e,30000)}/> 30 seg.
                </Col>
                <Col style={{textAlign:"center"}}>
                    <Radio 
                        name="input-type" 
                        checked={props.value===60000} 
                        onChange={e=>setElapsed(e,60000)}/> 60 seg.
                </Col>
                <Col style={{textAlign:"center"}}>
                    <Radio 
                        name="input-type" 
                        checked={props.value===90000} 
                        onChange={e=>setElapsed(e,90000)}/> 90 seg.
                </Col>
            </Row>
        </Block>
    );
};


export { MethodSelector, PatternSelector, PresentationSelector, ElapsedSelector };