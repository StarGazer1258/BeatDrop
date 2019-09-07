import { SET_SETTINGS_OPEN, SET_INSTALLATION_DIRECTORY, SET_AUTO_LOAD_MORE, SET_OFFLINE_MODE, SET_THEME, SET_THEME_IMAGE, SET_FOLDER_STRUCTURE, SET_UPDATE_CHANNEL, SET_LATEST_RELEASE_NOTES, SET_INSTALLATION_TYPE, SET_GAME_VERSION, SET_PROTON_DIRECTORY, SET_WINEPREFIX_DIRECTORY } from './types'

import { checkDownloadedSongs } from './queueActions'

const { ipcRenderer } = window.require('electron')

export const setSettingsOpen = isOpen => dispatch => {
  dispatch({
    type: SET_SETTINGS_OPEN,
    payload: isOpen
  })
}

export const setInstallationDirectory = directory => (dispatch, getState) => {
  dispatch({
    type: SET_INSTALLATION_DIRECTORY,
    payload: directory
  })
  checkDownloadedSongs()(dispatch, getState)
}

export const setInstallationType = type => dispatch => {
  dispatch({
    type: SET_INSTALLATION_TYPE,
    payload: type
  })
}

export const setGameVersion = version => dispatch => {
  dispatch({
    type: SET_GAME_VERSION,
    payload: version
  })
}

export const setAutoLoadMore = willAutoLoadMore => dispatch => {
  dispatch({
    type: SET_AUTO_LOAD_MORE,
    payload: willAutoLoadMore
  })
}

export const setOfflineMode = offlineModeEnabled => dispatch => {
  dispatch({
    type: SET_OFFLINE_MODE,
    payload: offlineModeEnabled
  })
}

export const setTheme = theme => dispatch => {
  dispatch({
    type: SET_THEME,
    payload: theme
  })
}

export const setThemeImage = imagePath => dispatch => {
  dispatch({
    type: SET_THEME_IMAGE,
    payload: imagePath
  })
}

export const setFolderStructure = structure => dispatch => {
  dispatch({
    type: SET_FOLDER_STRUCTURE,
    payload: structure
  })
}

export const setUpdateChannel = channel => dispatch => {
  ipcRenderer.send('electron-updater', 'set-update-channel', channel)
  dispatch({
    type: SET_UPDATE_CHANNEL,
    payload: channel
  })
}

export const setLatestReleaseNotes = version => dispatch => {
  dispatch({
    type: SET_LATEST_RELEASE_NOTES,
    payload: version
  })
}

export const setProtonDirectory = directory => (dispatch, getState) => {
  dispatch({
    type: SET_PROTON_DIRECTORY,
    payload: directory
  })
}

export const setWinePrefixDirectory = directory => (dispatch, getState) => {
  dispatch({
    type: SET_WINEPREFIX_DIRECTORY,
    payload: directory
  })
}