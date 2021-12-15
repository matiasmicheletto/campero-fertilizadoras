import { f7, View, Panel, Page, Block, BlockTitle, Button, Row } from 'framework7-react';
import { useState, useContext } from 'react';
import { ModelCtx } from '../Context';
import classes from './ReportsPanel.module.css';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Toast from './Toast';

const ReportsPanel = () => {
    
    const model = useContext(ModelCtx);
    const [completedSections, setCompletedSections] = useState(model.currentReport?.completed || {dose: false, distribution: false, supplies: false});
 
    const onOpened = () => {
        setCompletedSections({...model.currentReport.completed});
    };

    const saveReport = () => {
        f7.dialog.create({
            title: '¿Confirma que desea finalizar y guardar el reporte?',
            content: '<h4>Ya no podrá modificar los datos guardados en el reporte actual.</h4>' +
                '<h4>¿Desea continuar?</h4>',
            buttons: [{
                    text: 'Cancelar',
                    onClick: function () {
                        f7.dialog.close();
                    }
                },
                {
                    text: 'Aceptar',
                    onClick: function () {                        
                        model.saveReport();                        
                        setTimeout(function () {
                            f7.panel.close();
                            setTimeout(function () {
                                f7.views.main.router.navigate('/reports/');
                                setCompletedSections(model.currentReport);
                            }, 500);
                        }, 500);
                    }
                }
            ],
            destroyOnClose: true
        }).open();
    };

    const deleteReport = () => {
        f7.dialog.create({
            title: '¿Confirma que desea borrar el reporte?',
            content: '<h4>Se borrarán todos los datos que se cargaron al reporte actual.</h4>' +
                '<h4>¿Desea continuar?</h4>',
            buttons: [{
                    text: 'Cancelar'
                },
                {
                    text: 'Aceptar',
                    onClick: function () {
                        f7.panel.close();
                        model.clearReport();
                        Toast("success", "Reporte restablecido", 2000, "center");
                        setCompletedSections(model.currentReport);
                    }
                }
            ],
            destroyOnClose: true
        }).open();
    };

    return (
        <Panel right onPanelOpen={onOpened}>
            <View>
                <Page>
                    <Block>
                        <BlockTitle>Reporte actual</BlockTitle>
                        <Row>
                            <table className={classes.Table}>
                                <thead>
                                    <tr>
                                        <th style={{textAlign:"left"}}>Sección</th>
                                        <th>Agregado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Parámetros de fertilización</td>
                                        <td className={classes.SectionStatus}>
                                        {
                                            completedSections.dose ? 
                                            <FaCheck size={20} color="green"/> 
                                            : 
                                            <FaTimes size={20} color="red"/>
                                        }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Distribución y ancho de labor</td>
                                        <td className={classes.SectionStatus}>
                                        {
                                            completedSections.distribution ? 
                                            <FaCheck size={20} color="green"/> 
                                            : 
                                            <FaTimes size={20} color="red"/>
                                        }
                                        </td>
                                    </tr>                        
                                    <tr>
                                        <td>Cálculo de insumos</td>
                                        <td className={classes.SectionStatus}>
                                        {
                                            completedSections.supplies ? 
                                            <FaCheck size={20} color="green"/> 
                                            : 
                                            <FaTimes size={20} color="red"/>
                                        }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Row>
                        
                        <Button className={classes.ButtonSave} fill onClick={saveReport}>
                            Finalizar reporte
                        </Button>
                    
                        <Button className={classes.ButtonDelete} fill onClick={deleteReport} color="red">
                            Borrar reporte
                        </Button>
                    
                        <Button className={classes.ButtonContinue} fill panelClose color="teal">
                            Continuar
                        </Button>
                        
                    </Block>
                </Page>
            </View>
        </Panel>
    );
};

export default ReportsPanel;