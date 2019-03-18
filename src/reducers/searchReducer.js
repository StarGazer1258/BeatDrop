import { SET_SEARCH_SOURCES, SUBMIT_SEARCH } from '../actions/types'

export default function(state = { isOpen: false, sources: { library: true, beatSaver: true }, searchResults: { keywords: '', library: [], beatSaver: [] } }, action) {
  switch(action.type) {
    case SET_SEARCH_SOURCES:
      return {
        ...state,
        sources: action.payload
      }
    case SUBMIT_SEARCH:
      return {
        ...state,
        searchResults: action.payload
      }
    default:
      return state
  }
}