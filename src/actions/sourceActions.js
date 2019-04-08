import { SET_RESOURCE, SET_RESOURCE_URL } from './types'

export const setResource = (resource) => dispatch => {
  dispatch({
    type: SET_RESOURCE,
    payload: resource
  })
}

export const setResourceUrl = (url) => dispatch => {
  dispatch({
    type: SET_RESOURCE_URL,
    payload: url
  })
}