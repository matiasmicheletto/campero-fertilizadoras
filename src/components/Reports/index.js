import { Navbar, Page, Block, Checkbox, Row, Col, Button } from 'framework7-react';
import { useState, useContext } from 'react';
import { BackButton } from '../Buttons';
import iconEmpty from '../../img/icons/empty_folder.png';
import { ModelCtx } from '../../Context';
import Toast from '../Toast';
import classes from './Reports.module.css';

const formatTime = time => {
    const date = new Date(time);
    return date.toLocaleDateString("es-AR", { day: 'numeric', month: 'numeric' }) + 
        " " + date.toLocaleTimeString("es-AR", {hour: 'numeric', minute: 'numeric'});
};

const countSelected = array => {
    return array.filter(el => el.selected).length;
};

const Reports = props => {

    const model = useContext(ModelCtx);

    const [reports, setReports] = useState(model.reports || []);
    const [selectedCount, setSelectedCount] = useState(countSelected(model.reports));

    const setSelectedAll = v => {
        const temp = [...reports];
        temp.forEach(report => {
            report.selected = v;
        });
        setSelectedCount(v ? temp.length : 0);
        setReports(temp);
    };

    const setSelected = (id, v) => {
        const temp = [...reports];
        temp.forEach(report => {
            if (report.id === id)
                report.selected = v;
        });
        setSelectedCount(countSelected(temp));
        setReports(temp);
    };

    const openSelected = () => {
        Toast("info", "Funcionalidad no disponible", 2000, "center");
    };

    const renameSelected = () => {
        Toast("info", "Funcionalidad no disponible", 2000, "center");
    };

    const deleteSelected = () => {
        Toast("info", "Funcionalidad no disponible", 2000, "center");
    };

    return (
        <Page>            
            <Navbar title="Reportes guardados" style={{maxHeight:"40px", marginBottom:"0px"}}/>            
            {
            reports.length > 0 ?
                <Row className={classes.Container}>                    
                    <table className={classes.Table}>
                        <colgroup>
                            <col span={1} style={{width: "15%"}} />
                            <col span={1} style={{width: "45%"}} />
                            <col span={1} style={{width: "40%"}} />
                        </colgroup>
                        <thead>
                            <tr className={classes.TableRow}>
                                <th className={classes.CheckboxCell}>
                                    <Checkbox
                                        checked={reports.length === selectedCount}
                                        indeterminate={selectedCount > 0 && selectedCount < reports.length}
                                        onChange={e => setSelectedAll(e.target.checked)}
                                    />
                                </th>
                                <th className={classes.NameCell}>Título</th>
                                <th className={classes.DateCell}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody style={{maxHeight:"300px",overflow: "auto"}}>
                            {
                                reports.map(r => (
                                    <tr className={classes.TableRow} key={r.id} style={{backgroundColor: r.selected ? "rgb(230,230,230)" : "white"}}>
                                        <td className={classes.CheckboxCell}>
                                            <Checkbox
                                                checked={r.selected}                                                
                                                onChange={e => setSelected(r.id, e.target.checked)}
                                            />
                                        </td>
                                        <td className={classes.NameCell}>{r.name}</td>
                                        <td className={classes.DateCell}>{formatTime(r.timestamp)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Row>
                :
                <Block>
                    <div style={{marginTop: "50%"}}>
                        <center>
                            <h2>No hay reportes guardados</h2>
                            <img src={iconEmpty} height="100px" alt="Sin reportes" />
                        </center>
                    </div>
                </Block>
            }
            {
                selectedCount === 1 ?
                <>
                    <Row style={{marginTop:10}}>
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button fill onClick={renameSelected} color="teal" style={{textTransform:"none"}}>Cambiar nombre</Button>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button fill onClick={openSelected} style={{textTransform:"none"}}>Abrir</Button>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                </>
                :
                null
            }
            {
                selectedCount > 0 ?
                <Row style={{marginTop:10, marginBottom:20}}>
                    <Col width={20}></Col>
                    <Col width={60}>
                        <Button fill onClick={deleteSelected} color="red" style={{textTransform:"none"}}>Borrar</Button>
                    </Col>
                    <Col width={20}></Col>
                </Row>
                :
                null
            }
            <BackButton {...props} />
        </Page>
    );
};

export default Reports;