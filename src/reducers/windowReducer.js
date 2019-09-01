import { RESIZE_WINDOW, SET_HAS_ERROR, SET_ERROR_MESSAGE } from '../actions/types'

let initialState = {
  isMaximized: false,
  hasError: false,
  errorMessage: { name: '' },
  errorInfo: { componentStack: '' }
}

export default function(state = initialState, action) {
  switch(action.type) {
    case RESIZE_WINDOW:
      return {
        ...state,
       isMaximized: action.payload
      }
    case SET_HAS_ERROR:
      return {
        ...state,
        hasError: action.payload
      }
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload.error,
        errorInfo: action.payload.info
      }
    default:
      return state
  }
}