import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import createSagaMiddleware from 'redux-saga';
import rootReducer from './root_reducers';
import sagas from './root_sagas';

//middlewares
export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const persistConfig = {
  key: 'root',
  storage,
};
export let persitstore: any;

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store: any;

export function configStore(initialState: object) {
  store = createStore(
    persistedReducer,
    {},
    composeEnhancers(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(sagas, {});
  persitstore = persistStore(store);
  return store;
}
