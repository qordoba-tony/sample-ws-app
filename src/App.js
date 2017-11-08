import React, { Component } from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchToken, fetchSegments } from './actions';
import ContentEditable from './Editor';
import './App.css';

const Login = (props) => (
  <div className='login'>
    <button onClick={() => props.fetchToken()}>
      Login
    </button>
    <div className='fetch-token-desc'>
      Fetch token from Qordoba API
      <div>WS URL: <span className='url'>'wss://app.qordobatest.com/ws/websocket?token='</span> </div>
    </div>
  </div>
)

const Segment = (props) => (
  <div>
    { props.segment };
  </div>
)

class App extends Component {
  constructor(props) {
    super(props);
  }

  renderSegments(segments) {
    if (segments) {
      const segmentsArray = segments.map((segment) => {
        return (
          <li>
            <ContentEditable
              key={segment.segment_id}
              text={segment.translation}
            />
          </li>
        )
      })
      return segmentsArray
    }
  }

  render() {
    const { segmentsById } = this.props;
    console.log(this.props);
    return (
      <div className='app-div'>
      <div className='main-desc-container'>
        <ul className='desc-list'>
          <li>
            'Fetch token' button calls an action creator that:
            <ul>
              <li>Dispatches an action that fetches token from Qordoba API</li>
              <li>Action flows through custom WS middleware in './middlewares/websockets.js' file and establishes WS connection to Qordoba backend with URL <span className='url'>'wss://app.qordobatest.com/ws/websocket?token='</span></li>
                <ul>
                  <li>on socket.onopen(), the event handler sends a WS message through subscribeLiveUpdates() method which allows us to know when a segment has been updated</li>
                  <li>WS Identifier: <span className='url'>'/projects/:project_id/languages/:language_id/segments_live_updates'</span></li>
                </ul>
            </ul>
          </li>
          <li>
            'Fetch Segments' button calls an action creator that:
            <ul>
              <li>Dispatches an action object that flows through custom WS middleware</li>
              <li>Triggers fetchSegments() method to be called, requests segments through WS message with identifier <span className='url'>'/projects/:project_id/languages/:language_id/milestones/:milestone_id/editable'</span></li>
            </ul>
          </li>
        </ul>
      </div>
        { this.props.session.token ?
          <div>
            <button 
              className='token-header'
              onClick={() => this.props.fetchSegments()}
            >
              Fetch Segments
            </button>
            <div className='project-info'>
              WS Route Identifier:<span className='url'> '/projects/:project_id/languages/:language_id/milestones/:milestone_id/editable'</span>
            </div>
          </div> :
          <Login
            fetchToken={this.props.fetchToken}
          />
        }

        <ul className='segments-list'>
          { this.props.segmentsById ? this.renderSegments(segmentsById) : null }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  session: state.session,
  segments: state.segments.segments,
  segmentsById: Object.values(state.segments.byId),
});

export default connect(mapStateToProps, { fetchToken, fetchSegments })(App);
