import { f7 } from "framework7-react";


/*

    Sobre el funcionamiento de este modulo:

    En cada step, se ejecuta una accion y se muestra un popover con texto de ayuda.

    El popover se mostrará sobre el componente con className=[step.target_el]. Los popups se 
    renderizan automaticamente en el componente Popover.js.
    
    Hay dos tipos de acciones, una para actualizar parametros del modelo y la otra que requiere
    renderizar componentes de react. Primero se ejecuta la actualizacion de parametros y luego 
    la otra, siempre y cuando el step tenga callback === true.
    
    Esta clase (WalkthroughModel) tiene acceso al modelo porque al definir el provider se 
    le pasa como argumento con "setModel(model)".
    
    Para renderizar componentes de la vista o ejecutar acciones, se usan los callbacks. En cada 
    componente donde haya que ejecutar una accion, hay que importar el WalkthroughCtx y asignarle 
    callbacks cuyo nombre coincida con la key del paso correspondiente.

*/


const STEPS = [
    ////// SectionDosif.js
    {
        page: "/control/",
        key: "sampling",
        text: "Para comenzar, elija el método de muestreo de descarga.",
        popover_el: "help-popover-sampling",
        target_el: "help-target-sampling"
    },
    {
        page: "/control/",
        key: "prop_fert",
        text: "Si dispone de las propiedades del fertilizante, puede indicarlas aquí, aunque estos datos no intervengan en los cálculos.",
        popover_el: "help-popover-prop-fert",
        target_el: "help-target-prop-fert",
        updateModel: {
            main_prod: "Urea",
            prod_density: 0.8,
        },
        callback: true // Actualizar formulario props del fertilizante
    },
    {
        page: "/control/",
        key: "dose_form",
        text: "En esta sección debe completar los parámetros de muestreo de la descarga de fertilizante.",
        popover_el: "help-popover-dose-form",
        target_el: "help-target-dose-form",
        updateModel: {
            method: "direct",
            expected_dose: 50,
            work_width: 20,
            distance: 50,
            recolected: 5.2
        },
        callback: true // Actualizar formulario parametros
    },
    {
        page: "/control/",
        key: "dose_results",
        text: 'Al presionar en "Calcular dosis", se mostrarán los resultados.',
        popover_el: "help-popover-dose-results",
        target_el: "help-target-dose-results",
        callback: true // Presionar "calcular dosis"
    },
    ////// SectionDistr.js
    {
        page: "/control/",
        key: "distr_form",
        text: 'En esta sección indique los parámetros referidos al muestreo con bandejas.',
        popover_el: "help-popover-distr-form",
        target_el: "help-target-distr-form",        
        updateModel: {
            tray_area: 0.4,
            tray_distance: 1,
            tray_number: 26,            
            tray_data: [10,22,31,45,56,66,78,80,92,100,105,103,110,108,109,110,99,90,85,71,63,59,51,34,26,12].map((v,idx) => {return {collected: v, side: idx === 6.5 ? "middle" : (idx < 13 ? "left" : "right")}}),
            pass_number: 2,
        },
        callback: true // Render form
    },
    {
        page: "/control/",
        key: "distr_results",
        text: 'Al presionar "Calcular perfil", se mostrarán los resultados del perfil de distribución.',
        popover_el: "help-popover-distr-results",
        target_el: "help-target-distr-results",
        callback: true // Presionar boton calcular perfil
    },
    ////// SectionProfile.js
    {
        page: "/control/",
        key: "work_pattern",
        text: 'Aquí puede alternar el patrón de trabajo. En caso de perfil sesgado hacia un lateral, se recomienda elegir "patrón circular".',
        popover_el: "help-popover-work-pattern",
        target_el: "help-target-work-pattern",
        angle: "on-bottom"
    },
    {
        page: "/control/",
        key: "work_width",
        text: 'Finalmente, puede ajustar el ancho de labor para reducir la variación del perfil.',
        popover_el: "help-popover-work-width",
        target_el: "help-target-work-width",
        angle: "on-bottom"
    },
    ////// Supplies
    {
        page: "/supplies/",
        key: "supplies_form",
        text: 'Para calcular insumos, ingrese un nombre para identificar el lote y la superficie del mismo.',
        popover_el: "help-popover-supplies-form",
        target_el: "help-target-supplies-form"
    },
    {
        page: "/supplies/",
        key: "load_number",
        text: 'Si desea conocer la cantidad de cargas requeridas, indique la capacidad de carga de la máquina.',
        popover_el: "help-popover-load-number",
        target_el: "help-target-load-number",
        updateModel: {
            field_name: "Lote 1",
            work_area: 25,
            capacity: 500,
            products: [{
                key: "prod_1",
                presentation: 0,
                name: "Urea",
                density: 50
            }]
        },
        callback: true // Render form
    },
    {
        page: "/supplies/",
        key: "add_products",
        text: 'Puede agregar productos a la lista presionando el botón "+" e indicar nombre de producto, dosis y presentación',
        popover_el: "help-popover-add-products",
        target_el: "help-target-add-products"
    },
    ////// SuppliesList
    {
        page: "/supplies/",
        key: "supplies_results",
        text: 'Luego de presionar en "Calcular insumos", se mostrará el detalle de los resultados obtenidos.',
        popover_el: "help-popover-supplies-results",
        target_el: "help-target-supplies-results",
        callback: true // Presionar boton calcular insumos
    },
    {
        page: "/supplies/", // La vista es otra, pero el cambio lo realiza el callback del paso anterior
        key: "add_report",
        text: 'Puede guardar estos resultados como reporte presionando en "Agregar a reporte"',
        popover_el: "help-popover-add-report",
        target_el: "help-target-add-report"
    }
];

const POPOVER_DELAY = 700;
const SCROLL_DELAY = 500;

export default class WalkthroughModel {
    constructor(){
        this.steps = STEPS;        
        this.currentIndex = -1;
        this.currentStep = null;
        this.model = null;
        this.callbacks = {};
    }

    setModel(model){
        this.model = model;
    }

    start() {
        this.currentIndex = -1;
        this.currentStep = null;
        this.next();
    }

    finish() {        
        //f7.popover.close("."+this.steps[this.currentIndex].popover_el);
        f7.views.main.router.navigate('/');
    }

    next() {

        this.currentIndex++;
        
        if(this.currentIndex >= this.steps.length){
            this.finish();
            return;
        }
        
        this.currentStep = this.steps[this.currentIndex];
        
        if(this.currentIndex > 0){
            if(this.currentStep.page !== this.steps[this.currentIndex-1].page){
                f7.views.main.router.navigate(this.currentStep.page);
            }
            //f7.popover.close("."+this.steps[this.currentIndex-1].popover_el);    
        }else
            f7.views.main.router.navigate(this.currentStep.page);

        if(this.currentStep.updateModel)
            this.model.update(this.currentStep.updateModel);

        if(this.currentStep.callback)
            if(this.callbacks[this.currentStep.key])
                this.callbacks[this.currentStep.key]();

        setTimeout(() => {
            const r = document.getElementsByClassName(this.currentStep.target_el);
            if(r.length > 0){
                r[0].scrollIntoView({block: "center", behavior: "smooth"});
                setTimeout(()=>{
                    try{
                        f7.popover.open("."+this.currentStep.popover_el, "."+this.currentStep.target_el, true);    
                    }catch(e){
                        console.log(e);
                    }
                }, POPOVER_DELAY);
            }else{
                console.log("Error de ayuda, elemento no existe: "+this.currentStep.target_el);
                this.next();
            }
        }, SCROLL_DELAY);
    }
}