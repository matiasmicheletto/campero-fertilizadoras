import { f7, Navbar, Page, Row, Col, Button} from 'framework7-react';
import React, { useContext } from 'react';
import { BackButton } from '../Buttons';
import { ModelCtx } from '../../context';

const SuppliesList = props => {

    const model = useContext(ModelCtx);

    // Cargas y cargas equilibradas
    /*
    const n = model.capacity ? model.loads_data.complete_loads : 0; // Completa
    const b = model.capacity ? model.loads_data.fraction_weight : 0; // Fraccion
    const uneq_load = {
        number: n > 0 ? (n+" carga(s) completa(s)") : "",
        separator: n>0 && b>0 ? " y " : "",
        fraction: b > 0 ? ("una fracción de "+b.toFixed(2)+" kg") : ""
    };}
    // Texto de cargas equilibradas
    const eq_load = model.capacity ? ((model.loads_data.load_number > 1 && model.loads_data.load_number % 1 !== 0) ? 
            (" ó "+Math.ceil(model.loads_data.load_number)+
                " carga(s) de " + 
                Math.round(model.loads_data.eq_load_weight) + " kg ")
            : null ) : null;
    */

    // Texto de cargas equilibradas
    const eq_load = model.capacity ?
        (Math.ceil(model.loads_data.load_number)+" carga(s) de " + Math.round(model.loads_data.eq_load_weight) + " kg ")
        : null;

    const addSuppliesToReport = () => {
        const results = {
            field_name: model.field_name,
            work_area: model.work_area,
            products: model.products,
            capacity: model.capacity,
            quantities: model.quantities,
            //uneq_load: uneq_load,
            eq_load: eq_load
        };
        model.addSuppliesToReport(results);
        f7.panel.open();
    };

    return (
        <Page>
            <Navbar title="Lista de insumos" sliding />
            <Row>                
                <table className="help-target-supplies-results" style={{padding:"0px!important", margin:"20px 0px auto auto", width:"90%"}}>
                    <tbody>
                        <tr>
                            <td><b>Lote:</b></td>
                            <td style={{textAlign:"left"}}>{model.field_name}</td>
                        </tr>
                        <tr>
                            <td><b>Superficie:</b></td>
                            <td style={{textAlign:"left"}}>{model.work_area} ha</td>
                        </tr>
                        {   
                            model.capacity ?
                            <React.Fragment>
                                <tr>
                                    <td><b>Capacidad de carga:</b></td>
                                    <td style={{textAlign:"left"}}>{model.capacity} kg</td>
                                </tr>
                                <tr>
                                    <td style={{verticalAlign:"top"}}><b>Cantidad de cargas:</b></td>
                                    {/*<td style={{textAlign:"left", fontSize:12}}>{uneq_load.number}{uneq_load.separator}{uneq_load.separator && <br/>}{uneq_load.fraction}{eq_load && <br/>}{eq_load}</td>*/}
                                    <td style={{textAlign:"left", fontSize:12}}>{eq_load}</td>
                                </tr>
                            </React.Fragment>
                            :
                            null
                        }
                        {
                            model.products?.map((prod, index) => (
                                <React.Fragment key={index}>
                                    <tr style={{height:"15px"}}>
                                    </tr>
                                    <tr>
                                        <td><b>Producto{model.products?.length > 1 ? (" "+(index+1)) : ""}:</b></td>
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
                                                <td style={{textAlign:"left"}}> {model.quantities[index]?.toFixed(2)} kg</td>
                                            :
                                                <td style={{textAlign:"left"}}> {Math.ceil(model.quantities[index])} envases de {prod.presentation} kg</td>
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
                    <Button className="help-target-add-report" fill onClick={addSuppliesToReport} style={{textTransform:"none"}}>
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