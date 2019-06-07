import { SET_VIEW, SET_SUB_VIEW, SET_SCROLLTOP, SET_SORT_BY, SET_SORT_ORDER } from './types'

export const setView = view => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: view
  })
}

export const setSubView = view => dispatch => {
  dispatch({
    type: SET_SUB_VIEW,
    payload: view
  })
  dispatch({
    type: SET_SCROLLTOP,
    payload: 0
  })
}

export const setSortBy = (sort, order) => dispatch => {
  dispatch({
      type: SET_SORT_BY,
      payload: sort
  })
  dispatch({
    type: SET_SORT_ORDER,
    payload: order
  })
}