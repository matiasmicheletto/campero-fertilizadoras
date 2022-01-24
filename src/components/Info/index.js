import { useContext } from 'react';
import { Page, Link, PageContent, Block } from 'framework7-react';
import classes from '../Menus.module.css';
import logoInta from '../../img/backgrounds/logoInta.png';
import logoMin from '../../img/backgrounds/logomin.png';
import { BackButton } from '../Buttons';
import { WalkthroughCtx } from '../../context';


const Info = props => {

    const wlk = useContext(WalkthroughCtx);

    return (
        <Page name="info" className={classes.InfoPage}>
            <PageContent>
                <Block className={classes.ButtonContainer}>
                    <Link className={classes.MenuButton} onClick={()=>wlk.start()}>
                        <p>Iniciar ayuda</p>
                    </Link>
                    <Link external rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/intaascasubi" className={[classes.MenuButton]}>
                        <p>Info técnica y novedades</p>
                    </Link>
                    <Link href="/about/" className={classes.MenuButton} style={{marginBottom:"20px"}}>
                        <p>Acerca de</p>
                    </Link>                                
                    <BackButton {...props} gray/>
                </Block>  
                
                <div className={classes.LogoFooter}>
                    <img src={logoInta} height="80%" className={classes.LogoInta} alt="inta"/>
                    <img src={logoMin} height="80%" className={classes.LogoMin} alt="ministerio"/>
                </div>            
            </PageContent>
        </Page>
    );
};

export default Info;