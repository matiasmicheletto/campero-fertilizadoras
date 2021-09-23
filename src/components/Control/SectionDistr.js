import { List, Block, BlockTitle, Card } from 'framework7-react';
import CustomInput from '../Inputs';
import openCollectedPrompt from '../Prompts';

const SectionDistr = props => {

    const addCollected = (row, value) => {
        console.log(row, value);
    }

    return (
        <Block style={{marginBottom:"0px"}}>
            <BlockTitle>Control de distribución</BlockTitle>        
            <List form noHairlinesMd style={{marginBottom:"10px"}}>
                <CustomInput                    
                    slot="list"
                    label="Superf. de bandeja"
                    type="number"                
                    unit="m²"                    
                    ></CustomInput>
                <CustomInput                    
                    slot="list"
                    label="Dist. entre bandejas"
                    type="number"
                    unit="m"
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    label="Cantidad de bandejas"
                    type="number"
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    label="Cantidad de pasadas"
                    type="number"
                    ></CustomInput>
            </List>
            <Card>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Bandeja</th>
                            <th>Lado</th>
                            <th>Peso recolectado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onClick={()=>openCollectedPrompt(1, addCollected)}>
                            <td>1</td>
                            <td>Izq</td>
                            <td></td>
                        </tr>
                        <tr onClick={()=>openCollectedPrompt(2, addCollected)}>
                            <td>2</td>
                            <td>Der</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </Card>            
        </Block>
    );
};

export default SectionDistr;