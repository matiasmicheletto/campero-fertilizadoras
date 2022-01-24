import React, {createContext} from 'react';
import WalkthroughModel from '../Walkthrough';

const model = new WalkthroughModel();

export const WalkthroughCtx = createContext();

export const WalkthroughProvider = props => (
    <WalkthroughCtx.Provider value={model}>
        {props.children}
    </WalkthroughCtx.Provider>
);
