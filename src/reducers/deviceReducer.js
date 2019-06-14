import { ADD_DEVICE, SELECT_DEVICE } from "../actions/types";

const initialState = {
  list: [],
  selectedDevice: 0
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SELECT_DEVICE:
      return {
        ...state,
        selectedDevice: action.payload
      }
    case ADD_DEVICE:
      return {
        ...state,
        list: [action.payload]
      }
    default:
      return state
  }
}