import { Navbar, Page } from 'framework7-react';
import MethodSelector from './MethodSelector';
import SectionDosif from './SectionDosif';
import SectionDistr from './SectionDistr';
import SectionProfile from './SectionProfile';
import BackButton from './BackButton';
import { useState } from 'react';

const Control = () => {
    const [method, setMethod] = useState("direct"); // Metodo de medicion de distancia

    return(
        <Page>            
            <Navbar title="Control de fertilización" style={{maxHeight:"40px", marginBottom:"0px"}}/>
            <MethodSelector method={method} setMethod={setMethod}/>
            <SectionDosif />
            <SectionDistr />
            <SectionProfile />
            <BackButton to="/" />
        </Page>
    )
};

export default Control;