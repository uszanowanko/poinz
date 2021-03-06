import axios from 'axios';
import log from 'loglevel';

import hub from '../services/hub';
import history from '../services/getBrowserHistory';
import appConfig from '../services/appConfig';

import {
  LOCATION_CHANGED,
  TOGGLE_BACKLOG,
  TOGGLE_USER_MENU,
  TOGGLE_LOG,
  EDIT_STORY,
  CANCEL_EDIT_STORY,
  STATUS_FETCHED,
  SET_LANGUAGE,
  EVENT_RECEIVED,
  EVENT_ACTION_TYPES
} from './types';

/**
 * store current pathname in our redux store, join or leave room if necessary
 */
export const locationChanged = (pathname) => (dispatch, getState) => {
  const state = getState();

  if (
    pathname &&
    pathname.length > 1 &&
    pathname.substring(1) !== appConfig.APP_STATUS_IDENTIFIER &&
    !state.roomId
  ) {
    joinRoom(pathname.substring(1))(dispatch, getState);
  } else if (!pathname || (pathname.length < 2 && state.userId && state.roomId)) {
    hub.sendCommand(
      {
        name: 'leaveRoom',
        roomId: state.roomId,
        payload: {
          userId: state.userId
        }
      },
      dispatch
    );
  }

  dispatch({
    type: LOCATION_CHANGED,
    pathname
  });
};

/**
 *
 * @param event
 */
export const eventReceived = (event) => (dispatch) => {
  const matchingType = EVENT_ACTION_TYPES[event.name];
  if (!matchingType) {
    log.error(`Unknown incoming event type ${event.name}. Will not dispatch a specific action.`);
    return;
  }

  // dispatch generic "event_received" action
  dispatch({
    type: EVENT_RECEIVED,
    eventName: event.name,
    correlationId: event.correlationId
  });

  // dispatch the specific event action
  dispatch({
    event,
    type: matchingType
  });

  if (event.name === 'joinedRoom') {
    if (event.payload.alias) {
      history.push('/' + event.payload.alias);
    } else {
      history.push('/' + event.roomId);
    }
  }
};

/**
 * Our actions contain our client-side business logic. (when to send which command).
 * They produce commands and pass them to the hub for sending.
 */

export const createRoom = (alias) => (dispatch, getState) => {
  const cmdPayload = {};
  const state = getState();

  if (state.presetUserId) {
    cmdPayload.userId = state.presetUserId;
  }
  if (state.presetUsername) {
    cmdPayload.username = state.presetUsername;
  }
  if (state.presetEmail) {
    cmdPayload.email = state.presetEmail;
  }

  if (alias) {
    cmdPayload.alias = alias;
  }

  hub.sendCommand(
    {
      name: 'createRoom',
      payload: cmdPayload
    },
    dispatch
  );
};

export const joinRoom = (roomId) => (dispatch, getState) => {
  const normalizedRoomId = roomId.toLowerCase();

  const joinCommandPayload = {};
  const state = getState();

  if (state.presetUserId) {
    joinCommandPayload.userId = state.presetUserId;
  }
  if (state.presetUsername) {
    joinCommandPayload.username = state.presetUsername;
  }
  if (state.presetEmail) {
    joinCommandPayload.email = state.presetEmail;
  }

  hub.sendCommand(
    {
      name: 'joinRoom',
      roomId: normalizedRoomId,
      payload: joinCommandPayload
    },
    dispatch
  );
};

export const addStory = (storyTitle, storyDescription) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'addStory',
      roomId: state.roomId,
      payload: {
        title: storyTitle,
        description: storyDescription
      }
    },
    dispatch
  );
};

export const selectStory = (storyId) => (dispatch, getState) => {
  const state = getState();
  if (state.selectedStory === storyId) {
    return;
  }

  hub.sendCommand(
    {
      name: 'selectStory',
      roomId: state.roomId,
      payload: {
        storyId
      }
    },
    dispatch
  );
};

export const giveStoryEstimate = (storyId, value) => (dispatch, getState) => {
  const state = getState();

  const command = {
    roomId: state.roomId,
    payload: {
      value: value,
      userId: state.userId,
      storyId: storyId
    }
  };

  if (state.stories[storyId] && state.stories[storyId].estimations[state.userId] === value) {
    command.name = 'clearStoryEstimate';
    delete command.payload.value;
  } else {
    command.name = 'giveStoryEstimate';
  }

  hub.sendCommand(command, dispatch);
};

export const newEstimationRound = (storyId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'newEstimationRound',
      roomId: state.roomId,
      payload: {
        storyId: storyId
      }
    },
    dispatch
  );
};

export const reveal = (storyId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'reveal',
      roomId: state.roomId,
      payload: {
        storyId: storyId
      }
    },
    dispatch
  );
};

export const setUsername = (username) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'setUsername',
      roomId: state.roomId,
      payload: {
        userId: state.userId,
        username: username
      }
    },
    dispatch
  );
};

export const setEmail = (email) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'setEmail',
      roomId: state.roomId,
      payload: {
        userId: state.userId,
        email: email
      }
    },
    dispatch
  );
};

export const setVisitor = (isVisitor) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'setVisitor',
      roomId: state.roomId,
      payload: {
        isVisitor,
        userId: state.userId
      }
    },
    dispatch
  );
};

export const kick = (userId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'kick',
      roomId: state.roomId,
      payload: {
        userId
      }
    },
    dispatch
  );
};

export const leaveRoom = () => (dispatch, getState) => {
  history.push({
    pathname: '/'
  });
  const state = getState();
  hub.sendCommand(
    {
      name: 'leaveRoom',
      roomId: state.roomId,
      payload: {
        userId: state.userId
      }
    },
    dispatch
  );
};

export const changeStory = (storyId, title, description) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'changeStory',
      roomId: state.roomId,
      payload: {
        storyId,
        title,
        description
      }
    },
    dispatch
  );
};

export const deleteStory = (storyId, title) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'deleteStory',
      roomId: state.roomId,
      payload: {
        storyId,
        title
      }
    },
    dispatch
  );
};

export const fetchStatus = () => (dispatch) => {
  axios.get('/api/status').then((response) => {
    dispatch({
      type: STATUS_FETCHED,
      status: response.data
    });
  });
};

// ui-only actions (client-side view state)
export const toggleBacklog = () => ({type: TOGGLE_BACKLOG});
export const toggleUserMenu = () => ({type: TOGGLE_USER_MENU});
export const toggleLog = () => ({type: TOGGLE_LOG});
export const editStory = (storyId) => ({type: EDIT_STORY, storyId});
export const cancelEditStory = (storyId) => ({type: CANCEL_EDIT_STORY, storyId});
export const setLanguage = (language) => ({type: SET_LANGUAGE, language});
