import { ADD_DEVICE, SELECT_DEVICE, UPDATE_DEVICE } from "../actions/types";

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
        list: [...state.list, ...action.payload]
      }
    case UPDATE_DEVICE:
      let deviceId = action.payload.deviceId;
      let status = action.payload.status;
      return {
        ...state,
        list: state.list.map(device => device.deviceId === deviceId ? { ...device, status: status } : device)
      }
    default:
      return state
  }
}