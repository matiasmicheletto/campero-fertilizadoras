import { Page, Link, PageContent, Block } from 'framework7-react';
import classes from '../Menus.module.css';
import control from '../../img/icons/control.png';
import supplies from '../../img/icons/calculador.png';
import reports from '../../img/icons/reportes.png';
import info from '../../img/icons/info.png';
import logoInta from '../../img/backgrounds/logoInta.png';
import logoMin from '../../img/backgrounds/logomin.png';
import logo from '../../img/icons/logo.png';

const Home = () => (
    <Page name="home" className={classes.HomePage}>
        <PageContent>
            <Block style={{textAlign: "center", marginBottom: "0px"}}>
                <img className="app-logo" src={logo} height="120px" width="120px" alt="logo"/>
            </Block>
            <Block style={{textAlign: "center", marginTop:"1px"}}>
                <h2 className={classes.Title}>CAMPERO</h2>
                <h3 className={classes.Subtitle}>Fertilizadoras</h3>
            </Block>
            <Block className={classes.ButtonContainer}>
                <Link href="/control/" className={classes.MenuButton}>
                    <img className={classes.HomeIcon} src={control} alt="control"/>
                    <p>Parámetros de <br/> fertilización</p>
                </Link>
                <Link href="/supplies/" className={[classes.MenuButton]}>
                    <img className={classes.HomeIcon} src={supplies} alt="supplies"/>
                    <p>Calculador de insumos</p>
                </Link>
                <Link href="/reports/" className={classes.MenuButton}>
                    <img className={classes.HomeIcon} src={reports} alt="reports"/>
                    <p>Reportes</p>
                </Link>
                <Link href="/info/" className={classes.MenuButton}>
                    <img className={classes.HomeIcon} src={info} alt="info"/>
                    <p>Información y ayuda</p>
                </Link>
            </Block>
            <div className={classes.LogoFooter}>
                <img src={logoInta} height="80%" className={classes.LogoInta} alt="inta"/>
                <img src={logoMin} height="80%" className={classes.LogoMin} alt="ministerio"/>
            </div>            
        </PageContent>
    </Page>
);

export default Home;