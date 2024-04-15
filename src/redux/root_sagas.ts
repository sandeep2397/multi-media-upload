import { all } from 'redux-saga/effects';
import commonSaga from './common/saga';

export default function* rootSaga(state: any) {
  yield all([commonSaga()]);
}
