import { DISPLAY_FLASH, REMOVE_FLASH, CLEAR_FLASHES } from './types'

export const removeFlash = id => dispatch => {
  dispatch({
    type: REMOVE_FLASH,
    payload: id
  })
}

export const displayFlash = flash => dispatch => {
  dispatch({
    type: DISPLAY_FLASH,
    payload: flash
  })
}

export const clearFlashes = () => dispatch => {
  dispatch({
    type: CLEAR_FLASHES
  })
}