import { 
    Navbar, 
    Page, 
    BlockTitle, 
    Block, 
    Row, 
    Col, 
    List, 
    Button, 
    Card, 
    CardContent
} from 'framework7-react';
import { useContext, useState } from 'react';
import CustomInput from '../Inputs';
import { BackButton, DeleteButton, AddButton } from '../Buttons';
import Toast from '../Toast';
import { ModelCtx } from '../../Context';

const generate_id = () => "_" + Math.random().toString(36).substr(2) + Date.now();

const Supplies = props => {

    const model = useContext(ModelCtx);

    const [inputs, setInputs] = useState({
        field_name: "", // Nombre de lote
        work_area: model.work_area || 0 // Superficie
    });

    const [products, setProducts] = useState(model.products);

    const addProduct = () => {
        const temp = [...products];
        temp.push({
            key: generate_id(),
            name: "",
            density: 0
        });
        model.products = temp;
        setProducts(temp);
    };

    const removeProduct = index => {
        const temp = [...products];
        temp.splice(index, 1);
        model.products = temp;
        setProducts(temp);
    };

    const submit = () => {
        Toast("error", "Todavia no implementado", 2000, "center");
    };

    return (
        <Page>            
            <Navbar title="Cálculador de insumos" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Row style={{marginBottom:"0px", marginTop: "0px"}}>
                <BlockTitle style={{marginBottom:"0px", marginTop: "0px"}}>Área de trabajo</BlockTitle>
                <List form noHairlinesMd style={{marginBottom:"10px"}}>
                    <Row slot="list">
                        <Col width={50} style={{width:"50%"}}>
                            <CustomInput
                                label="Lote"
                                type="text"
                                defaultValue={inputs.field_name || ''}
                                onChange={v=>console.log(v)}
                                ></CustomInput>
                        </Col>
                        <Col width={50} style={{width:"50%"}}>
                            <CustomInput                    
                                label="Superficie"
                                type="number"   
                                unit="ha"                                     
                                defaultValue={inputs.work_area || ''}
                                onChange={v=>console.log(v)}                                
                                ></CustomInput>
                        </Col>
                    </Row>
                </List>
            </Row>
            <Block style={{marginTop: "0px", marginBottom: "0px"}}>
                <BlockTitle style={{marginBottom:"0px", marginTop: "0px"}}>Productos</BlockTitle>
                {
                    products.map((p, index) =>(
                        <Card key={p.key} style={{margin:"0px 0px 10px 0px"}}>
                            <DeleteButton onClick={()=>removeProduct(index)}/>
                            <CardContent style={{paddingTop:0}}>
                                <List form noHairlinesMd style={{marginBottom:"0px", marginTop: "0px"}}>
                                    <CustomInput
                                        slot="list"
                                        label="Nombre"
                                        type="text"                                        
                                        defaultValue={inputs.field_name || ''}
                                        onChange={v=>console.log(v)}
                                        ></CustomInput>
                                    <CustomInput
                                        slot="list"
                                        label="Densidad"
                                        type="number"   
                                        unit="kg/ha"
                                        defaultValue={inputs.work_area || ''}
                                        onChange={v=>console.log(v)}
                                        ></CustomInput>    
                                </List>
                            </CardContent>                    
                        </Card>
                    ))
                }
            </Block>
            <Block style={{margin:0}}>
                <AddButton onClick={()=>addProduct()}/>
            </Block>
            <Row style={{marginBottom:"25px"}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill onClick={submit} style={{textTransform:"none"}}>Calcular insumos</Button>
                </Col>
                <Col width={20}></Col>
            </Row>                
            <BackButton {...props} />
        </Page>
    );
};

export default Supplies;