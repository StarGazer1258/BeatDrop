import { RESIZE_SIDEBAR } from './types'

export const resizeSidebar = (sidebar) => (dispatch) => {
  sidebar.isOpen = !sidebar.isOpen
  
  dispatch({
    type: RESIZE_SIDEBAR,
    payload: sidebar
  })
}