import _ from 'lodash';
import { SET_TOKEN, FETCH_SEGMENTS_WS, SET_SEGMENTS, UPDATE_SEGMENT } from '../actions/types';
let savedToken, savedState, socket;

const sendHeartbeat = () => {
	const message = {
		identifier: 'heartbeat',
		message_id: _.uniqueId(),
	}

	socket.send(JSON.stringify(message));
}

/**
 * Subscribe to Live Updates Endpoint
 */
const subscribeLiveUpdates = () => {
  const projectId = 2023;
  const languageId = 246;

  const message = {
    'identifier': '/projects/:project_id/languages/:language_id/segments_live_updates',
    'message_id': _.uniqueId(),
    'message_type': 'subscribe',
    'params': {
      'project_id': projectId,
      'language_id': languageId
    }
  }

  console.log('SUBSCRIBING TO LIVE UDPATES ENDPOINT!');
  socket.send(JSON.stringify(message));
}

const fetchSegments = () => {
	// Fetch Segments Route:
	// /projects/:project_id/languages/:language_id/milestones/:milestone_id/editable

	const projectId = 2023;
	const languageId = 246;
	const milestoneId = 4519;
	const pageId = 413739;

	const message = {
		'identifier': '/projects/:project_id/languages/:language_id/milestones/:milestone_id/editable',
		'message_id': _.uniqueId(),
		'params': {
			'milestone_id': milestoneId,
			'language_id': languageId,
			'project_id': projectId,
		},
		'content': {
			'page_id': pageId,
		},
	}

	// Parse message to JSON object before sending to backend service
	socket.send(JSON.stringify(message));
}

const initializeWebsockets = ({ token, state, dispatch }) => {
	if ( !token || !state ) return;

	// Save our token and state from store to this file for WS connection
	savedToken = token;
	savedState = state;

	const url = `wss://app.qordobatest.com/ws/websocket?token=${token}`;
	socket = new WebSocket(url);

	socket.onopen = () => {
		sendHeartbeat();
		subscribeLiveUpdates();
	};

	socket.onmessage = (event) => {
		const { identifier, content } = JSON.parse(event.data);
		// console.log('EVENT.DATA', event.data);

		if (identifier !== 'heartbeat') {
			console.log('MESSAGE IDENTIFER:', identifier);
			console.log('CONTENT:', content);
		}

		if (identifier === 'heartbeat') {
			setTimeout(() => sendHeartbeat(), 2000);
		}

		// Dispatch action to update saved segment state
		if (identifier === '/projects/:project_id/languages/:language_id/save_segment') {
			console.log('Segment saved');
			dispatch({ type: UPDATE_SEGMENT, payload: content[0]})
		}

		if (identifier === '/projects/:project_id/languages/:language_id/milestones/:milestone_id/editable' && content.result === 'success') {
			console.log('SEGMENTS SET TO STATE');

			// Set segments into state if successful request
			dispatch({ type: SET_SEGMENTS, payload: content.segments });
		}
	}

	socket.onclose = () => {
    console.log('Lost connection!');
    console.log('Re-initializing websocket connection');
    if (socket.readyState !== 0 && socket.readyState !== 1) {
      setTimeout(() => initializeWebsockets({ token: savedToken, state: savedState, dispatch }), 2000);
    }
  }

}

const websocketMiddleware = (store) => (next) => (action) => {
	const { dispatch } = store;
	const state = store.getState();

	const token = state.session ? state.session.token : null;

	if (!socket && token) {
		initializeWebsockets({ token, state, dispatch });
	}

	switch (action.type) {
		case SET_TOKEN:
			const token = action.payload.token;
			initializeWebsockets({ token, state, dispatch });
			console.log('INITIALIZING WEBSOCKET!');
			break;
		case FETCH_SEGMENTS_WS:
			console.log('FETCHING SEGMENTS VIA WS!');
			fetchSegments();
			break;
		default:
			break;
	}

	return next(action);
}

export default websocketMiddleware;
