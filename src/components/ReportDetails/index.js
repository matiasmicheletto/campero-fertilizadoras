import { Navbar, Page, Block, Row, Col, Button } from 'framework7-react';
import { useContext } from 'react';
import { BackButton } from '../Buttons';
import { ModelCtx } from '../../Context';
import Toast from '../Toast';
import classes from './ReportDetails.module.css';
import { formatTime } from '../../Utils';

const workPattern = {
    linear: "Ida y vuelta",
    circular: "En círculos"
};

const ReportDetails = props => {
    
    const model = useContext(ModelCtx);
    const report = model.getReport(props.id);

    const exportPDF = () => {
        // TODO: exportar a pdf
        Toast("info", "Funcionalidad aún no disponible", 2000, "center");
    };

    return (
        <Page>            
            <Navbar title={"Reporte de la labor"} style={{maxHeight:"40px", marginBottom:"0px"}}/>
            <Block className={classes.HeaderBlock}>
                <p><b>Nombre: </b>{report.name}</p>
                <p><b>Fecha y hora: </b>{formatTime(report.timestamp)}</p>
            </Block>
            {
                report.completed.dose &&
                <Block className={classes.SectionBlock}>
                    <h3>Parámetros de fertilización</h3>
                    <table className={classes.Table}>
                        <tbody>
                            {report.dose.gear && 
                                <tr>
                                    <td><b>Cambio:</b></td>
                                    <td className={classes.DataCell}>{report.dose.gear}</td>
                                </tr>
                            }
                            <tr>
                                <td><b>Ancho de labor:</b></td>
                                <td className={classes.DataCell}>{report.dose.work_width?.toFixed(2)} m</td>
                            </tr>
                            <tr>
                                <td><b>Peso recolectado:</b></td>
                                <td className={classes.DataCell}>{report.dose.recolected?.toFixed(2)} kg</td>
                            </tr>
                            {
                                report.dose.method === "direct" ? 
                                <tr>
                                    <td><b>Distancia de recorrido:</b></td>
                                    <td className={classes.DataCell}>{report.dose.distance?.toFixed(2)} m</td>
                                </tr>
                                :
                                <>
                                    <tr>
                                        <td><b>Tiempo:</b></td>
                                        <td className={classes.DataCell}>{report.dose.time?.toFixed(2)} seg</td>
                                    </tr>
                                    <tr>
                                        <td><b>Velocidad:</b></td>
                                        <td className={classes.DataCell}>{report.dose.work_velocity?.toFixed(2)} km/h</td>
                                    </tr>
                                </>
                            }
                            <tr>
                                <td><b>Dosis prevista:</b></td>
                                <td className={classes.DataCell}>{report.dose.expected_dose?.toFixed(2)} kg/ha</td>
                            </tr>
                            <tr>
                                <td><b>Dosis efectiva:</b></td>
                                <td className={classes.DataCell}>{report.dose.effective_dose?.toFixed(2)} kg/ha</td>
                            </tr>
                            <tr>
                                <td><b>Diferencia:</b></td>
                                <td className={classes.DataCell}>{report.dose.diffkg?.toFixed(2)} kg ({report.dose.diffp?.toFixed(2)} %)</td>
                            </tr>                        
                        </tbody>
                    </table>
                </Block>
            }
            {
                report.completed.distribution &&
                <Block className={classes.SectionBlock}>
                    <h3>Distribución y ancho de labor</h3>
                    <table className={classes.Table}>
                        <tbody>
                            <tr>
                                <td><b>Superficie de bandeja:</b></td>
                                <td className={classes.DataCell}>{report.distr.tray_area?.toFixed(2)} m²</td>
                            </tr>
                            <tr>
                                <td><b>Cantidad de bandejas:</b></td>
                                <td className={classes.DataCell}>{report.distr.tray_number} m</td>
                            </tr>
                            <tr>
                                <td><b>Distancia entre bandejas:</b></td>
                                <td className={classes.DataCell}>{report.distr.tray_distance} m</td>
                            </tr>                
                            <tr>
                                <td><b>Cantidad de pasadas:</b></td>
                                <td className={classes.DataCell}>{report.distr.pass_number}</td>
                            </tr>
                            <tr>
                                <td><b>Patrón de trabajo:</b></td>
                                <td className={classes.DataCell}>{workPattern[report.distr.work_pattern]}</td>
                            </tr>
                            <tr>
                                <td><b>Dosis ajustada:</b></td>
                                <td className={classes.DataCell}>{report.distr.fitted_dose?.toFixed(2)} kg/ha</td>
                            </tr>
                            <tr>
                                <td><b>Promedio peso recolectado:</b></td>
                                <td className={classes.DataCell}>{report.distr.avg?.toFixed(2)} gr</td>
                            </tr>
                            <tr>
                                <td><b>Coeficiente de variación:</b></td>
                                <td className={classes.DataCell}>{report.distr.cv?.toFixed(2)} %</td>
                            </tr>
                        </tbody>
                    </table>
                </Block>
            }  
            {
                report.completed.supplies &&
                <Block className={classes.SectionBlock}>
                    <h3>Cálculo de insumos</h3>
                    <table className={classes.Table}>
                        <tbody>
                            <tr>
                                <td><b>Lote:</b></td>
                                <td className={classes.DataCell}>{report.supplies.field_name}</td>
                            </tr>
                            <tr>
                                <td><b>Superficie:</b></td>
                                <td className={classes.DataCell}>{report.supplies.work_area} ha</td>
                            </tr>
                            {
                                report.supplies?.products.map((prod, index)=>(
                                    <>
                                        <tr>
                                            <br/>
                                        </tr>
                                        <tr>
                                            <td><b>Producto:</b></td>
                                            <td className={classes.DataCell}>{prod.name}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Dosis:</b></td>
                                            <td className={classes.DataCell}>{prod.density?.toFixed(2)} kg/ha</td>
                                        </tr>
                                        <tr>
                                            <td><b>Total:</b></td>
                                            {
                                            prod.presentation === 0 ?
                                                <td className={classes.DataCell}> {report.supplies.quantities[index]?.toFixed(2)} kg</td>
                                            :
                                                <td className={classes.DataCell}> {Math.ceil(report.supplies.quantities[index])} envases de {prod.presentation} kg</td>
                                            }
                                        </tr>
                                    </>
                                ))
                            }
                        </tbody>
                    </table>
                </Block>
            }
            <Row style={{marginTop:10}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill onClick={exportPDF} style={{textTransform:"none"}}>Guardar como  PDF</Button>
                </Col>
                <Col width={20}></Col>
            </Row>
            <BackButton {...props} />
        </Page>
    );
};

export default ReportDetails;