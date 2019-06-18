import { ADD_DEVICE, SELECT_DEVICE, SYNC_DEVICE, UPDATE_DEVICE } from "../actions/types";

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
    case SYNC_DEVICE:
      let time = action.payload.time;
      let date = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      let timeInHours = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
      let dateTime = `${date} ${timeInHours}`
      return {
        ...state,
        list: state.list.map(device => device.deviceId === action.payload.deviceId ? { ...device, lastSync: dateTime } : device)
      }
    default:
      return state
  }
}