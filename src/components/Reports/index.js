import { Navbar, Page, Block, Checkbox, Row } from 'framework7-react';
import { useState, useContext } from 'react';
import { BackButton } from '../Buttons';
import iconEmpty from '../../img/icons/empty_folder.png';
import { ModelCtx } from '../../Context';

const formatTime = time => {
    const date = new Date(time);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const Reports = props => {

    const model = useContext(ModelCtx);

    const [reports, setReports] = useState(model.reports || []);

    const countSelected = () => {
        let count = 0;
        reports.forEach(report => {
            if (report.selected) 
                count++;
        });
        return count;
    };

    const setSelectedAll = v => {
        const temp = [...reports];
        temp.forEach(report => {
            report.selected = v;
        });
        setReports(temp);
    };

    const setSelected = (id, v) => {
        const temp = [...reports];
        temp.forEach(report => {
            if (report.id === id)
                report.selected = v;
        });
        setReports(temp);
    };

    return (
        <Page>            
            <Navbar title="Reportes guardados" style={{maxHeight:"40px", marginBottom:"0px"}}/>            
            {
            reports.length > 0 ?
                <Row>
                    <div>
                        <table className="data-table" style={{textAlign:"center", minWidth:"0px", tableLayout:"fixed"}} >
                            <colgroup>
                                <col span={1} style={{width: "10%"}} />
                                <col span={1} style={{width: "50%"}} />
                                <col span={1} style={{width: "40%"}} />
                            </colgroup>
                            <thead>
                                <tr style={{maxHeight:"40px!important"}}>
                                    <th>
                                    <Checkbox
                                        checked={reports.length === countSelected()}
                                        indeterminate={countSelected() > 0 && countSelected() < reports.length}
                                        onChange={e => setSelectedAll(e.target.checked)}
                                    />
                                    </th>
                                    <th style={{margin:0, padding:0}}>Título</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div style={{maxHeight:"300px",overflow: "auto"}}>
                        <table className="data-table" style={{textAlign:"center", minWidth:"0px", tableLayout:"fixed"}} >                        
                            <colgroup>
                                <col span={1} style={{width: "10%"}} />
                                <col span={1} style={{width: "50%"}} />
                                <col span={1} style={{width: "40%"}} />
                            </colgroup>
                            <tbody style={{maxHeight:"300px",overflow: "auto"}}>
                                {
                                    reports.map(r => (
                                        <tr key={r.id}>
                                            <td>
                                            <Checkbox
                                                checked={r.selected}                                                
                                                onChange={e => setSelected(r.id, e.target.checked)}
                                            />
                                            </td>
                                            <td className="label-cell">{r.name}</td>
                                            <td className="label-cell">{formatTime(r.timestamp)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Row>
                :
                <Block>
                    <div style={{marginTop: "50%"}}>
                        <center>
                            <h2>No hay reportes guardados</h2>
                            <img src={iconEmpty} height="100px" alt="Sin reportes" />
                        </center>
                    </div>
                </Block>
            }
            <BackButton {...props} />
        </Page>
    );
};

export default Reports;