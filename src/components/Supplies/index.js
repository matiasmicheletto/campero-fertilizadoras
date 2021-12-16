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
import { error_messages, generate_id, set_2_decimals } from '../../Utils';
import PresentationSelector from './PresentationSelector';


const Supplies = props => {

    const model = useContext(ModelCtx);

    const [inputs, setInputs] = useState({
        field_name: model.field_name || "", // Nombre de lote
        work_area: model.work_area || 0 // Superficie
    });

    const [products, setProducts] = useState(model.products);

    const addProduct = () => {
        const temp = [...products];
        temp.push({
            key: generate_id(),
            name: "",
            density: set_2_decimals(model.fitted_dose || model.effective_dose || model.expected_dose || 0),
            presentation: 0 // 0->granel, x->envase de x kg
        });
        model.update("products", temp);        
        setProducts(temp);
    };

    const removeProduct = index => {
        const temp = [...products];
        temp.splice(index, 1);
        model.products = temp;
        model.update("products", temp);
        setProducts(temp);
    };

    const setFieldParams = (attr, value) => {
        const temp = { ...inputs };
        temp[attr] = value;
        model.update(attr, value);
        setInputs(temp);
    };

    const setProductParams = (index, attr, value) => {
        const temp = [...products];
        temp[index][attr] = value;
        model.update("products", temp);
        setProducts(temp);
    };

    const submit = () => {
        const res = api.computeSuppliesList({...inputs, products});        
        if(res.status === "error"){
            Toast("error", error_messages[res.wrong_keys[0]], 2000, "center");
            console.log(res);
        }else{
            const quantities = res.quantities;
            const {products, field_name, work_area} = model;
            props.f7router.navigate("/suppliesList/", { props: { quantities, products, work_area, field_name } });
        }
    };

    return (
        <Page>            
            <Navbar title="Calculador de insumos" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <Row style={{marginBottom:"0px", marginTop: "0px"}}>
                <BlockTitle style={{marginBottom:"0px", marginTop: "0px"}}>Área de trabajo</BlockTitle>
                <List form noHairlinesMd style={{marginBottom:"10px"}}>
                    <Row slot="list">
                        <Col width={50} style={{width:"50%"}}>
                            <CustomInput
                                label="Lote"
                                name="field_name"
                                type="text"
                                defaultValue={inputs.field_name || ''}
                                onChange={v=>setFieldParams('field_name', v.target.value)}
                                ></CustomInput>
                        </Col>
                        <Col width={50} style={{width:"50%"}}>
                            <CustomInput                    
                                label="Superficie"
                                name="work_area"
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
                                        value={p.name || ''}
                                        onInputClear={()=>setProductParams(index, "name", "")}
                                        onChange={v=>setProductParams(index, "name", v.target.value)}
                                        ></CustomInput>
                                    <CustomInput
                                        slot="list"
                                        label="Dosis"
                                        type="number"
                                        unit="kg/ha"
                                        value={p.density || ''}
                                        onInputClear={()=>setProductParams(index, "density", "")}
                                        onChange={v=>setProductParams(index, "density", parseFloat(v.target.value))}
                                        ></CustomInput>
                                </List>
                                <PresentationSelector value={p.presentation} onChange={v=>{setProductParams(index, "presentation", v.target.value)}}/>
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
            <Row style={{marginBottom:"15px"}}>
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