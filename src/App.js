import { App, View } from 'framework7-react';
import About from './components/About';
import Home from './components/Home';

const f7params = {
    name: 'Campero Fertilizadoras',
    id: 'com.inta.campero',
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/about/',
            component: About
        }
    ]
};

const Campero = () => {
    return (
        <App {...f7params}>
          <View main url="/" />
        </App>
    );
};

export default Campero;