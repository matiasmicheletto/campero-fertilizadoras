import { generate_id } from "./Utils";

const version = '0.0.3'; // Ante cualquier cambio en el modelo, se debe incrementar la version

const get_blank_report = () => {
    return {
        id: generate_id(),
        name: "Sin nombre",
        dose:{},
        distr: {},
        supplies: {},
        completed: {
            dose: false,
            distribution: false,
            supplies: false
        },
        selected: false // Esto se usa en la vista de listado
    };
};

export default class CamperoModel {
    constructor(){
        // Variables de dosificacion
        this.expected_dose = null; // Dosis prevista
        this.effective_dose = null; // Dosis efectiva
        this.initial_work_width = null; // Ancho de labor inicial
        //this.fitted_dose = null; // Dosis ajustada
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

        // Reportes
        this.reports = [];
        this.currentReport = get_blank_report();

        this.getFromLocalStorage();

        //this.subscribed_callbacks = {};
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

    /// Control de parametros 

    update(param, value){ // Actualizar uno o mas parametros
        let updated = false;
        if(typeof param === "string"){
            this[param] = value;
            updated = true;
        }
        if(typeof param === "object" && typeof value === "undefined"){
            Object.assign(this, param);
            updated = true;
        }
        if(updated)
            this.saveToLocalStorage();
        else 
            console.log("Error: no se pudo actualizar el modelo");
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


    /// Persistencia de parametros

    saveToLocalStorage(){ // Guardar datos en localStorage
        localStorage.setItem("campero_model"+version, JSON.stringify(this));
    }

    getFromLocalStorage(){ // Recuperar datos de localStorage
        const content = localStorage.getItem("campero_model"+version);        
        if(content){
            const model = JSON.parse(content);
            if(model)
                Object.assign(this, model);
        }else{ 
            // Si no hay datos en localStorage, puede ser por cambio de version, entonces borrar todo
            console.log("Nueva version de CamperoModel, bienvenido!");
            localStorage.clear();
        }
    }

    clearLocalStorage(){ // Limpiar datos de localStorage
        localStorage.removeItem("campero_model"+version);
    }


    /// Reportes

    addDoseToReport(results) {
        this.currentReport.dose = {
            gear: this.gear,
            work_width: this.work_width,
            recolected: this.recolected,
            method: this.method,
            distance: this.distance,
            time: this.time,
            work_velocity: this.work_velocity,
            expected_dose: this.expected_dose,
            effective_dose: results.dose,
            diffkg: results.diffkg,
            diffp: results.diffp
        };
        this.currentReport.completed.dose = true;
        console.log(this.currentReport);
    }

    addDistributionToreport(results) {
        this.currentReport.distr = {
            tray_area: this.tray_area,
            tray_distance: this.tray_distance,
            tray_number: this.tray_number,
            pass_number: this.pass_number,
            work_pattern: this.work_pattern,
            work_width: this.work_width,
            fitted_dose: results.fitted_dose,
            avg: results.avg,
            cv: results.cv
        };
        this.currentReport.completed.distribution = true;
        console.log(this.currentReport);
    }

    addSuppliesToReport(results) {
        if(results.field_name.length > 1)
            this.currentReport.name = results.field_name;
        this.currentReport.supplies = results;
        this.currentReport.completed.supplies = true;
        console.log(this.currentReport);
    }

    getReport(id){
        const index = this.reports.findIndex(report => report.id === id);
        return index !== -1 ? this.reports[index] : null;
    }

    saveReport(){ // Guardar (finalizar) reporte
        this.currentReport.timestamp = Date.now();
        this.reports.push(this.currentReport);
        this.clearReport();
    }

    clearReport(){ // Limpiar reporte actual
        this.currentReport = get_blank_report();
        this.saveToLocalStorage();
    }

    renameReport(id, name){
        const index = this.reports.findIndex(report => report.id === id);
        if(index !== -1){
            this.reports[index].name = name;
            this.saveToLocalStorage();
            return {
                status: "success"
            };
        }else{
            return {
                status: "error",
                message: "Problema al renombrar reporte"
            };
        }
    }

    deleteReport(id){
        const index = this.reports.findIndex(report => report.id === id);
        if(index !== -1){
            this.reports.splice(index, 1);
            this.saveToLocalStorage();
            return {
                status: "success"
            };
        }else{
            return {
                status: "error",
                message: "No se encontró el reporte"
            };
        }
    }
}