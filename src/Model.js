export default class CamperoModel {
    constructor(){
        // Variables de dosificacion
        this.dose = null; // Dosis deseada
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

        // Lista de errores por codigo
        this.error_messages = [ 
            "ok", // 0
            "Debe indicar la dosis deseada", // 1
            "Debe indicar el ancho de labor", // 2
            "Debe indicar la distancia recorrida", // 3
            "Debe indicar el tiempo de medición", // 4
            "Debe indicar la velocidad", // 5
            "Debe indicar el peso recolectado", // 6
            "Debe indicar la superficie de bandeja", // 7
            "Debe indicar la distancia entre bandejas", // 8
            "Debe indicar la cantidad de bandejas", // 9
            "Debe indicar la cantidad de pasadas", // 10
            "El ancho de labor indicado es inválido", // 11
            "Patrón de trabajo incorrecto", // 12
            "Error en valores de peso recolectado", // 13
            "Debe indicar el área de trabajo", //14
            "Debe indicar un nombre de lote", //15
            "Debe indicar nombre/s de producto/s" //16
        ];
    }

    _invalid_numeric_input(name){ // Control de valor de parametros numericos
        if( typeof name !== "string" )
            return false;
        return this[name] === 0 || 
            this[name] === null || 
            this[name] === undefined || 
            isNaN(this[name]) ||
            typeof(this[name]) !== "number";
    }

    _invalid_string_input(name){ // Control de valor de parametros textuales
        if( typeof name !== "string" )
            return false;
        return this[name] === "" || typeof(this[name]) !== "string";
    }

    _dosif_valid_input() { // Control de los parametros para calculo de doficicacion
        if(this._invalid_numeric_input("dose"))
            return 1;
        if(this._invalid_numeric_input("work_width"))
            return 2;
        if(this._invalid_numeric_input("distance") && this.method === "direct")
            return 3;
        if(this._invalid_numeric_input("time") && this.method === "indirect")
            return 4;
        if(this._invalid_numeric_input("work_velocity") && this.method === "indirect")
            return 5;
        if(this._invalid_numeric_input("recolected"))
            return 6;
        return 0;
    }

    _distr_valid_input() { // Control de parametros para el calculo de distribucion
        if(this._invalid_numeric_input("tray_area"))
            return 7;
        if(this._invalid_numeric_input("tray_distance"))
            return 8;
        if(this._invalid_numeric_input("tray_number"))
            return 9;
        if(this._invalid_numeric_input("pass_number"))
            return 10;
        if(this._invalid_numeric_input("work_width"))
            return 11;
        if(this.work_pattern !== "linear" && this.work_pattern !== "circular")
            return 12;
        if(this.tray_data?.length !== this.tray_number)
            return 13;
        return 0;
    }

    _supplies_valid_input() { // Control de parametros para calculo de insumos
        if(this._invalid_numeric_input("work_area"))
            return 14;
        if(this._invalid_string_input("field_name"))
            return 15;
        if(this.products?.length < 1)
            return 16;
        return 0;
    }

    getRealDose() { // Dosis real
        const status_code = this._dosif_valid_input();
        if(status_code !== 0)
            return {
                status: "error",
                message: this.error_messages[status_code],
                dose: 0, 
                diffp: 0, 
                diffkg: 0 
            };

        if(this.method === "indirect")
            this.distance = this.work_velocity*10/36*this.time;

        // Calculo de outputs
        const calculateddose = this.recolected/this.distance/this.work_width*10000;
        return {
            status: "ok",
            dose: calculateddose, 
            diffp: (calculateddose-this.dose)/this.dose*100, 
            diffkg: calculateddose-this.dose 
        }   
    }

    getDensityFromRecolected(recolected) { // Kg/ha a partir de peso recolectado de bandejas
        if(this._invalid_numeric_input("pass_number") || this._invalid_numeric_input("tray_area"))
            return recolected;
        else
            return (recolected/this.pass_number/this.tray_area/10).toFixed(2);
    }

    getProfile() {// Perfil de fertilizacion
        const status_code = this._distr_valid_input();
        if(status_code !== 0)
            return {
                status: "error",
                message: this.error_messages[status_code],
                profile: [],
                overlap: 0,
                dose: 0,
                avg: 0,
                dst: 0,
                cv: 0
            };

        // Calcular el perfil
        const tw = this.tray_distance*this.tray_number; // Ancho de medicion
        const s = Math.floor(tw - this.work_width); // Solapamiento de arreglos
        const current_profile = [...this.tray_data];
        const n = this.tray_number;

        for(let i = 0; i < s; i++){
            if(this.work_pattern === "circular"){ // Patron circular
                current_profile[i] += this.tray_data[n-s+i];
                current_profile[n-1-i] += this.tray_data[s-i-1];
            }else{ // Ida y vuelta sobre la mano
                current_profile[i] += this.tray_data[s-i-1];
                current_profile[n-1-i] += this.tray_data[n-s+i];
            }
        }

        const sum = current_profile.reduce((a, b) => a + b, 0);
        const avg = sum / current_profile.length;
        const sqdiff = current_profile.map(x => Math.pow(x - avg, 2));
        const dst = Math.sqrt(sqdiff.reduce((a, b) => a + b, 0) / (current_profile.length-1));
        const dose = avg/this.pass_number/this.tray_area*10;
        const cv = dst/avg*100;
        
        return {
            status: "ok",
            profile: current_profile,
            overlap: s,
            dose: dose,
            avg: avg,
            dst: dst,
            cv: cv
        };
    }

    getSupplies() { // Calculo de insumos
        const status_code = this._supplies_valid_input();
        if(status_code !== 0)
            return {
                status: "error",
                message: this.error_messages[status_code]
            };

        const quantities = []
        for(let p in this.products)
            quantities.push(this.products[p].density*this.work_area);

        return {
            status: "ok",
            message: "",
            quantities: quantities
        };
    }
}