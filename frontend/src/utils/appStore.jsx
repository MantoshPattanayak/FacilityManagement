import {configureStore} from "@reduxjs/toolkit";
import rootReducer from './rootReducer';

const appStore = configureStore( {
 //here add slice (storage)
 reducer: rootReducer,

    });
export default appStore;

