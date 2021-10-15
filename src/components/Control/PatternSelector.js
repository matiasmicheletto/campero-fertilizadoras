import { Block, Radio, Row, Col, BlockTitle } from 'framework7-react';

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

export default PatternSelector;