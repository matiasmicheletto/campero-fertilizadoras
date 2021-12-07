import { useContext } from 'react';
import { Block, BlockTitle } from 'framework7-react';
import { ModelCtx } from '../../Context';

const ResultsProfile = props => {

    const model = useContext(ModelCtx);

    const {expected_dose, computed_dose} = model;
    const fitted_dose = props.results.fitted_dose;
    const diffp_c = expected_dose > 0 ? ((computed_dose - expected_dose)/expected_dose*100).toFixed(2) : '';
    const diffp_f = expected_dose > 0 ? ((fitted_dose - expected_dose)/expected_dose*100).toFixed(2) : '';

    return(
        <Block style={{margin:"25px 0px 25px 0px"}}>
            <BlockTitle style={{marginBottom:10}}>Perfil de fertilización</BlockTitle>
            <table style={{padding:"0px!important", margin:"0 auto", width:"100%"}}>
                <tbody>
                    {expected_dose ? 
                        <tr>
                            <td><b>Dosis prevista:</b></td>
                            <td style={{textAlign:"right"}}>{expected_dose?.toFixed(2)} Kg/ha</td>
                        </tr>
                        : null
                    }
                    {computed_dose ?
                        <tr>
                            <td><b>Dosis efectiva:</b></td>
                            <td style={{textAlign:"right"}}>{computed_dose?.toFixed(2) || ''} Kg/ha ({diffp_c} %)</td>
                        </tr>
                        : null
                    }
                    {fitted_dose ?
                        <tr>
                            <td><b>Dosis ajustada:</b></td>
                            <td style={{textAlign:"right"}}>{fitted_dose?.toFixed(2) || ''} Kg/ha ({diffp_f} %)</td>
                        </tr>
                        : null
                    }
                    <tr>
                        <td><b>Promedio:</b></td>
                        <td style={{textAlign:"right"}}>{props.results?.avg?.toFixed(2) || ''} gr</td>
                    </tr>                        
                    <tr>
                        <td><b>Coef. variac.:</b></td>
                        <td style={{textAlign:"right"}}>{props.results?.cv?.toFixed(2) || ''} %</td>
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