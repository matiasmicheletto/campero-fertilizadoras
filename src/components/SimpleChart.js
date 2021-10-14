import React, { useEffect } from 'react';
import Highcharts from 'highcharts';


const SimpleChart = props => {

    const config = {
        chart: {
            type: props.config.type,
            height: "100%"
        },
        title: {
            text: props.config.title
        },        
        credits:{
            enabled:false
        },
        xAxis: {
            categories: props.config.categories,
            crosshair: true            
        },
        yAxis: {
            min: 0,
            labels: {
                formatter: function() {
                    var label = this.axis.defaultLabelFormatter.call(this);                    
                    return props.config.label_formatter ? props.config.label_formatter(label) : label;                    
                }
            },
            title: {
                text: props.config.yaxis
            }
        },        
        tooltip: {
            headerFormat: '<span style="font-size:10px">'+props.config.tooltip_prepend+'{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}'+props.config.tooltip_append+'</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            bar: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: props.config.series
    }

    useEffect(()=>{
        Highcharts.chart(props.id, config);
    });

    return (
        <figure style={{margin:0}}>
            <div id={props.id}></div>                
        </figure>
    );
}

export default SimpleChart;