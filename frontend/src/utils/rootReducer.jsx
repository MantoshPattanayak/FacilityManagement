// rootReducer.js
import { combineReducers } from 'redux';
import languageReducer from './languageSlice';

const rootReducer = combineReducers({
  language: languageReducer,
  // Add other reducers here if needed
});

export default rootReducer;
