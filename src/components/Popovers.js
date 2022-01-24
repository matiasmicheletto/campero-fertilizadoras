import { useContext } from 'react';
import {Block, Row, Button} from 'framework7-react';
import { WalkthroughCtx } from '../context';

const Popovers = () => {
    const wlk = useContext(WalkthroughCtx);
    return (
        <>
            {
            wlk.steps.map(step => (
                <div className={`popover ios ${step.popover_el}`} key={step.key}>
                    <div className="popover-angle on-top" style={{left:"50%"}}></div>
                    <Block>
                        {step.text}
                    </Block>
                    <Row>
                        <Button popoverClose onClick={()=>wlk.finish()}>
                            Finalizar
                        </Button>
                        { (wlk.currentIndex < (wlk.steps.length-1)) &&
                        <Button popoverClose onClick={()=>wlk.next()}>
                            Siguiente
                        </Button>
                        }
                    </Row>
                </div>
            ))
            }
        </>
    );
};

export default Popovers;