import { DISPLAY_WARNING, REMOVE_WARNING, CLEAR_WARNINGS } from './types'

export const removeWarning = index => dispatch => {
  dispatch({
    type: REMOVE_WARNING,
    payload: index
  })
}

export const displayWarning = warning => dispatch => {
  dispatch({
    type: DISPLAY_WARNING,
    payload: warning
  })
}

export const clearWarnings = () => dispatch => {
  dispatch({
    type: CLEAR_WARNINGS
  })
}