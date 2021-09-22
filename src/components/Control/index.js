import { Navbar, Page } from 'framework7-react';
import MethodSelector from './MethodSelector';
import SectionDosif from './SectionDosif';
import ResultsDose from './ResultsDose';
import SectionDistr from './SectionDistr';
import SectionProfile from './SectionProfile';
import { BackButton } from '../Buttons';
import { useState } from 'react';

const Control = props => {
    const [method, setMethod] = useState("direct"); // Metodo de medicion de distancia direct/indirect
    
    const [results, setResults] = useState({
        show: false, // Mostrar/ocultar bloque
        dose: 0, // Dosis deseada
        diffp: 0, // Diferencia porcentual
        diffkg: 0 // Diferencia en kg
    });
    
    const methodChange = value => {
        setMethod(value);
        setResults({...results, show:false});
    };

    return(
        <Page>            
            <Navbar title="Control de fertilización" style={{maxHeight:"40px", marginBottom:"0px"}}/>
            <MethodSelector method={method} onChange={methodChange}/>
            <SectionDosif method={method} setResults={setResults}/>
            {results.show ?
                <ResultsDose results={results}/>
            :
                null
            }
            <SectionDistr />
            <SectionProfile />
            <BackButton {...props} />
        </Page>
    )
};

export default Control;