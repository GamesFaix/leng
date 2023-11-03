import settingsSaga from "./settings";
import encyclopediaSaga from "./encyclopedia";
import inventorySaga from "./inventory";
import preloadSaga from "./preload";
import searchSaga from "leng-core/src/sagas/search";
import { sagaMiddleware } from "leng-core/src/store";

export const runSagas = () => {
    const sagas = [
    settingsSaga,
    encyclopediaSaga,
    inventorySaga,
    preloadSaga,
    searchSaga,
    ];
    sagas.forEach(sagaMiddleware.run);
}