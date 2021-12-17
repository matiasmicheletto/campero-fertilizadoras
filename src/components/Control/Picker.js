import { f7, Row, Col, Button } from 'framework7-react';
import React from 'react';
//import CustomInput from '../Inputs';

class Picker extends React.Component {
    
        constructor(props) {
            super(props);            
            this.inputRef = React.createRef();
            this.handleClick = this.handleClick.bind(this);
            this.state = {
                pattern: props.pattern
            };
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

        componentDidUpdate(prevProps){
            if(prevProps.pattern !== this.props.pattern){
                this.picker.cols = this.props.cols;
                this.setState({pattern: this.props.pattern});
            }
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
                <div>
                    <input type="text" readOnly ref={this.inputRef} style={{display:"none"}}/>
                    <Row style={{marginTop:20}}>
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button 
                                fill 
                                style={{textTransform:"none"}} 
                                color="teal"
                                onClick={this.handleClick}>
                                Ajustar ancho de labor
                            </Button>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                    {/*
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
                    */}
                </div>
            )
        }
}

export default Picker;