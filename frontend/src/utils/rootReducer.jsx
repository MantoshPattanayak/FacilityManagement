// rootReducer.js
import { combineReducers } from 'redux';
import languageReducer from './languageSlice';
import authReducer from './authSlice';
const rootReducer = combineReducers({
  auth: authReducer,  // here auth (Login and Logout)
  language: languageReducer,   // here (Odia, end luanage)
  // Add other reducers here if needed
});

export default rootReducer;
