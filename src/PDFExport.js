

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from 'moment';
import Toast from './components/Toast';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
//import { Share } from '@capacitor/share';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { logoCAMPERO, membreteCAMPERO } from './img/base64';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const styles = { // Definicion de estilos de las secciones del reporte
    header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 15] //[left, top, right, bottom]
    },
    subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 10]
    },
    section: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10]
    },
    text: {
        fontSize: 12,
        bold: false,
        margin: [0, 3, 0, 3]
    },
    tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
    }
};

const reportHeader = { // Lo que aparece en cada pagina
    image: logoCAMPERO, // Logo campero base64
    width: 50,
    margin: [10,10,10,10],
    alignment: "right"
};

const reportFooter = {
    image: membreteCAMPERO, // Membrete campero base64
    width: 350,
    margin: [15,10,10,10],
    alignment: "left"
};

const workPattern = {
    linear: "Ida y vuelta",
    circular: "En círculos"
};

const PDFExport = report => {
    //console.log(report);

    const reportContent = [ // Composicion de todo el documento
        {
            text: "Campero Fertilizadoras",
            style: "header"
        },
        {
            text: "Reporte de la labor",
            style: "subheader"
        },
        {
            text: "   Nombre: " + report.name,
            style: "subheader"
        },
        {
            text: "   Fecha y hora: " + moment(report.timestamp).format("DD/MM/YYYY HH:mm"),
            style: "subheader"
        }
    ];

    if (report.completed.dose) {
        reportContent.push({
            text: "Parámetros de fertilización",
            style: "section"
        });
        reportContent.push({
            layout: 'lightHorizontalLines',
            table: {
                headerRows: 0,
                widths: ['*', '*'],
                body: [
                    [{
                        text: "Cambio:",
                        style: "tableHeader"
                    }, report.dose.gear ? report.dose.gear : "N/A"],
                    [{
                        text: "Ancho de labor:",
                        style: "tableHeader"
                    }, report.dose.work_width.toFixed(2) + " m"],
                    [{
                        text: "Peso recolectado:",
                        style: "tableHeader"
                    }, report.dose.recolected.toFixed(2) + " kg"],
                    [
                        {
                            text: report.dose.method === "direct" ? "Distancia" : "Velocidad/tiempo",
                            style: "tableHeader"
                        }, report.dose.method === "direct" ? 
                            (report.dose.distance.toFixed(2)+" m") 
                            : 
                            (report.dose.work_velocity.toFixed(2)+" km/h -- "+report.dose.time.toFixed(2) + " seg")
                    ],
                    [{
                        text: "Dosis prevista",
                        style: "tableHeader"
                    }, report.dose.expected_dose.toFixed(2) + " kg/ha"],
                    [{
                        text: "Dosis efectiva:",
                        style: "tableHeader"
                    }, report.dose.effective_dose.toFixed(2) + " kg/ha"],
                    [{
                        text: "Diferencia",
                        style: "tableHeader"
                    }, report.dose.diffkg?.toFixed(2) + " kg (" + report.dose.diffp?.toFixed(2) + "%)"]
                ]
            },
            margin: [0, 0, 0, 15]
        });
    }

    if (report.completed.distribution) {

        console.log(report.distr);

        reportContent.push({
            text: "Distribución y ancho de labor",
            style: "section"
        });
        reportContent.push({
            layout: 'lightHorizontalLines',
            table: {
                headerRows: 0,
                widths: ['*', '*'],
                body: [
                    [{
                        text: "Dosis ajustada",
                        style: "tableHeader"
                    }, report.distr.fitted_dose.toFixed(2) + " kg/ha"],
                    [{
                        text: "Coeficiente de variación",
                        style: "tableHeader"
                    }, report.distr.cv.toFixed(2) + " %"],
                    [{
                        text: "Patrón de trabajo",
                        style: "tableHeader"
                    }, workPattern[report.distr.work_pattern]],
                    [{
                        text: "Ancho de labor ajustado",
                        style: "tableHeader"
                    }, report.distr.work_width + " m"],
                    [{
                        text: "Superficie de bandeja",
                        style: "tableHeader"
                    }, report.distr.tray_area.toFixed(2) + " m²"],
                    [{
                        text: "Cantidad de bandejas",
                        style: "tableHeader"
                    }, report.distr.tray_number],
                    [{
                        text: "Distancia entre bandejas",
                        style: "tableHeader"
                    }, report.distr.tray_distance.toFixed(2) + " m"],
                    [{
                        text: "Cantidad de pasadas",
                        style: "tableHeader"
                    }, report.distr.pass_number]
                    /*[{
                        text: "Promedio peso recolectado",
                        style: "tableHeader"
                    }, report.distr.avg.toFixed(2) + " gr"],*/
                ]
            },
            margin: [0, 0, 0, 15]
        });
    }

    if (report.completed.supplies) {
        reportContent.push({
            text: "Cálculo de insumos",
            style: "section"
        });
        reportContent.push({
            text: "Lote: " + report.supplies.field_name,
            style: "text"
        });
        reportContent.push({
            text: "Superficie: " + report.supplies.work_area + " ha",
            style: "text"
        });
        if(report.supplies.capacity){
            reportContent.push({
                text: "Capacidad de carga: " + report.supplies.capacity.toFixed(2) + " kg",
                style: "text"
            });
            reportContent.push({
                //text: "Cantidad de cargas: "+report.supplies.uneq_load.number+report.supplies.uneq_load.separator+report.supplies.uneq_load.fraction+report.supplies.eq_load,
                text: "Cantidad de cargas: "+report.supplies.eq_load,
                style: "text"
            });
        }

        const rows = [
            [
                {
                    text: "Producto",
                    style: "tableHeader"
                },
                {
                    text: "Dosis",
                    style: "tableHeader"
                },
                {
                    text: "Total",
                    style: "tableHeader"
                }
            ]
        ];

        report.supplies.products.forEach((prod, index) => {
            rows.push([
                prod.name,
                prod.density.toFixed(2) + " kg/ha",
                prod.presentation === 0 ?
                    report.supplies.quantities[index].toFixed(2) + " kg" :
                    Math.ceil(report.supplies.quantities[index]) + " envases de " + prod.presentation + " kg"
            ]);
        });

        reportContent.push({
            layout: 'lightHorizontalLines',
            table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: rows
            },
            margin: [0, 0, 0, 15]
        });
    }

    const document = { // Documento
        header: reportHeader,
        footer: reportFooter,
        content: reportContent,
        styles: styles
    };

    // Generar y guardar
    const fileName = "Reporte Campero Fertilizadoras "+moment(report.timestamp).format("DD-MM-YYYY HH-mm")+".pdf";    
    const pdfFile = pdfMake.createPdf(document);

    if(Capacitor.isNativePlatform()){
        
        const shareFile = (fileName, data) => {
            /*
            Filesystem.getUri({
                path: fileName,
                directory: Directory.Documents
            }).then(res => { 
                console.log("Compartiendo archivo: "+res.uri);
                Share.share({
                    title: "Reporte Campero Fertilizadoras",                            
                    url: res.uri
                }).then(shareResult => {
                    console.log(shareResult.activityType);
                    Toast("success", "Reporte enviado a "+shareResult.activityType, 2000, "center");
                }).catch(err => {
                    console.log("Error al compartir: "+JSON.stringify(err))
                    Toast("error", "Error al compartir reporte", 2000, "center");
                });
            }).catch(err => {
                console.log("Error abriendo reporte: "+JSON.stringify(err));
                Toast("error", "Error al abrir reporte", 2000, "center");
            });
            */
            FileSharer.share({
                filename: fileName,
                base64Data: data,
                contentType: "application/pdf",
            }).then(() => {
                Toast("success", "Reporte compartido", 2000, "center");
            }).catch(error => {
                console.error("Error FileSharer: "+error.message);
                Toast("error", "Error al compartir reporte", 2000, "center");
            });
        };

        const saveFile = fileName => {            
            pdfFile.getBase64(base64pdf => {                                
                Filesystem.writeFile({
                    data: base64pdf,
                    path: fileName,
                    directory: Directory.Documents,                    
                    replace: true
                }).then(() => {                    
                    Toast("success", "Reporte guardado en Documentos: "+fileName, 2000, "center");                    
                    shareFile(fileName, base64pdf);
                }).catch(err => {
                    console.log(err);
                    Toast("error", "Error al guardar el reporte", 2000, "center");
                });
            });
        };

        Filesystem.checkPermissions().then(permissions => {                        
            if(permissions.publicStorage === "granted"){ 
                saveFile(fileName);
            }else{
                Toast("info", "Permisos de almacenamiento no otorgados", 2000, "center");
                Filesystem.requestPermissions().then(res => {
                    console.log(res);
                    saveFile(fileName);
                }).catch(() => {
                    console.log("No se pudo guardar el reporte");
                });
            }
        });
    }else{
        pdfFile.download(fileName);
    }
};

export default PDFExport;