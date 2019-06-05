import { SELECT_DEVICE } from '../actions/types'

import * as DEVICE from '../constants/devices'
import * as STATUS from '../constants/device_statuses'

const initialState = {
  list: [
    {
      type: DEVICE.OCULUS.QUEST,
      status: STATUS.CONNECTED,
      storageUsed: 15400,
      capacity: 32000
    },
    {
      type:  DEVICE.HTC.VIVE,
      status: STATUS.CONNECTED,
    },
    {
      type: DEVICE.HTC.VIVE_PRO,
      status: STATUS.OFFLINE
    },
    {
      type: DEVICE.OCULUS.RIFT,
      status: STATUS.OFFLINE
    },
    {
      type: DEVICE.OCULUS.RIFT_S,
      status: STATUS.OFFLINE
    },
    {
      type: DEVICE.PIMAX.EIGHT_K,
      status: STATUS.OFFLINE
    }
  ],
  selectedDevice: 0
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SELECT_DEVICE:
      return {
        ...state,
        selectedDevice: action.payload
      }
    default:
      return state
  }
}