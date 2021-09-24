import { App, View, f7 } from 'framework7-react';
import Home from './components/Home/index';
import Control from './components/Control/index';
import Velocity from './components/Velocity/index';
import Info from './components/Info/index';
import About from './components/About/index';
import './index.css';

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
            component: Home
        },
        { // Menu informativo
            path: '/info/', 
            component: Info,
            on:{pageInit: ()=>pushState("info")}
        },
        { // Seccion acerca de
            path: '/about/',
            component: About,
            on:{pageInit: ()=>pushState("about")}
        },
        { // Seccion de control
            path: '/control/',
            component: Control,
            on:{pageInit: ()=>pushState("control")}
        },
        { // Medicion de velocidad
            path: '/velocity/',
            component: Velocity,
            on:{pageInit: ()=>pushState("velocity")}
        },
        { // Calculo de insumos
            path: '/supplies/',
            //component: Supplies,
            on:{pageInit: ()=>pushState("supplies")}
        }
    ]
};

window.addEventListener("popstate",function(){
    // Control de regreso?
    f7.view.main.router.back();
}, false);

const Campero = () => (
    <App {...f7params}>
        <View main url="/" className="app"/>
    </App>
);

export default Campero;