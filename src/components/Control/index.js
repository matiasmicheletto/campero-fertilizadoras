import { Navbar, Page } from 'framework7-react';
import SectionDosif from './SectionDosif';
import TestForm from './TestForm';
import SectionDistr from './SectionDistr';
import { BackButton } from '../Buttons';

const Control = props => (
    <Page>            
        <Navbar title="Parámetros de fertilización" style={{maxHeight:"40px", marginBottom:"0px"}}/>
        <SectionDosif />        
        <SectionDistr />
        <BackButton {...props} />
    </Page>
);

export default Control;