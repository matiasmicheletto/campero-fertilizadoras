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
        this.current_profile = []; // Ultimo perfil calculado (para graficar)
    }

    invalidInput(name){        
        return this[name] === 0 || 
            this[name] === null || 
            this[name] === undefined || 
            isNaN(this[name]) ||
            typeof(this[name]) !== "number";
    }

    getRealDose() { // Dosis real
        if(this.invalidInput("dose"))
            return {
                status: "error",
                message: "Debe indicar la dosis deseada"
            };
        if(this.invalidInput("work_width"))
            return {
                status: "error",
                message: "Debe indicar el ancho de labor"
            };
        if(this.invalidInput("distance") && this.method === "direct")
            return {
                status: "error",
                message: "Debe indicar la distancia recorrida"
            };
        if(this.invalidInput("time") && this.method === "indirect")
            return {
                status: "error",
                message: "Debe indicar el tiempo de medición"
            };
        if(this.invalidInput("work_velocity") && this.method === "indirect")
            return {
                status: "error",
                message: "Debe indicar la velocidad"
            };
        if(this.invalidInput("recolected"))
            return {
                status: "error",
                message: "Debe indicar el peso recolectado"
            };
        if(this.method === "indirect")
            this.distance = this.work_velocity*10/36*this.time;
        
        //console.log(this.dose, this.distance, this.time, this.work_velocity, this.recolected, this.method);

        // Calculo de outputs
        const calculateddose = this.recolected/this.distance/this.work_width*10000;
        return {            
            status: "ok",
            dose: calculateddose, 
            diffp: (calculateddose-this.dose)/this.dose*100, 
            diffkg: calculateddose-this.dose 
        }   
    }

    getProfile(ww) {// Perfil de fertilizacion
        if(this.invalidInput("tray_area"))
            return {
                status: "error",
                message: "Debe indicar la superficie de bandeja"
            }
        if(this.invalidInput("tray_distance"))
            return {
                status: "error",
                message: "Debe indicar la distancia entre bandejas"
            }
        if(this.invalidInput("tray_number"))
            return {
                status: "error",
                message: "Debe indicar la cantidad de bandejas"
            }
        if(this.invalidInput("pass_number"))
            return {
                status: "error",
                message: "Debe indicar la cantidad de pasadas"
            }

        // Calcular el perfil
        const tw = this.tray_distance*this.tray_number; // Ancho de medicion
        const s = Math.floor(tw - ww); // Solapamiento de arreglos
        this.current_profile = [...this.tray_data];
        const n = this.tray_number;

        console.log(this.tray_data);
        console.log(this.tray_distance, this.tray_area, this.tray_number)
        console.log(tw, s, n);

        for(let i = 0; i < s; i++){
            if(this.work_pattern === "circular"){ // Patron circular
                this.current_profile[i] += this.tray_data[n-1-i];
                this.current_profile[n-1-i] += this.tray_data[i];
            }else{ // Ida y vuelta sobre la mano
                this.current_profile[i] += this.tray_data[s-1-i];
                this.current_profile[n-1-i] += this.tray_data[n-s-1];
            }
        }
        
        return {
            status: "ok",
            profile: this.current_profile
        };
    }
}