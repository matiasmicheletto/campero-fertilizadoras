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
            "Debe indicar la cantidad de pasadas" // 10
        ];
    }

    invalidInput(name){        
        return this[name] === 0 || 
            this[name] === null || 
            this[name] === undefined || 
            isNaN(this[name]) ||
            typeof(this[name]) !== "number";
    }

    dosif_valid_input() { 
        if(this.invalidInput("dose"))
            return 1;
        if(this.invalidInput("work_width"))
            return 2;
        if(this.invalidInput("distance") && this.method === "direct")
            return 3;
        if(this.invalidInput("time") && this.method === "indirect")
            return 4;
        if(this.invalidInput("work_velocity") && this.method === "indirect")
            return 5;
        if(this.invalidInput("recolected"))
            return 6;
        return 0;
    }

    distr_valid_input() {
        if(this.invalidInput("tray_area"))
            return 7;
        if(this.invalidInput("tray_distance"))
            return 8;
        if(this.invalidInput("tray_number"))
            return 9;
        if(this.invalidInput("pass_number"))
            return 10;
        return 0;
    }

    getRealDose() { // Dosis real
        const status_code = this.dosif_valid_input();
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

    getProfile(ww, pattern) {// Perfil de fertilizacion
        const status_code = this.distr_valid_input();
        if(status_code !== 0)
            return {
                status: "error",
                message: this.error_messages[status_code]
            };
        
        if(typeof ww !== "number" || (pattern!=="circular" && pattern!=="linear"))
            return {
                status: "error",
                message: "Ancho de labor y/o patrón de trabajo incorrectos"
            };

        // Calcular el perfil
        const tw = this.tray_distance*this.tray_number; // Ancho de medicion
        const s = Math.floor(tw - ww); // Solapamiento de arreglos
        const current_profile = [...this.tray_data];
        const n = this.tray_number;

        for(let i = 0; i < s; i++){
            if(pattern === "circular"){ // Patron circular
                current_profile[i] += this.tray_data[n-s+i];
                current_profile[n-1-i] += this.tray_data[s-i-1];
            }else{ // Ida y vuelta sobre la mano
                current_profile[i] += this.tray_data[s-i-1];
                current_profile[n-1-i] += this.tray_data[n-s+i];
            }
        }
        
        return {
            status: "ok",
            profile: current_profile,
            overlap: s
        };
    }
}