import { RESIZE_SIDEBAR, SET_SECTION } from './types'

export const resizeSidebar = () => (dispatch, getState) => {
  dispatch({
    type: RESIZE_SIDEBAR,
    payload: !getState().sidebar.isOpen
  })
}

export const setSection = (section) => (dispatch) => {
  dispatch({
    type: SET_SECTION,
    payload: section
  })
}