import { createStore, applyMiddleware, compose } from "redux"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import thunk from 'redux-thunk'
import appReducer from './reducers'

import { WELCOME, SONG_LIST } from './constants/views'
import { SONGS } from './constants/sections'

import { RESET_APP } from './actions/types'

const initialState = {
  mods: {
    mods: [],
    modDetails: {},
    installedMods: [],
    pendingInstall: [],
    updates: 0,
    scanning: false,
    patching: false
  },
  queue: {
    items: []
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
        totalSongs: 0,
        currentPage: 0
      },
      library: []
    }
  },
  settings: {
    installationDirectory: "Please Choose a Folder...",
    installationType: "choose",
    gameVersion: "choose",
    autoLoadMore: true,
    offlineMode: false,
    theme: 'light',
    themeImagePath: '',
    folderStructure: 'keySongNameArtistName',
    updateChannel: 'latest',
    latestReleaseNotes: '0.0.0'
  },
  sidebar: {
    isOpen: true,
    section: SONGS
  },
  view: {
    previousView: SONG_LIST,
    view: WELCOME,
    subView: 'list'
  },
  warnings: [],
  window: {
    isMaximized: false,
    isTranslucent: true
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