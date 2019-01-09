import { SET_VIEW, SET_SONG_VIEW, SET_SCROLLTOP } from './types'

export const setView = view => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: view
  })
}

export const setSongView = view => dispatch => {
  dispatch({
    type: SET_SONG_VIEW,
    payload: view
  })
  dispatch({
    type: SET_SCROLLTOP,
    payload: 0
  })
}