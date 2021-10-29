import { Block } from 'framework7-react';

const ResultsDose = props => (
    <Block style={{margin:"10px 0px 0px 0px"}}>
        <h4>Resultados</h4>
        <table style={{padding:"0px!important", margin:"0 auto", width:"90%"}}>
            <tbody>
                <tr>
                    <td><b>Dosis:</b></td>
                    <td style={{textAlign:"right"}}>{props.results.dose.toFixed(2)} Kg/ha</td>
                </tr>
                <tr>
                    <td><b>Diferencia</b></td>
                    <td style={{textAlign:"right"}}>{props.results.diffkg.toFixed(2)} Kg ({props.results.diffp.toFixed(2)} %)</td>
                </tr>                        
            </tbody>
        </table>
    </Block>
);

export default ResultsDose;