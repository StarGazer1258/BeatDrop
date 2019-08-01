import  { SET_VIEW, SET_SUB_VIEW } from '../actions/types'
import { WELCOME, SONG_LIST } from '../constants/views'

const initialState = {
  previousView: SONG_LIST,
  view: WELCOME,
  subView: 'list'
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_VIEW:
      return {
        ...state,
        previousView: state.view,
        view: action.payload,
      }
    case SET_SUB_VIEW:
      return {
        ...state,
        subView: action.payload
      }
    default:
      return state
  }
}