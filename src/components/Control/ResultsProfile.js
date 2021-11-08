import { Block } from 'framework7-react';

const ResultsProfile = props => (
    <Block style={{margin:"25px 0px 25px 0px"}}>
        <h4>Perfil de fertilización</h4>
        <table style={{padding:"0px!important", margin:"0 auto", width:"90%"}}>
            <tbody>
                <tr>
                    <td><b>Dosis:</b></td>
                    <td style={{textAlign:"right"}}>{props.dose.toFixed(2)} Kg/ha</td>
                </tr>
                <tr>
                    <td><b>Promedio:</b></td>
                    <td style={{textAlign:"right"}}>{props.results.avg.toFixed(2)} gr</td>
                </tr>                        
                <tr>
                    <td><b>Coef. variac.:</b></td>
                    <td style={{textAlign:"right"}}>{props.results.cv.toFixed(2)} %</td>
                </tr>
                {/*
                <tr>
                    <td><b>Desvío estándar:</b></td>
                    <td style={{textAlign:"right"}}>{props.results.dst.toFixed(2)}</td>
                </tr>
                */}
            </tbody>
        </table>
    </Block>
);

export default ResultsProfile;