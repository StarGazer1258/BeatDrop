import { SET_LOADING_MORE } from '../actions/types'

export default function(state = false, action) {
  switch(action.type) {
    case SET_LOADING_MORE:
      return action.payload
    default:
      return state
  }
}  