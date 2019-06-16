import { SELECT_DEVICE } from "../actions/types";

export const selectDevice = device => dispatch => {
  dispatch({
    type: SELECT_DEVICE,
    payload: device
  })
}

