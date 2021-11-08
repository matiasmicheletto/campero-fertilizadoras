import { Block } from 'framework7-react';

const ResultsProfile = props => {
    const {expected_dose, computed_dose} = props;
    const diffp = (expected_dose - computed_dose)/expected_dose*100;

    return(
        <Block style={{margin:"25px 0px 25px 0px"}}>
            <h4>Perfil de fertilización</h4>
            <table style={{padding:"0px!important", margin:"0 auto", width:"90%"}}>
                <tbody>
                    <tr>
                        <td><b>Dosis prevista:</b></td>
                        <td style={{textAlign:"right"}}>{expected_dose.toFixed(2)} Kg/ha</td>
                    </tr>
                    <tr>
                        <td><b>Dosis calculada:</b></td>
                        <td style={{textAlign:"right"}}>{computed_dose.toFixed(2)} Kg/ha ({diffp.toFixed(2)} %)</td>
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
};

export default ResultsProfile;