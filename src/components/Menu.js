import { Page, Link } from 'framework7-react';
import React from 'react';

const Menu = () => {

    return (
        <Page name="home">
            <h4>Menú principal Campero</h4>
            <Link href="/about/">Acerca de</Link>            
        </Page>
    )
};

export default Menu;