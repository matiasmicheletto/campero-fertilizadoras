import { Navbar, Page } from 'framework7-react';
import { useState, useContext } from 'react';
import SectionDosif from './SectionDosif';
//import TestForm from './TestForm';
import SectionDistr from './SectionDistr';
import { BackButton } from '../Buttons';
import { ModelCtx } from '../../Context';

const Control = props => {

    const model = useContext(ModelCtx);
    const [work_width, setWorkWidth] = useState(model.work_width || '');

    const handleWWChange = v => {
        model.update("work_width", v);
        setWorkWidth(v);
    }
    
    return (
        <Page>            
            <Navbar title="Parámetros de fertilización" style={{maxHeight:"40px", marginBottom:"0px"}}/>
            <SectionDosif work_width={work_width} setWorkWidth={handleWWChange} />
            <SectionDistr work_width={work_width} setWorkWidth={handleWWChange} />
            <BackButton {...props} />
        </Page>
    );
};

export default Control;