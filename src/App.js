import { App, View, f7 } from 'framework7-react';
import { App as CapApp } from '@capacitor/app';
import Home from './components/Home/index';
import Control from './components/Control/index';
import Velocity from './components/Velocity/index';
import Recolected from './components/Recolected/index';
import Info from './components/Info/index';
import About from './components/About/index';
import Supplies from './components/Supplies/index';
import SuppliesList from './components/SuppliesList/index';
import Reports from './components/Reports/index';
import ReportDetails from './components/ReportDetails';
import ReportsPanel from './components/ReportsPanel';
import ModelProvider from './Context';
import './index.css';
import { Capacitor } from '@capacitor/core';

/*
    CAMPERO Fertilizadoras
*/

// Navegacion
const pushState = page => window.history.pushState(null, null, page);

const f7params = {
    name: 'Campero Fertilizadoras',
    id: 'com.inta.campero',    
    dialog: {
        buttonOk: 'Aceptar',
        buttonCancel: 'Cancelar'
    },    
    routes: [
        { // Menu principal
            path: '/',
            component: Home,
            options: {
                transition: "f7-cover"        
            }
        },
        { // Menu informativo
            path: '/info/', 
            component: Info,
            on:{pageInit: ()=>pushState("info")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Seccion acerca de
            path: '/about/',
            component: About,
            on:{pageInit: ()=>pushState("about")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Seccion de parametros
            path: '/control/',
            component: Control,
            on:{pageInit: ()=>pushState("control")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Medicion de velocidad
            path: '/velocity/',
            component: Velocity,
            on:{pageInit: ()=>pushState("velocity")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Cronometro
            path: '/recolected/',
            component: Recolected,
            on:{pageInit: ()=>pushState("recolected")},
            options: {
                transition: "f7-cover"        
            }
        },
        
        { // Calculo de insumos
            path: '/supplies/',
            component: Supplies,
            on:{pageInit: ()=>pushState("supplies")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Lista de insumos
            path: '/suppliesList/',
            component: SuppliesList,
            on:{pageInit: ()=>pushState("suppliesList")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Lista de reportes
            path: '/reports/',
            component: Reports,
            on:{pageInit: ()=>pushState("reports")},
            options: {
                transition: "f7-cover"        
            }
        },
        { // Detalle de reporte
            path: '/reportDetails/:id',
            component: ReportDetails,
            on:{pageInit: ()=>pushState("reportDetails")},
            options: {
                transition: "f7-cover"        
            }
        }
    ]
};


if(Capacitor.isNativePlatform())
    CapApp.addListener('backButton', () => {
        // If main view, then exit
        if(f7.view.main.router.url === '/'){
            CapApp.exitApp();
        }else{
            f7.view.main.router.back();
        }
    });
else
    window.addEventListener("popstate", () => {    
        f7.view.main.router.back();
    }, false);

const Campero = () => (
    <App {...f7params}>
        <ModelProvider>
            <View main url="/" className="app"/>
            <ReportsPanel />
        </ModelProvider>
    </App>
);

export default Campero;