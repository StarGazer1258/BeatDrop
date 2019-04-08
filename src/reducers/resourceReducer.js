import { SET_RESOURCE } from '../actions/types'
import { BEATSAVER } from '../constants/resources'

export default function(state = BEATSAVER.NEW_SONGS, action) {
  switch(action.type) {
    case SET_RESOURCE:
      return action.payload
    default:
      return state
  }
}