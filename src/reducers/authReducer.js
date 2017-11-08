import _ from 'lodash';
import { SET_TOKEN } from '../actions/types';

const initialState = { token: null };

const handleSetSession = (state, session) => {
	const newState = _.assign({}, state);

	newState.token = session.token;
	newState.user = session.loggedUser;
	return newState;
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_TOKEN:
			return handleSetSession(state, action.payload);
		default:
			return initialState;
	}
}
