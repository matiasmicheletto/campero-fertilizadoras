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

        this.error_messages = { // Mensajes de error
            recolected: "Debe indicar el peso recolectado",
            distance: "Debe indicar la distancia recorrida",
            work_width: "Debe indicar el ancho de labor",
            expected_dose: "Debe indicar la dosis prevista",
            work_velocity: "Debe indicar la velocidad de trabajo",
            time: "Debe indicar el tiempo de medición",
            pass_number: "Debe indicar la cantidad de pasadas",
            tray_area: "Debe indicar el área de la bandeja",
            tray_data: "Debe indicar los datos recolectados",
            tray_number: "Debe indicar la cantidad de bandejas",
            tray_distance: "Debe indicar la distancia entre bandejas",
            work_pattern: "Debe indicar el patrón de trabajo",
            products: "La lista de productos tiene datos faltantes",
            work_area: "Debe indicar el área de trabajo"
        };
    }

    saveToLocalStorage(){ // Guardar datos en localStorage
        localStorage.setItem("campero_model", JSON.stringify(this));
    }

    getFromLocalStorage(){ // Recuperar datos de localStorage
        let model = JSON.parse(localStorage.getItem("campero_model"));
        Object.assign(this, model);
    }
}