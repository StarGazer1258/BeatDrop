import  { SET_VIEW, SET_SONG_VIEW } from '../actions/types'
import { WELCOME, SONG_LIST } from '../views'

export default function(state={previousView: SONG_LIST, view: WELCOME, songView: 'list'}, action) {
  switch(action.type) {
    case SET_VIEW:
      return {
        ...state,
        previousView: state.view,
        view: action.payload
      }
    case SET_SONG_VIEW:
      return {
        ...state,
        songView: action.payload
      }
    default:
      return state
  }
}