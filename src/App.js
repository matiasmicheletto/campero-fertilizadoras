import { App, View } from 'framework7-react';
import AboutMenu from './components/AboutMenu';
import Menu from './components/Menu';

const f7params = {
    name: 'Campero Fertilizadoras',
    id: 'com.inta.campero',
    routes: [
        {
            path: '/',
            component: Menu
        },
        {
            path: '/about/',
            component: AboutMenu
        }
    ]
};

const Campero = () => {
    return (
        <App {...f7params}>
          <View main url="/">
            <Menu />
          </View>
        </App>
    );
};

export default Campero;