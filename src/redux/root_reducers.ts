import { createBrowserHistory } from 'history';
import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { RESET_STORE } from '../constants/actionTypes';
import Common from './common/reducers';
export const history: any = createBrowserHistory();

const appReducers = combineReducers({
  routerReducer,
  Common,
  // routing: history,
});

//reset the state
const rootReducer = (state: any, action: any) => {
  if (action.type === REHYDRATE) {
    return { ...state, persistedState: action.payload };
  }
  if (action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducers(state, action);
};
export default rootReducer;
