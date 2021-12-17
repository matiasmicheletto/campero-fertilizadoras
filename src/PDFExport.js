

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from 'moment';
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
    console.log(report);

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

    var document = { // Documento
        header: reportHeader,
        footer: reportFooter,
        content: reportContent,
        styles: styles
    };

    // Generar y guardar
    var fileName = "Reporte Campero Fertilizadoras "+moment(report.timestamp).format("DD-MM-YYYY HH-mm")+".pdf";
    var pdfFile = pdfMake.createPdf(document);
    pdfFile.download(fileName);
};

export default PDFExport;