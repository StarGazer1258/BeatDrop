import { combineReducers } from 'redux'
import songListReducer from './songListReducer'
import detailsReducer from './detailsReducer'
import sidebarReducer from './sidebarReducer'
import windowReducer from './windowReducer'
import sourceReducer from './sourceReducer'
import viewReducer from './viewReducer'
import settingsReducer from './settingsReducer'
import loadingReducer from './loadingReducer'
import loadingMoreReducer from './loadingMoreReducer'
import queueReducer from './queueReducer'
import warningsReducer from './warningsReducer'
import playlistsReducer from './playlistsReducer'
import searchReducer from './searchReducer'

export default combineReducers({
  songs: songListReducer,
  playlists: playlistsReducer,
  details: detailsReducer,
  sidebar: sidebarReducer,
  window: windowReducer,
  source: sourceReducer,
  view: viewReducer,
  settings: settingsReducer,
  loading: loadingReducer,
  loadingMore: loadingMoreReducer,
  queue: queueReducer,
  warnings: warningsReducer,
  search: searchReducer
})