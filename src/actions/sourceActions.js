import { SET_SOURCE, SET_RESOURCE, SET_RESOURCE_URL } from './types'

export const setSource = (source) => dispatch => {
  dispatch({
    type: SET_SOURCE,
    payload: source
  })
}

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