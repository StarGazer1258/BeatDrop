import { SET_SETTINGS_OPEN, SET_INSTALLATION_DIRECTORY, SET_AUTO_LOAD_MORE, SET_THEME, SET_FOLDER_STRUCTURE } from './types'

import { checkDownloadedSongs } from './queueActions'

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

export const setAutoLoadMore = willAutoLoadMore => dispatch => {
  dispatch({
    type: SET_AUTO_LOAD_MORE,
    payload: willAutoLoadMore
  })
}

export const setTheme = theme => dispatch => {
  dispatch({
    type: SET_THEME,
    payload: theme
  })
}

export const setFolderStructure = structure => dispatch => {
  dispatch({
    type: SET_FOLDER_STRUCTURE,
    payload: structure
  })
}