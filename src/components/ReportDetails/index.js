import { Navbar, Page } from 'framework7-react';
import { BackButton } from '../Buttons';

const ReportDetails = props => (
    <Page>            
        <Navbar title={"Reporte "+props.report?.name} style={{maxHeight:"40px", marginBottom:"0px"}}/>
        <BackButton {...props} />
    </Page>
);

export default ReportDetails;