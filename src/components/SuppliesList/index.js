import { f7, Navbar, Page, Row, Col, Button} from 'framework7-react';
import React, { useContext } from 'react';
import { BackButton } from '../Buttons';
import { ModelCtx } from '../../Context';

const SuppliesList = props => {

    const model = useContext(ModelCtx);

    const addSuppliesToReport = () => {
        const results = {
            field_name: props.field_name,
            work_area: props.work_area,
            products: props.products,
            quantities: props.quantities
        };
        model.addSuppliesToReport(results);
        f7.panel.open();
    };

    return (
        <Page>
            <Navbar title="Lista de insumos" sliding />
            <Row>                
                <table style={{padding:"0px!important", margin:"20px 0px auto auto", width:"90%"}}>
                    <tbody>
                        <tr>
                            <td><b>Lote:</b></td>
                            <td style={{textAlign:"left"}}>{props.field_name}</td>
                        </tr>
                        <tr>
                            <td><b>Superficie:</b></td>
                            <td style={{textAlign:"left"}}>{props.work_area} ha</td>
                        </tr>                        
                        {
                            props.products?.map((prod, index) => (                    
                                <React.Fragment key={index}>
                                    <tr style={{height:"15px"}}>                                        
                                    </tr>
                                    <tr>
                                        <td><b>Producto:</b></td>
                                        <td style={{textAlign:"left"}}>{prod.name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Dosis:</b></td>
                                        <td style={{textAlign:"left"}}>{prod.density} kg/ha</td>
                                    </tr>               
                                    <tr>
                                        <td><b>Total:</b></td>
                                        {
                                            prod.presentation === 0 ?
                                                <td style={{textAlign:"left"}}> {props.quantities[index]?.toFixed(2)} kg</td>
                                            :
                                                <td style={{textAlign:"left"}}> {Math.ceil(props.quantities[index])} envases de {prod.presentation} kg</td>
                                        } 
                                    </tr>         
                                </React.Fragment>
                            ))
                        }
                    </tbody>
                </table>
            </Row>
            <Row style={{marginTop:"20px", marginBottom: "15px"}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill onClick={addSuppliesToReport} style={{textTransform:"none"}}>
                        Agregar a reporte
                    </Button>
                </Col>
                <Col width={20}></Col>
            </Row>
            <BackButton {...props} />
        </Page>
    );
};

export default SuppliesList;