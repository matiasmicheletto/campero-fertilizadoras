import { Block, Radio, Row, Col, BlockTitle } from 'framework7-react';

const MethodSelector = props => {    
    
    const setMethod = (el,value) => {
        // Alterna estado del selector y retorna valor por prop
        if(el.target.checked)
            props.onChange(value);
    }

    return (
        <Block style={{margin:"0px"}}>
            <BlockTitle>Variable de muestreo</BlockTitle>
            <Row>
                <Col style={{textAlign:"center"}}>
                    <Radio name="input-type" checked={props.method==="direct"} onChange={e=>setMethod(e,"direct")}/> Distancia
                </Col>
                <Col style={{textAlign:"center"}}>
                    <Radio name="input-type" checked={props.method==="indirect"} onChange={e=>setMethod(e,"indirect")}/> Tiempo
                </Col>
            </Row>
        </Block>
    );
};

export default MethodSelector;