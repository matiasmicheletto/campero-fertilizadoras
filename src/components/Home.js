import { Page, Button, PageContent, Block } from 'framework7-react';
import classes from './Home.module.css';
import control from '../img/icons/control.png';
import calculador from '../img/icons/calculador.png';
import reportes from '../img/icons/reportes.png';
import info from '../img/icons/info.png';
import logoInta from '../img/backgrounds/logoInta.png';
import logoMin from '../img/backgrounds/logomin.png';
import logo from '../img/icons/logo.jpg';

const Home = () => {
    return (
        <Page name="home" className={classes.HomePage}>
            <PageContent>
                <Block style={{textAlign: "center", marginBottom: "0px"}}>
                    <img className="app-logo" src={logo} height="120px" width="120px" alt="logo"/>
                </Block>
                <Block style={{textAlign: "center", marginTop:"1px"}}>
                    <h2 className={classes.Title}>CAMPERO</h2>
                    <h3 className={classes.Subtitle}>Fertilizadoras</h3>
                </Block>
                <Block style={{position:"absolute", bottom:"15%", width:"100%", textAlign: "center"}}>
                    <div className="menu-button-container">
                        <Button raised className={classes.MenuButton}>
                            <img className={classes.HomeIcon} src={control} alt="control"/>
                            <p>Control de fertilización</p>
                        </Button>
                        <Button raised className={[classes.MenuButton]}>
                            <img className={classes.HomeIcon} src={calculador} alt="calculador"/>
                            <p>Calculador de insumos</p>
                        </Button>
                        <Button raised className={classes.MenuButton}>
                            <img className={classes.HomeIcon} src={reportes} alt="reportes"/>
                            <p>Reportes</p>
                        </Button>
                        <Button raised className={classes.MenuButton}>
                            <img className={classes.HomeIcon} src={info} alt="info"/>
                            <p>Información y ayuda</p>
                        </Button>
                    </div>
                </Block>
                <div className={classes.LogoFooter}>
                    <img src={logoInta} height="80%" className={classes.LogoInta} alt="inta"/>
                    <img src={logoMin} height="80%" className={classes.LogoMin} alt="ministerio"/>
                </div>            
            </PageContent>
        </Page>
    )
};

export default Home;