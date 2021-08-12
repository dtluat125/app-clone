import {configureStore} from "@reduxjs/toolkit"
import appReducer from "../features/appSlice"
import persistReducer from "redux-persist/es/persistReducer"
import storage from 'redux-persist/lib/storage'
import persistStore from "redux-persist/es/persistStore"
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
const persistConfig = {
    key: 'root',
    storage,
    stateReconciler:  autoMergeLevel1,
  }
const persistedAppReducer = persistReducer(persistConfig, appReducer);

export const app = configureStore({
    reducer:{
        app: persistedAppReducer
    }
})
export const persistor = persistStore(app)

