import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
  menuOpen: false,
  accessToken: null,
  refreshToken: null,
  profile: null,
  currentlyPlaying: null,
  timeUntilNext: null,
  timeBetween: null,
  fadeout: null,
  bpmMin: null,
  bpmMax: null,
  timerCurrent: null,
  intervalTimer: null,
  wakeLockEnabled: false,
  initialLoadDone: false,
  logToConsole: false,
  currentAudioFeatures: null,
  onPause: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CURRENT_AUDIO_FEATURES':
      return {
        ...state,
        currentAudioFeatures: action.currentAudioFeatures,
      };
    case 'INITIAL_LOAD_DONE':
      return {
        ...state,
        initialLoadDone: true,
      };
    case 'TOGGLE_WAKE_LOCK':
      return {
        ...state,
        wakeLockEnabled: action.wakeLockEnabled,
      };
    case 'SET_INTERVAL_TIMER':
      return {
        ...state,
        intervalTimer: action.intervalTimer,
      };
    case 'ON_PAUSE':
      return {
        ...state,
        onPause: action.onPause,
      };
    case 'SET_TIMER':
      return {
        ...state,
        timeUntilNext: action.timeUntilNext,
        timeBetween: action.timeBetween,
        fadeout: action.fadeout,
        bpmMin: action.bpmMin,
        bpmMax: action.bpmMax,
        timerCurrent: action.timerCurrent,
      };
    case 'TOGGLE_MENU':
      return {
        ...state,
        menuOpen: action.menuOpen,
      };
    case 'UPDATE_TOKENS':
      return {
        ...state,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: action.profile,
      };
    case 'UPDATE_CURRENTLY_PLAYING':
      return {
        ...state,
        currentlyPlaying: action.currentlyPlaying,
      };

    case 'INI':
      return {
        ...state,
        currentlyPlaying: action.currentlyPlaying,
      };
    case 'LOGOUT':
      return {
        ...state,
        profile: null,
        accessToken: null,
        refreshToken: null,
      };
    default:
      return state;
  }
};

const makeStore = (initialState, options) => {
  return createStore(reducer, initialState, applyMiddleware(thunk));
};

export default makeStore;
