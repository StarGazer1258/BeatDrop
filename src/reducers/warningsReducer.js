import  { DISPLAY_WARNING, CLEAR_WARNINGS, REMOVE_WARNING } from '../actions/types'

export default function(state = [], action) {
  switch(action.type) {
    case DISPLAY_WARNING:
      return [
        ...state,
        action.payload
      ]
    case REMOVE_WARNING:
      let newState = state.filter((v, i) => { return i !== action.payload })
      return newState
    case CLEAR_WARNINGS:
      return []
    default:
      return state
  }
}