import { App, View, f7 } from 'framework7-react';
import About from './components/About';
import Control from './components/Control';
import Home from './components/Home';
import InfoMenu from './components/InfoMenu';

/*
    CAMPERO Fertilizadoras
*/

// Navegacion
const pushState = page => window.history.pushState(null, null, page);

const f7params = {
    name: 'Campero Fertilizadoras',
    id: 'com.inta.campero',    
    routes: [
        {
            path: '/',            
            component: Home
        },
        {
            path: '/info/',            
            component: InfoMenu,
            on:{pageInit: ()=>pushState("info")}
        },
        {
            path: '/about/',
            component: About,
            on:{pageInit: ()=>pushState("about")}
        },
        {
            path: '/control/',
            component: Control,
            on:{pageInit: ()=>pushState("control")}
        }
    ]
};

window.addEventListener("popstate",function(){
    f7.view.main.router.back();
}, false);

// Estilo mobile+browser
const mainViewStyle = {
    align: "center",
    maxWidth: "800px", 
    margin: "0 auto"
};

const Campero = () => (
    <App {...f7params}>
        <View main url="/" style={mainViewStyle}/>
    </App>
);

export default Campero;