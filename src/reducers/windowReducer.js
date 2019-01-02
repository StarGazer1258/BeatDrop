import { RESIZE_WINDOW } from '../actions/types'

export default function(state = {}, action) {
  switch(action.type) {
    case RESIZE_WINDOW:
      return {
        ...state,
       window: action.payload.window
      }
    default:
      return state
  }
}