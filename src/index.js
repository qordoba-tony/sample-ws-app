import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer from './reducers';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
import websocketMiddleware from './middlewares/websockets';

const middlewares = [
	thunk.withExtraArgument(axios),
	websocketMiddleware,
]

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('root'));
registerServiceWorker();
