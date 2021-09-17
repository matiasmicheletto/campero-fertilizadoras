import { App, View } from 'framework7-react';
import About from './components/About';
import Control from './components/Control';
import Home from './components/Home';
import InfoMenu from './components/InfoMenu';

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
            component: InfoMenu
        },
        {
            path: '/about/',
            component: About
        },
        {
            path: '/control/',
            component: Control
        }
    ]
};

const viewStyle = {
    align:"center",
    maxWidth:"800px", 
    margin:"0 auto"
};

const Campero = () => (
    <App {...f7params}>
        <View main url="/" style={viewStyle}/>
    </App>
);


export default Campero;