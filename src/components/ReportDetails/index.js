import { Page } from 'framework7-react';

const UndefinedComponent = () => (
    <Page>            
        <Navbar title="Control de fertilización" style={{maxHeight:"40px", marginBottom:"0px"}}/>
        <MethodSelector method={method} setMethod={setMethod}/>
        <SectionDosif method={method}/>
        <SectionDistr />
        <SectionProfile />
        <BackButton {...props} />
    </Page>
);

export default UndefinedComponent;