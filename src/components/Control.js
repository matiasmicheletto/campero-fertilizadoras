import { Navbar, Page } from 'framework7-react';
import MethodSelector from './MethodSelector';
import SectionDosif from './SectionDosif';
import SectionDistr from './SectionDistr';
import SectionProfile from './SectionProfile';
import { BackButton } from './Buttons';
import { useState } from 'react';

const Control = props => {
    const [method, setMethod] = useState("direct"); // Metodo de medicion de distancia

    return(
        <Page>            
            <Navbar title="Control de fertilización" style={{maxHeight:"40px", marginBottom:"0px"}}/>
            <MethodSelector method={method} setMethod={setMethod}/>
            <SectionDosif method={method}/>
            <SectionDistr />
            <SectionProfile />
            <BackButton {...props} />
        </Page>
    )
};

export default Control;