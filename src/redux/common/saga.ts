/*
©2022 Pivotree | All rights reserved
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { COMMON_ACTION } from '../../constants/actionTypes';
import { callApi } from '../../utils/callApi';
import {
  commonActionFailed,
  commonActionSuccess,
  toggleSessionPrompt,
} from './actions';

function* commonAction({ payload }: any) {
  const { data, callback } = payload;
  try {
    const response: Promise<any> = yield call(callApi, data);
    yield put(commonActionSuccess({}));
    callback && callback();
  } catch (error: any) {
    if (error.message === 'Authorization failed') {
      yield put(toggleSessionPrompt(true));
    } else {
      yield put(commonActionFailed({}));
    }
  }
}

function* watchCommonSaga() {
  yield takeEvery(COMMON_ACTION, commonAction);
}

function* commonSaga(): any {
  yield all([fork(watchCommonSaga)]);
}

export default commonSaga;
