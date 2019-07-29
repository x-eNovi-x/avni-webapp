import { all, call, fork } from "redux-saga/effects";
import { adminSaga, defaultI18nProvider } from "react-admin";

import {
  authProvider,
  dataProvider as springDataProvider
} from "../adminApp/react-admin-config/index";
import {
  dataEntryLoadOperationalModules,
  dataEntryLoadRegistrationFormWatcher,
  dataEntrySearchWatcher,
  initialiseCognito,
  onSetCognitoUser,
  userInfoWatcher
} from "./saga";

const dataProvider = springDataProvider("");
const i18nProvider = defaultI18nProvider;

export default function* rootSaga() {
  yield call(initialiseCognito);
  yield all([
    fork(adminSaga(dataProvider, authProvider, i18nProvider)),
    fork(onSetCognitoUser),
    fork(userInfoWatcher),
    fork(dataEntrySearchWatcher),
    fork(dataEntryLoadOperationalModules),
    fork(dataEntryLoadRegistrationFormWatcher)
  ]);
}