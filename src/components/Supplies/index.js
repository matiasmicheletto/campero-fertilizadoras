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
import { ModelCtx, WalkthroughCtx } from '../../context';
import Toast from '../Toast';
import api from '../../Api';
import { error_messages, generate_id, set_2_decimals } from '../../Utils';
import { PresentationSelector } from '../Selectors';
import iconProduct from '../../img/icons/calculador.png';
import iconDose from '../../img/icons/kg_ha_fert.png';
import iconArea from '../../img/icons/sup_lote.png';
import iconName from '../../img/icons/nombre_lote.png';
import iconCapacity from '../../img/icons/capacidad_carga.png';

const Supplies = props => {

    const model = useContext(ModelCtx);

    const [{field_name, work_area, capacity}, setInputs] = useState({
        field_name: model.field_name || '', // Nombre de lote
        work_area: model.work_area || '', // Superficie
        capacity: model.capacity || '' // Capacidad carga
    });

    const [products, setProducts] = useState(model.products);

    const addProduct = () => {
        const temp = [...products];
        temp.push({
            key: generate_id(),
            name: model.main_prod || '',
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

    const setMainParams = (attr, value) => {
        model.update(attr, value);
        setInputs(prevState => ({ ...prevState, [attr]: value }));
    };

    const setProductParams = (index, attr, value) => {
        const temp = [...products];
        temp[index][attr] = value;
        model.update("products", temp);
        setProducts(temp);
    };

    const submit = () => {
        const res = api.computeSuppliesList({field_name, work_area, capacity, products});        
        if(res.status === "error"){
            Toast("error", error_messages[res.wrong_keys[0]], 2000, "center");
            //console.log(res);
        }else{
            model.update({
                quantities: res.quantities, 
                loads_data: res.loads_data
            });
            props.f7router.navigate("/suppliesList/");
        }
    };

    const wlk = useContext(WalkthroughCtx);
    Object.assign(wlk.callbacks, {
        load_number: () => {
            setInputs({
                field_name: model.field_name,
                work_area: model.work_area,
                capacity: model.capacity
            });
            setProducts(model.products);
        },
        supplies_results: () => {
            submit();
        }
    });

    return (
        <Page>            
            <Navbar title="Calculador de insumos" style={{maxHeight:"40px", marginBottom:"0px"}}/>      
            <BlockTitle style={{marginBottom:"0px", marginTop: "0px"}}>Área de trabajo y capacidad de carga</BlockTitle>
            <List form noHairlinesMd style={{marginBottom:"10px"}}>    
                <CustomInput
                    slot="list"
                    label="Lote"
                    name="field_name"
                    type="text"
                    icon={iconName}
                    value={field_name}
                    onChange={v=>setMainParams('field_name', v.target.value)}
                    ></CustomInput>
                <CustomInput
                    className="help-target-supplies-form"
                    slot="list"
                    label="Superficie"
                    name="work_area"
                    type="number"
                    unit="ha"
                    icon={iconArea}
                    value={work_area}
                    onChange={v=>setMainParams('work_area', parseFloat(v.target.value))}
                    ></CustomInput>
                <CustomInput
                    className="help-target-load-number"
                    slot="list"
                    label="Capacidad de carga"
                    name="capacity"
                    type="number"
                    unit="kg"
                    icon={iconCapacity}
                    value={capacity}
                    onChange={v=>setMainParams('capacity', parseFloat(v.target.value))}
                    ></CustomInput>
            </List>
            <Block style={{marginTop: "0px", marginBottom: "0px"}}>
                <BlockTitle style={{marginBottom:"0px", marginTop: "0px"}}>Lista de insumos</BlockTitle>
                {
                    products.map((p, index) =>(
                        <Card key={p.key} style={{margin:"0px 0px 10px 0px"}}>
                            <DeleteButton onClick={()=>removeProduct(index)}/>
                            <CardContent style={{paddingTop:0}}>
                                <span style={{color:"gray"}}>Producto {index+1}</span>
                                <List form noHairlinesMd style={{marginBottom:"0px", marginTop: "0px"}}>
                                    <CustomInput
                                        slot="list"
                                        label="Nombre"
                                        type="text" 
                                        icon={iconProduct}                                       
                                        value={p.name || ''}
                                        onInputClear={()=>setProductParams(index, "name", "")}
                                        onChange={v=>setProductParams(index, "name", v.target.value)}
                                        ></CustomInput>
                                    <CustomInput
                                        className="help-target-add-products"
                                        slot="list"
                                        label="Dosis"
                                        type="number"
                                        unit="kg/ha"
                                        icon={iconDose}
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