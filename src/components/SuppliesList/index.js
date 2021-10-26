import {
    Navbar,
    Page,     
    Row, 
    Col,
    Button, 
} from 'framework7-react';
import React from 'react';

const SuppliesList = props => {

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
                            props.products.map((prod, index) => (                    
                                <React.Fragment key={index}>
                                    <tr style={{height:"15px"}}>                                        
                                    </tr>
                                    <tr>
                                        <td><b>Producto:</b></td>
                                        <td style={{textAlign:"left"}}>{prod.name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Densidad:</b></td>
                                        <td style={{textAlign:"left"}}>{prod.density} kg/ha</td>
                                    </tr>               
                                    <tr>
                                        <td><b>Total:</b></td>
                                        <td style={{textAlign:"left"}}>{props.quantities[index]} kg</td>
                                    </tr>         
                                </React.Fragment>
                            ))
                        }
                    </tbody>
                </table>                
            </Row>
            <Row style={{marginTop:"20px"}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill onClick={() => props.f7router.back()} style={{textTransform:"none", backgroundColor:"red"}}>Borrar</Button>
                </Col>
                <Col width={20}></Col>
            </Row>
            <Row style={{marginTop:"10px"}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill onClick={()=>{}} style={{textTransform:"none", backgroundColor:"#009688"}}>Agregar a reporte</Button>
                </Col>
                <Col width={20}></Col>
            </Row>
        </Page>
    );
};

export default SuppliesList;