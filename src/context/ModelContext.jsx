import React, {createContext} from 'react';
import CamperoModel from '../Model';

const model = new CamperoModel();

export const ModelCtx = createContext();

export const ModelProvider = props => (
    <ModelCtx.Provider value={model}>
        {props.children}
    </ModelCtx.Provider>
);

