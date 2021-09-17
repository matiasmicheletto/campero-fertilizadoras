import { f7, Block } from 'framework7-react';
import { useRef, useEffect } from 'react';

const Picker = props => {

    const inputRef = useRef(null);
    
    useEffect(()=>{
        f7.picker.create({
            inputEl: inputRef.current,
            rotateEffect: true,
            renderToolbar: () => (`
                <div class="toolbar">
                    <div class="toolbar-inner">
                        <div class="right">
                            <a href="#" class="link sheet-close popover-close">Seleccionar</a>
                        </div>                        
                    </div>
                </div>`
            ),
            cols: [
               {
                 values: props.values,
                 textAlign: 'center'
               }
             ]
        });
    });

    return(
        <Block>
            <input type="text" placeholder={props.title} readOnly ref={inputRef}/>
        </Block>
    )
};

export default Picker;