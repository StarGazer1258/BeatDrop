import { SELECT_DEVICE } from '../actions/types'
const Promise = require('bluebird')
const adb = require('adbkit')
const client = adb.createClient()

export const selectDevice = device => dispatch => {
  dispatch({
    type: SELECT_DEVICE,
    payload: device
  })
}

export const getDevices = dispatch => {
  let deviceList = []

  client.listDevices()
    .then(function(devices) {
      devices.map((device)=>{deviceList.push(device)})
    })
    .then(() => {
      deviceList.forEach((device) => {
        client.getProperties(device.id)
        .then((properties) => {
          console.log(properties)
        })
      })
    })
}