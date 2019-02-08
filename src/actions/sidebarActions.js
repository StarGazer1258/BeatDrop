import { RESIZE_SIDEBAR } from './types'

export const resizeSidebar = () => (dispatch, getState) => {
  dispatch({
    type: RESIZE_SIDEBAR,
    payload: !getState().sidebar.isOpen
  })
}