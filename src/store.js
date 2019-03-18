import { createStore, applyMiddleware, compose } from "redux"
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
    songs: [],
    downloadingCount: 0,
    waitingToDownload: [],
    downloadedSongs: []
  },
  search: {
    searchResults: {
      beatSaver: [],
      library: []
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(pReducer, initialState, composeEnhancers(applyMiddleware(...middleware)))
export const persistor = persistStore(store)