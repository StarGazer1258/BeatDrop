import { createStore, applyMiddleware } from "redux"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const initialState = {
  window: {
    isMaximized: false,
    isTranslucent: true
  },
  songs: {
    songs: []
  },
  search: {
    searchResults: {
      beatSaver: {
        songs: []
      }
    }
  }
}

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2
 };
 
 const pReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk]

export const store = createStore(pReducer, initialState, applyMiddleware(...middleware))
export const persistor = persistStore(store)