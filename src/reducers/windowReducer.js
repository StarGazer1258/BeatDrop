import { RESIZE_WINDOW } from '../actions/types'

let initialState = {
  isMaximized: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case RESIZE_WINDOW:
      return {
        ...state,
       isMaximized: action.payload
      }
    default:
      return state
  }
}