import { RESIZE_WINDOW, SET_HAS_ERROR } from '../actions/types'

let initialState = {
  isMaximized: false,
  hasError: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case RESIZE_WINDOW:
      return {
        ...state,
       isMaximized: action.payload
      }
    case SET_HAS_ERROR:
      return {
        ...state,
        hasError: action.payload
      }
    default:
      return state
  }
}