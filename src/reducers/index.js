import { combineReducers } from 'redux'
import songListReducer from './songListReducer'
import detailsReducer from './detailsReducer'
import sidebarReducer from './sidebarReducer'
import windowReducer from './windowReducer'
import resourceReducer from './resourceReducer'
import viewReducer from './viewReducer'
import settingsReducer from './settingsReducer'
import loadingReducer from './loadingReducer'
import loadingMoreReducer from './loadingMoreReducer'
import queueReducer from './queueReducer'
import warningsReducer from './warningsReducer'
import playlistsReducer from './playlistsReducer'
import searchReducer from './searchReducer'
import modReducer from './modReducer'

export default combineReducers({
  songs: songListReducer,
  mods: modReducer,
  playlists: playlistsReducer,
  details: detailsReducer,
  sidebar: sidebarReducer,
  window: windowReducer,
  resource: resourceReducer,
  view: viewReducer,
  settings: settingsReducer,
  loading: loadingReducer,
  loadingMore: loadingMoreReducer,
  queue: queueReducer,
  warnings: warningsReducer,
  search: searchReducer
})