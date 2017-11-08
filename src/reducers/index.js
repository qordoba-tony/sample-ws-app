import { combineReducers } from 'redux';
import authReducer from './authReducer';
import segmentsReducer from './segmentsReducer';

const rootReducer = combineReducers({
	session: authReducer,
	segments: segmentsReducer,
});

export default rootReducer;
