import { RESIZE_SIDEBAR } from '../actions/types'

export default function(state = {isOpen: true}, action) {
  switch(action.type) {
    case RESIZE_SIDEBAR:
      return {
        ...state,
       isOpen: action.payload
      }
    default:
      return state
  }
}