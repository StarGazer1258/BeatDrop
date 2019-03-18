import { SET_DETAILS_LOADING, LOAD_DETAILS, CLEAR_DETAILS } from '../actions/types'

const initialState = {
  isOpen: false,
  loading: false
}

export default (state = initialState, action) => {
  switch(action.type) {
    case SET_DETAILS_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case LOAD_DETAILS:
      return {
        ...state,
        ...action.payload
      }
    case CLEAR_DETAILS:
      return {
        isOpen: state.isOpen,
        loading: state.loading
      }
    default:
      return state
  }
}