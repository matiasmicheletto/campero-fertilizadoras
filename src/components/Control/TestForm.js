import { Block, List } from 'framework7-react';
import { useState } from 'react';
import CustomInput from '../Inputs';

const TestForm = () => {
    
    const [inputs, setInputs] = useState({value1: '',value2: ''});

    const setInputValue = (name, value) => {                
        setInputs({...inputs, [name]: value});
    };

    const handleChange = e => {        
        setInputValue(e.target.name, e.target.value);        
    };

    const clearValue1 = () => {
        setInputValue('value1', '');
    };

    const clearValue2 = () => {
        setInputValue('value2', '');
    };

    return (
        <div>
            <Block style={{marginBottom:"0px"}}>
                <List form noHairlinesMd style={{marginBottom:"10px"}}>
                    <CustomInput                    
                        slot="list"
                        name="value1"
                        label="Valor 1"
                        type="number"                                        
                        value={inputs.value1}
                        onInputClear={clearValue1}
                        onChange={handleChange}
                        ></CustomInput>
                    <CustomInput
                        slot="list"
                        name="value2"
                        label="Valor 2"
                        type="number"
                        value={inputs.value2}
                        onInputClear={clearValue2}
                        onChange={handleChange}
                        ></CustomInput>
                </List>
            </Block>
        </div>
    );
};

export default TestForm;