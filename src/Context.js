import React, {createContext} from 'react';
import CamperoModel from './Model';

export const ModelCtx = createContext();

const model = new CamperoModel();

const ModelProvider = props => (
    <ModelCtx.Provider value={model}>
        {props.children}
    </ModelCtx.Provider>
);

export default ModelProvider;