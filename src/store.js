import { createStore, applyMiddleware, compose } from "redux"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import thunk from 'redux-thunk'
import appReducer from './reducers'

import { RESET_APP } from './actions/types'

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
      beatSaver: {
        songs: [], 
        nextPage: 0,
        prevPage: 0,
        lastPage: 0,
        totalSongs: 0
      },
      library: []
    }
  }
}

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2
 };
 
const rootReducer = (state, action) => {
  if(action.type === RESET_APP) return initialState
  return appReducer(state, action)
}

 const pReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(pReducer, initialState, composeEnhancers(applyMiddleware(...middleware)))
export const persistor = persistStore(store)