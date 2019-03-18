import { RESIZE_WINDOW } from './types'

export const resizeWindow = (window) => (dispatch) => {
  window.isMaximized = !window.isMaximized

  dispatch({
    type: RESIZE_WINDOW,
    payload: window.isMaximized
  })
}