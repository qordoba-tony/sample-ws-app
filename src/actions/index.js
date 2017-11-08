import { SET_TOKEN, FETCH_SEGMENTS_WS } from './types';

const loginPath = 'https://app.qordobatest.com/api/login'
// export const FILE_LIST_PATH = ({ projectId, languageId }) => `${BASE}/projects/${projectId}/languages/${languageId}/page_settings/search?limit=${LIMIT}&offset=${OFFSET}`;
// export const PROJECT_LIST_PATH = ({ organizationId }) => `${BASE}/organizations/${organizationId}/projects?limit=${LIMIT}&offset=${OFFSET}`;



export const fetchToken = () => (dispatch, getState, axios) => {
	console.log('FETCHING TOKEN!');
	return axios.put(loginPath, { username: 'may@qordoba.com', password: 'qpassfrontend25' }, { headers: { 'content-type': 'application/json' }})
		.then(({ data }) => {
			console.log('FETCHED TOKEN:', data);
			dispatch({ type: SET_TOKEN, payload: data });
		});
}

export const fetchSegments = () => ({ type: FETCH_SEGMENTS_WS });
