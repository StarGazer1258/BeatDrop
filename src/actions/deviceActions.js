import { DISPLAY_WARNING, SELECT_DEVICE } from "../actions/types";
const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')

export const selectDevice = device => dispatch => {
  dispatch({
    type: SELECT_DEVICE,
    payload: device
  })
}

