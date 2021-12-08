import { f7, Block, List } from 'framework7-react';
import React from 'react';
import CustomInput from '../Inputs';

class Picker extends React.Component {
    
        constructor(props) {
            super(props);
            this.inputRef = React.createRef();
            this.handleClick = this.handleClick.bind(this);
        }

        componentDidMount(){
            this.picker = f7.picker.create({
                inputEl: this.inputRef.current,
                rotateEffect: true,
                backdrop: true,            
                renderToolbar: () => (`
                    <div class="toolbar">
                        <div class="toolbar-inner">
                            <div class="center" style="width:100%; text-align:center">
                                <a style="color:black; font-size:130%">Ancho de labor - (CV)</a>
                            </div>
                        </div>
                    </div>`
                ),
                on:{
                    close: v=>{
                        if(this.props.onSelected) this.props.onSelected(v);
                    },
                    change: v=>{
                        if(this.props.onChange) this.props.onChange(v);
                    }
                },
                cols: this.props.cols,
                value: this.props.value
            }); 
        }

        componentWillUnmount(){
            this.picker.destroy();
        }

        handleClick(e) {        
            e.preventDefault();
            e.stopPropagation();
            setTimeout(()=>{
                this.inputRef.current.click();            
            },10);
        }
    
        render(){
            return(
                <Block>
                    <input type="text" readOnly ref={this.inputRef} style={{display:"none"}}/>
                    <List form style={{margin:0}} noHairlines>
                        <CustomInput                     
                            readonly
                            clearButton={false}
                            slot="list"
                            icon={this.props.icon}
                            type="number"
                            unit="m"
                            label={this.props.title}
                            value={this.props.value}
                            onFocus={this.handleClick}
                        />
                    </List> 
                </Block>
            )
        }
}

export default Picker;