import { RESIZE_SIDEBAR,SET_SECTION } from '../actions/types'
import { SONGS } from '../constants/sections'

const initialState = {
  isOpen: true,
  section: SONGS
}

export default function(state = initialState, action) {
  switch(action.type) {
    case RESIZE_SIDEBAR:
      return {
        ...state,
       isOpen: action.payload
      }
    case SET_SECTION:
      return {
        ...state,
        section: action.payload
      }
    default:
      return state
  }
}