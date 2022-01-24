import { generate_id } from "./Utils";
import { Storage } from '@capacitor/storage';
import { Capacitor } from "@capacitor/core";

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
        // Variables que no intervienen en los calculos
        this.gear = null; // Regulacion de la maquina
        this.main_prod = null; // Nombre de producto
        this.prod_density = null; // Densidad de fertilizante
        // Variables de dosificacion
        this.expected_dose = null; // Dosis prevista
        this.effective_dose = null; // Dosis efectiva
        this.expected_work_width = null; // Ancho de labor inicial
        this.recolected = null; // Peso total recolectado
        this.time = null;  // Tiempo de muestreo      
        this.work_velocity = null; // Velocidad de trabajo
        this.work_width = null; // Ancho de labor
        this.distance = null; // Distancia recorrida
        this.method = "direct"; // Uso de velocidad (directa/indirecta)
        
        // Variables de distribucion
        this.fitted_dose = null; // Dosis ajustada
        this.fitted_work_width = null; // Dosis ajustada
        this.tray_data = []; // Peso recolectado de bandejas
        this.tray_distance = null; // Distancia entre bandejas
        this.tray_number = null; // Cantidad de bandejas (= a tray_data.length)
        this.tray_area = null; // Area de bandeja
        this.pass_number = null; // Cantidad de pasadas
        this.work_pattern = "linear"; // Patron de trabajo, "circular" o "linear"        
        
        // Variables de insumos
        this.work_area = null; // Superficie de lote
        this.field_name = null; // Nombre del lote
        this.capacity = null; // Capacidad de la fertilizadora
        this.products = []; // Lista de prductos
        this.quantities = []; // Cantidades de productos
        this.load_number = null; // Numero de cargas
        this.eq_load_weight = null; // Carga equilibrada

        // Reportes
        this.reports = [];
        this.currentReport = get_blank_report();

        this.getFromLocalStorage();
    }


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
        const key = "campero_model"+version;
        const value = JSON.stringify(this);
        if(Capacitor.isNativePlatform())
            Storage.set({key, value});
        else
            localStorage.setItem(key, value);
    }

    getFromLocalStorage(){ // Recuperar datos de localStorage
        if(Capacitor.isNativePlatform())
            Storage.get({key: "campero_model"+version}).then(result => {
                if(result.value)
                    Object.assign(this, JSON.parse(result.value));
                else{
                    console.log("Nueva version de CamperoModel");
                    Storage.clear();
                }
            });
        else{
            const content = localStorage.getItem("campero_model"+version);
            if(content){
                const model = JSON.parse(content);
                if(model)
                    Object.assign(this, model);
            }else{ 
                // Si no hay datos en localStorage, puede ser por cambio de version, entonces borrar todo
                console.log("Nueva version de CamperoModel");
                localStorage.clear();
            }
        }
    }

    clearLocalStorage(){ // Limpiar datos de localStorage
        const key = "campero_model"+version;
        if(Capacitor.isNativePlatform())
            Storage.remove({key});
        else
            localStorage.removeItem(key);
    }


    /// Reportes

    addDoseToReport({dose, diffkg, diffp}) {
        this.currentReport.dose = {
            gear: this.gear,
            prod_density: this.prod_density,
            work_width: this.work_width,
            recolected: this.recolected,
            method: this.method,
            distance: this.distance,
            time: this.time,
            work_velocity: this.work_velocity,
            expected_dose: this.expected_dose,
            effective_dose: dose,
            diffkg: diffkg,
            diffp: diffp
        };
        this.currentReport.completed.dose = true;
    }

    addDistributionToreport({fitted_dose, avg, cv}) {
        this.currentReport.distr = {
            tray_area: this.tray_area,
            tray_distance: this.tray_distance,
            tray_number: this.tray_number,
            pass_number: this.pass_number,
            work_pattern: this.work_pattern,
            work_width: this.work_width,
            fitted_dose: fitted_dose,
            avg: avg,
            cv: cv
        };
        this.currentReport.completed.distribution = true;        
    }

    addSuppliesToReport(results) {
        if(results.field_name.length > 1)
            this.currentReport.name = results.field_name;
        this.currentReport.supplies = results;
        this.currentReport.completed.supplies = true;        
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