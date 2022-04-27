import { useContext } from 'react';
import { Block, BlockTitle } from 'framework7-react';
import { ModelCtx } from '../../context';
import classes from './Results.module.css';

const ResultsProfile = props => {

    const model = useContext(ModelCtx);

    const {expected_dose, effective_dose, expected_work_width} = model;
    const {fitted_dose, avg, cv, work_width} = props.results;    
    const diffp_c = expected_dose > 0 ? ((effective_dose - expected_dose)/expected_dose*100).toFixed(2) : '';
    const diffp_f = expected_dose > 0 ? ((fitted_dose - expected_dose)/expected_dose*100).toFixed(2) : '';

    return(
        <Block className={classes.Container}>
            <BlockTitle className={classes.Title}>Perfil de fertilización</BlockTitle>
            <table className={classes.Table}>
                <tbody className="help-target-distr-results">
                    {expected_dose ? 
                        <tr>
                            <td><b>Dosis prevista:</b></td>
                            <td className={classes.DataCell}>{expected_dose?.toFixed(2)} kg/ha</td>
                        </tr>
                        : null
                    }
                    {effective_dose ?
                        <>
                            <tr>
                                <td><b>Dosis efectiva:</b></td>
                                <td className={classes.DataCell}>{effective_dose?.toFixed(2) || ''} kg/ha ({diffp_c} %)</td>
                            </tr>
                            { expected_work_width &&
                            <tr>
                                <td><b>Ancho de labor efectivo:</b></td>
                                <td className={classes.DataCell}>{expected_work_width} m</td>
                            </tr>
                            }
                        </>
                        : null
                    }
                    {fitted_dose && fitted_dose !== effective_dose ?
                        <>
                            <tr>
                                <td><b>Dosis ajustada:</b></td>
                                <td className={classes.DataCell}>{fitted_dose?.toFixed(2) || ''} kg/ha ({diffp_f} %)</td>
                            </tr>
                            { work_width &&
                                <tr>
                                    <td><b>Ancho de labor ajustado:</b></td>
                                    <td className={classes.DataCell}>{work_width} m</td>
                                </tr>
                            }
                        </>
                        : null
                    }
                    <tr>
                        <td><b>Promedio:</b></td>
                        <td className={classes.DataCell}>{avg?.toFixed(2) || ''} gr</td>
                    </tr>                        
                    <tr>
                        <td><b>Coef. variac.:</b></td>
                        <td className={classes.DataCell}>{cv?.toFixed(2) || ''} %</td>
                    </tr>
                    {/*
                    <tr>
                        <td><b>Desvío estándar:</b></td>
                        <td className={classes.DataCell}>{props.results.dst.toFixed(2)}</td>
                    </tr>
                    */}
                </tbody>
            </table>
        </Block>
    );
};

export default ResultsProfile;