import { f7, Block, List } from 'framework7-react';
import { useRef, useEffect } from 'react';
import CustomInput from '../Inputs';


const Picker = props => {

    const inputRef = useRef(null);

    const {onSelected, onChange, cols, value} = props;

    useEffect(() => {
        f7.picker.create({
            inputEl: inputRef.current,
            rotateEffect: true,
            backdrop: true,
            toolbarCloseText: "Seleccionar",
            renderToolbar: () => (`
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="left">
                            <a style="color:black; padding-left:10px">Ancho de labor - (CV)</a>
                        </div>
                        <div class="right">
                            <a href="#" class="link sheet-close popover-close">Seleccionar</a>
                        </div>                        
                    </div>
                </div>`
            ),
            on:{                
                close: v=>{
                    if(onSelected) onSelected(v);
                },
                change: v=>{
                    if(onChange) onChange(v);
                }
            },
            cols: cols,
            value: value
        });        
    }, [onSelected, onChange, cols, value]); // <-- Ver por que se crean varios pickers


    const handleClick = e => {        
        e.preventDefault();
        e.stopPropagation();
        setTimeout(()=>{
            inputRef.current.click();            
        },10);
    }

    return(
        <Block>
            <input type="text" readOnly ref={inputRef} style={{display:"none"}}/>
            <List form style={{margin:0}} noHairlines>
                <CustomInput                     
                    readOnly
                    clearButton={false}
                    slot="list"
                    icon={props.icon}
                    type="number"
                    unit="m"
                    label={props.title}
                    value={props.value}
                    onFocus={handleClick}
                />
            </List> 
        </Block>
    )
};

export default Picker;