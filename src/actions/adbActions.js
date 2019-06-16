import AdmZip from "adm-zip";
import { ADD_DEVICE, DISPLAY_WARNING, DOWNLOAD_TOOLS, START_ADB_SERVICE, UPDATE_DEVICE } from "./types";
import * as DEVICE from '../constants/devices'
import * as STATUS from "../constants/device_statuses";
import os from 'os'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { DEVICE_TYPES } from "../constants/device_types";
const adb = require('adbkit');
const Promise = require('bluebird')

export const getDevices = () => (dispatch, getState) => {
  if (!isADBStarted()(getState)){
    startAdb()(dispatch, getState)
    dispatch({ type: DISPLAY_WARNING, payload: { text: 'No ADB instance started. Attempting to start...', timeout: 2500 } })
    return
  }

  let adb = getState().adb.instance;
  adb.listDevices().then(devices => {
    if (devices.length < 1){
      dispatch({ type: DISPLAY_WARNING, payload:{text: "No devices found", timeout: 2500 } })
      return;
    }
    devices.forEach(async (device) => {
      if (device.type === 'device') {
        if (isDeviceAdded(device)(getState)) return;
        dispatch({
          type: ADD_DEVICE,
          payload: await buildDevice(device.id)(getState)
        })
        adb.trackDevices()
          .then(function(tracker) {
            console.log('Device %s was plugged in', device.id)
            tracker.on('add', function(device) {
                dispatch({
                  type: UPDATE_DEVICE,
                  payload: {
                    deviceId: device.id,
                    status: STATUS.CONNECTED
                  }
                })
            })
            tracker.on('remove', function(device) {

              console.log('Device %s was unplugged', device.id)
                dispatch({
                  type: UPDATE_DEVICE,
                  payload: {
                    deviceId: device.id,
                    status: STATUS.OFFLINE
                  }
                })
            })
            tracker.on('end', function() {
              console.log('Tracking stopped')
                dispatch({
                  type: UPDATE_DEVICE,
                  payload: {
                    deviceId: device.id,
                    status: STATUS.UNKNOWN
                  }
                })
            })
          })
          .catch(function(err) {
            console.error('Something went wrong:', err.stack)
          })
      }
    })
  })
}

const downloadADBTools = () => (dispatch, getState) => {
  let url = 'https://dl.google.com/android/repository/platform-tools-latest-'
  let name = "windows.zip"
  switch (os.platform()) {
    case "win32":
      name = "windows.zip"
      break
    case "darwin":
      name = "darwin.zip"
      break
    case "linux":
      name = "linux.zip"
      break
    default:
      name = "windows.zip"
      break;
  }
  let downloadLink = url + name
  let downloadPath = path.join(getState().settings.installationDirectory)
  let toolsPath =  path.join(downloadPath, 'platform-tools');
  if (fs.existsSync(toolsPath)){
    dispatch({
      type: DOWNLOAD_TOOLS,
      payload: { path: toolsPath, toolsDownloaded: true}
    })
    return
  }
  return new Promise(async (resolve, reject) => {
    await fetch(downloadLink)
      .then(res => res.arrayBuffer())
      .then((data) => {
        let zip = new AdmZip(new Buffer(data))
        try{
          zip.extractAllTo(downloadPath, true)
          dispatch({
            type: DOWNLOAD_TOOLS,
            payload: { path: toolsPath, toolsDownloaded: true }
          })
        } catch (err) {
          dispatch({
            type: DISPLAY_WARNING,
            payload: {
              text: `Error download ADB tools. Please try again`
            }
          })
        }
        return resolve(downloadPath)
      })
  });
}

function getAdbBinary() {
  switch (os.platform()) {
    case 'darwin':
    case 'linux':
      return 'adb';
    default:
      return 'adb.exe';
  }
}

const execute = (command) => (getState) => {
  return new Promise(async (resolve, reject) => {
    let adbP = path.join(getState().adb.toolsPath, getAdbBinary())
    await exec('"' + adbP + '" ' + command, (err, stdout, stderr) => {
      if (err || stderr) return reject(err || stderr)
      return resolve(stdout)
    })
  })
}

const getProperty = (serial, property) => (getState) => {
  return new Promise(async (resolve, reject) => {
    let command = `-s ${serial} shell getprop ${property}`
    return await execute(command)(getState)
      .catch((error) => {
        return reject(error)
      })
      .then((result) => {
        return resolve(result)
      })
  })
}

const getStorage = (serial) => (getState) => {
  return new Promise(async (resolve, reject) => {
    let command = `-s ${serial} shell df`
    return await execute(command)(getState)
      .catch((error) => {
        return reject(error)
      })
      .then((result) => {
        return resolve(result)
      })
  })
}

const listDevices = () => (getState) => {
  let command = `devices`
  execute(command)(getState).then((result) => {
    console.log(result)
  })
}

const buildDevice = (serial) => (getState) => {
  return new Promise(async (resolve, reject) => {
    let info = {};
    await getProperty(serial, 'ro.product.manufacturer')(getState)
      .catch((error) => {
        console.log(error)
      })
      .then((manufacturer) => {
        info.manufacturer = manufacturer.toString().replace("\n", '')
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => {
        return getProperty(serial, 'ro.product.model')(getState)
      })
      .catch((error) => {
        console.log(error)
      })
      .then((model) => {
        info.model = model.toString().replace("\n", '')
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => {
        info.device = `${info.manufacturer} ${info.model}`
      })

    if (info.manufacturer.includes(DEVICE_TYPES.MANUFACTURER.OCULUS)) {
      if( info.model.includes(DEVICE_TYPES.MODEL.QUEST)){
        return resolve([{
          type: DEVICE.OCULUS.QUEST,
          status: STATUS.CONNECTED,
          storageUsed: 15400,
          capacity: 32000,
          deviceId: serial
        }])
      }
    }
  })
}

const startAdb = () => async (dispatch, getState) => {

  if (!areToolsDownloaded()(getState)) await downloadADBTools()(dispatch, getState)
  if (getState().adb.instance && getState().adb.instance.constructor.name === "Client") return
  dispatch({
    type: START_ADB_SERVICE,
    payload: { instance: adb.createClient({ bin: path.join(getState().adb.toolsPath, getAdbBinary()) }), started: true }
  })
  getDevices()(dispatch, getState)
}

const isADBStarted = () => (getState) => {
  return !!getState().adb.instance && getState().adb.toolsDownloaded && fs.existsSync(getState().adb.toolsPath) && getState().adb.instance.constructor.name === "Client"
}

const areToolsDownloaded = () => (getState) => {
  return getState().adb.toolsDownloaded && getState().adb.toolsPath && fs.existsSync(getState().adb.toolsPath)
}

const isDeviceAdded = (device) => getState => {
  let found = false;
  getState().devices.list.some((someDevice) => { if (someDevice.deviceId === device.id) found = true })
  return found
}