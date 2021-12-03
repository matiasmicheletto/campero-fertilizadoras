const version = '0.0.1'; // Ante cualquier cambio en el modelo, se debe incrementar la version

export default class CamperoModel {
    constructor(){
        // Variables de dosificacion
        this.expected_dose = null; // Dosis prevista
        this.computed_dose = null; // Dosis a calcular
        this.gear = null; // Cambio de la maquina
        this.recolected = null; // Peso total recolectado
        this.time = null;  // Tiempo de muestreo      
        this.work_velocity = null; // Velocidad de trabajo
        this.work_width = null; // Ancho de labor
        this.distance = null; // Distancia recorrida
        this.method = "direct"; // Uso de velocidad (directa/indirecta)
        // Variables de distribucion
        this.tray_data = []; // Peso recolectado de bandejas
        this.tray_distance = null; // Distancia entre bandejas
        this.tray_number = null; // Cantidad de bandejas (= a tray_data.length)
        this.tray_area = null; // Area de bandeja
        this.pass_number = null; // Cantidad de pasadas
        this.work_pattern = "linear"; // Patron de trabajo, "circular" o "linear"        
        // Variables de insumos
        this.work_area = null; // Superficie de lote
        this.field_name = null; // Nombre del lote
        this.products = []; // Lista de prductos

        //this.subscribed_callbacks = {};

        this.getFromLocalStorage();
    }

    /*
    subscribe(name, callback){
        if(!(name in this.subscribed_callbacks))
            this.subscribed_callbacks[name] = callback;
    }

    unsubscribe(name){
        delete this.subscribed_callbacks[name];
    }

    notify(name){
        if(this.subscribed_callbacks[name])
            this.subscribed_callbacks[name]();
    }
    */

    update(param, value){ // Actualizar un parametro
        this[param] = value;
        this.saveToLocalStorage();
    }

    clear(params){ // Borrar lista de parametros
        for(let i = 0; i < params.length; i++)
            this[params[i]] = null;
        if(params.includes("method"))
            this.method = "direct";
        if(params.includes("work_pattern"))
            this.work_pattern = "linear";
        this.saveToLocalStorage();
    }

    saveToLocalStorage(){ // Guardar datos en localStorage
        localStorage.setItem("campero_model"+version, JSON.stringify(this));
    }

    getFromLocalStorage(){ // Recuperar datos de localStorage
        const content = localStorage.getItem("campero_model"+version);
        if(content !== ""){
            let model = JSON.parse(content);
            if(model)
                Object.assign(this, model);
        }else{ 
            // Si no hay datos en localStorage, puede ser por cambio de version, entonces borrar todo
            localStorage.clear();
        }
    }

    clearLocalStorage(){ // Limpiar datos de localStorage
        localStorage.removeItem("campero_model"+version);
    }
}