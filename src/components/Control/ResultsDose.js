import { Block, Row, Col, Button, BlockTitle } from 'framework7-react';
import classes from './Results.module.css';

const ResultsDose = props => (
    <Block className={classes.Container}>            
        <BlockTitle className={classes.Title}>Resultados</BlockTitle>
        <table className={classes.Table}>
            <tbody>
                <tr>
                    <td><b>Dosis efectiva:</b></td>
                    <td className={classes.DataCell}>{props.results.dose.toFixed(2)} kg/ha</td>
                </tr>
                <tr>
                    <td><b>Diferencia:</b></td>
                    <td className={classes.DataCell}>{props.results.diffkg.toFixed(2)} kg ({props.results.diffp.toFixed(2)} %)</td>
                </tr>                        
            </tbody>
        </table>
        <Row style={{marginTop:20}}>
            <Col width={20}></Col>
            <Col width={60}>
                <Button fill style={{textTransform:"none"}} onClick={props.onClick}>Agregar a reporte</Button>
            </Col>
            <Col width={20}></Col>
        </Row>
    </Block>
);

export default ResultsDose;