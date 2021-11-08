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
import { ModelCtx } from '../../Context';
import Toast from '../Toast';
import api from '../../Api';

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

    const setFieldParams = (attr, value) => {
        const temp = { ...inputs };
        model[attr] = value;
        temp[attr] = value;
        setInputs(temp);
    };

    const setProductParams = (index, attr, value) => {
        const temp = [...products];
        temp[index][attr] = value;
        model.products = temp;
        setProducts(temp);
    };

    const submit = () => {
        const res = api.computeSuppliesList({products:products, work_area:inputs.work_area});
        if(res.status === "error")        
            Toast("error", model.error_messages[res.wrong_keys[0]], 2000, "center");
        else{
            const quantities = res.quantities;
            const products = model.products;
            const work_area = model.work_area;
            const field_name = model.field_name;            
            props.f7router.navigate("/suppliesList/", { props: { quantities, products, work_area, field_name } });
        }
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
                                onChange={v=>setFieldParams('field_name', v.target.value)}
                                ></CustomInput>
                        </Col>
                        <Col width={50} style={{width:"50%"}}>
                            <CustomInput                    
                                label="Superficie"
                                type="number"
                                unit="ha"
                                defaultValue={inputs.work_area || ''}
                                onChange={v=>setFieldParams('work_area', parseInt(v.target.value))}
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
                                        defaultValue={p.name || ''}
                                        onChange={v=>setProductParams(index, "name", v.target.value)}
                                        ></CustomInput>
                                    <CustomInput
                                        slot="list"
                                        label="Densidad"
                                        type="number"   
                                        unit="kg/ha"
                                        defaultValue={p.density || ''}
                                        onChange={v=>setProductParams(index, "density", parseInt(v.target.value))}
                                        ></CustomInput>    
                                </List>
                            </CardContent>                    
                        </Card>
                    ))
                }
                {
                    products.length > 0 ? 
                        null
                    :                        
                        <div style={{textAlign: "center", color:"rgb(150,150,150)"}}>
                            <p>Agregue productos a la lista presionando en "+"</p>
                        </div>
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