import { Block, Radio, Row, Col, BlockTitle } from 'framework7-react';

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
        <Block style={{margin:"0px"}}>
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

export default MethodSelector;