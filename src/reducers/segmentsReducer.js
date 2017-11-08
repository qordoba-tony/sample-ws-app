import _ from 'lodash';
import { SET_SEGMENTS, UPDATE_SEGMENT } from '../actions/types';

const initialState = { segments: null, byId: {} };

const handleSetSegments = (state, segments) => {
	const newState = _.assign({}, state);

	newState.segments = segments;
	segments.forEach((segment) => {
		newState.byId[segment.segment_id] = segment;
	});
	return newState;
}

const handleUpdateSegment = (state, content) => {
	const newState = _.assign({}, state);
	console.log('NEW STATE', content, newState);
	const segmentId = content.translation_id
	const newTranslation = content.translation;
	console.log('SEGMENT UPDATED', newState.byId[segmentId]);

	newState.byId[segmentId].translation = newTranslation;
	console.log('UPDATING SEGMENT FROM STATE & newTranslation', newTranslation);
	return newState;
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_SEGMENTS:
			return handleSetSegments(state, action.payload);
		case UPDATE_SEGMENT:
			return handleUpdateSegment(state, action.payload);
		default:
			return state;
	}
};
