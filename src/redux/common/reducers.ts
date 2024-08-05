/*
©2022 Pivotree | All rights reserved
*/
import {
  CACHE_MEDIA_DATA,
  COMMON_ACTION,
  COMMON_ACTION_FAILED,
  COMMON_ACTION_SUCCESS,
  SAVE_LOGGED_IN_DATA,
  SAVE_MENU_STATE,
  SET_FIELDS_JSON,
  SET_FIELDS_STATE,
  SET_STEPPER_STATE,
  TOGGLE_SESSION_PROMPT,
  TOGGLE_SNACKBAR,
  TOGGLE_USER_SUCCESS,
} from '../../constants/actionTypes';

interface Snackbar {
  isOpen: boolean;
  message: string;
  type: string;
  severity: string;
  handleAdd: () => void;
  handleNext: () => void;
}
type CommonAction = { type: string; payload: any | string };
type State = {
  selectedMenu: any;
  fieldsJson: any;
  fieldsState: any;
  stepperState: any;
  snackbar: Snackbar;
  sessionPrompt: boolean;
  loggedInData: any;
  cachedMediaData: Array<any>;
};

const INIT_STATE = {
  selectedMenu: 'dashboard',
  fieldsJson: [],
  fieldsState: {},
  stepperState: {
    activeStep: 0,
    id: '',
  },
  loggedInData: {},
  sessionPrompt: false,
  snackbar: {
    isOpen: false,
    message: '',
    type: '',
    severity: 'success',
    handleAdd: () => {},
    handleNext: () => {},
  },
  cachedMediaData: [],
};

const Common = (state: State = INIT_STATE, action: CommonAction) => {
  switch (action.type) {
    case SAVE_MENU_STATE:
      return { ...state, selectedMenu: action.payload };
    case SET_FIELDS_JSON:
      return { ...state, fieldsJson: action.payload };
    case SET_FIELDS_STATE:
      return { ...state, fieldsState: action.payload };
    case SET_STEPPER_STATE:
      return { ...state, stepperState: action.payload };
    case COMMON_ACTION:
      return { ...state, loading: true };
    case COMMON_ACTION_SUCCESS:
      return { ...state, loading: false };
    case COMMON_ACTION_FAILED:
      return { ...state, loading: false };
    case TOGGLE_SNACKBAR:
      return { ...state, snackbar: action.payload };
    case TOGGLE_SESSION_PROMPT:
      return { ...state, sessionPrompt: action.payload };
    case SAVE_LOGGED_IN_DATA:
      return { ...state, loggedInData: action.payload };
    case CACHE_MEDIA_DATA:
      return { ...state, cachedMediaData: action.payload };
    case TOGGLE_USER_SUCCESS:
      return { ...state, loggedInData: action.payload };
    default:
      return { ...state };
  }
};
export default Common;
