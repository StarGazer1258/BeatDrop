import { SET_SEARCH_SOURCES, SUBMIT_SEARCH } from '../actions/types'

const initialState = { 
  isOpen: false, 
  sources: { 
    library: true, 
    beatSaver: true 
  }, 
  searchResults: { 
    keywords: '', 
    library: [], 
    beatSaver: { 
      songs: [], 
      nextPage: 0, 
      prevPage: 0, 
      lastPage: 0, 
      totalSongs: 0,
      currentPage: 0
    } 
  } 
}

export default function(state = initialState, action) {
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