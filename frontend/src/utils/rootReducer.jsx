// rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './authSlice'; // Import your authentication slice

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here if needed
});

export default rootReducer;
//Combine Reducers: If you have multiple slices or reducers, combine them using combineReducers.