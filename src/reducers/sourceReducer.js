import { SET_SOURCE, SET_RESOURCE } from '../actions/types'

export default function(state={source: 'beatsaver', resource: 'new'}, action) {
  switch(action.type) {
    case SET_SOURCE:
      return {
        ...state,
        source: action.payload
      }
    case SET_RESOURCE:
      return {
        ...state,
        resource: action.payload
      }
    default:
      return state
  }
}