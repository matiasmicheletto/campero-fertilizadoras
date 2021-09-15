import { Page, Link, PageContent, Block } from 'framework7-react';
import classes from './Menu.module.css';
import logoInta from '../img/backgrounds/logoInta.png';
import logoMin from '../img/backgrounds/logomin.png';
import BackButton from './BackButton';

const InfoMenu = () => (
    <Page name="info" className={classes.InfoPage}>
        <PageContent>
            <Block style={{position:"absolute", bottom:"15%", width:"100%", textAlign: "center"}}>
                <div className="menu-button-container">
                    <Link href="/control/" className={classes.MenuButton}>
                        <p>Iniciar ayuda</p>
                    </Link>
                    <br />
                    <Link external rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/intaascasubi" className={[classes.MenuButton]}>
                        <p>Info técnica y novedades</p>
                    </Link>
                    <br />
                    <Link href="/about/" className={classes.MenuButton}>
                        <p>Acerca de</p>
                    </Link>
                </div>
                <BackButton to="/" gray/>
            </Block>
            <div className={classes.LogoFooter}>
                <img src={logoInta} height="80%" className={classes.LogoInta} alt="inta"/>
                <img src={logoMin} height="80%" className={classes.LogoMin} alt="ministerio"/>
            </div>            
        </PageContent>
    </Page>
);

export default InfoMenu;