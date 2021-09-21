import { Block, BlockTitle, Row, Col, List } from 'framework7-react';
import CustomInput from '../Inputs';
import { CalculatorButton } from '../Buttons';

const SectionDosif = props => (
    <Block>
        <BlockTitle>Control de dosificación</BlockTitle>
        <List form noHairlinesMd>
            <CustomInput
                outline
                floatingLabel
                clearButton
                slot="list"
                label="Dosis"
                type="number"                
                unit="Kg/Ha"
                ></CustomInput>
            <CustomInput
                outline
                floatingLabel
                clearButton
                slot="list"
                label="Ancho de labor"
                type="number"
                unit="m"       
                ></CustomInput>
            {props.method==="direct" ?
                <CustomInput
                    outline
                    floatingLabel
                    clearButton
                    slot="list"
                    label="Distancia"
                    type="number"
                    unit="m"       
                    ></CustomInput>
                :
                <div slot="list">
                    <CustomInput
                        outline
                        floatingLabel
                        clearButton
                        label="Tiempo"
                        type="number"
                        unit="seg"       
                        ></CustomInput>
                    <Row>
                        <Col width="80">
                            <CustomInput                                
                                outline
                                floatingLabel
                                clearButton                        
                                label="Velocidad"
                                type="number"
                                unit="Km/h"       
                                ></CustomInput>
                        </Col>
                        <Col width="20" style={{paddingTop:"5px", marginRight:"10px"}}>
                            <CalculatorButton />
                        </Col>
                    </Row>
                </div>
            }
            <CustomInput
                outline
                floatingLabel
                clearButton
                slot="list"
                label="Peso recolectado"
                type="number"
                unit="Kg"       
                ></CustomInput>
        </List>
    </Block>
);

export default SectionDosif;