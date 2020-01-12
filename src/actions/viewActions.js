import { SET_VIEW, SET_SUB_VIEW, SET_SCROLLTOP } from './types'
import { setPlaylistEditing } from '../actions/playlistsActions'

export const setView = view => (dispatch, getState) => {
  if(getState().playlists.editing) setPlaylistEditing(false)(dispatch)
  dispatch({
    type: SET_VIEW,
    payload: view
  })
}

export const setSubView = view => dispatch => {
  dispatch({
    type: SET_SUB_VIEW,
    payload: view
  })
  dispatch({
    type: SET_SCROLLTOP,
    payload: 0
  })
}