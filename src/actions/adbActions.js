import { store } from "../store";
import AdmZip from "adm-zip";
import { ADD_DEVICE, DISPLAY_WARNING, DOWNLOAD_TOOLS, START_ADB_SERVICE } from "./types";
import * as DEVICE from '../constants/devices'
import * as STATUS from "../constants/device_statuses";
import os from 'os'
import path from 'path'
const adb = require('adbkit');

export const startAdb = () => async (dispatch, getState) => {
  if (!getState().adb.toolsDownloaded) await downloadADBTools()
  if (getState().adb.instance) return
  dispatch({
    type: START_ADB_SERVICE,
    payload: { instance: adb.createClient({ bin: path.join(getState().adb.toolsPath, getAdbBinary()) }), started: true }
  })
}

export const getDevices = () => async (getState, dispatch) => {
  if (!getState().adb.instance){
    dispatch({ type: DISPLAY_WARNING, payload: { text: 'No ADB instance started' } })
    return
  }
  const adb = getState().adb.instance
  adb.listDevices().then(devices => {
    devices.forEach((device) => {
      dispatch({
        type: ADD_DEVICE,
        payload: buildDevice(device)
      })
    })
  })
}

function downloadADBTools(dispatch) {
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
  }

  let downloadLink = url + name
  let downloadPath = path.join(store.getState().settings.installationDirectory)
  return new Promise(async (resolve, reject) => {
    await fetch(downloadLink)
      .then(res => res.arrayBuffer())
      .then((data) => {
        let zip = new AdmZip(new Buffer(data))
        try{
          zip.extractAllTo(downloadPath, true)
          dispatch({
            type: DOWNLOAD_TOOLS,
            payload: { path: downloadPath, toolsDownloaded: true }
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
    case 'win32':
      return 'adb.exe';
    default:
      return 'adb.exe';
  }
}

function execute(command){
  const exec = require('child_process').exec;
  let adbP = path.join(store.getState().settings.adbToolsPath, getAdbBinary())
  exec('"' + adbP + '" ' + command)
    .then((err, stdout, stderr) => {
      if (err || stderr) console.log(err || stderr)
      return stdout
    });
}

function getProperty(serial, property){
  let command = `-s ${serial} shell getprop ${property}`
  return execute(command)
}

function getStorage(serial){
  let command = `-s ${serial} shell df`
  execute(command).then((result) => {
    console.log(result)
  })
}

function buildDevice(serial){
  let manufacturer = getProperty(serial, 'ro.product.manufacturer')
  let model = getProperty(serial, 'ro.product.model')
  let device = `${manufacturer} ${model}`
  let storage = getStorage(serial)

  if (device === "Oculus Quest"){
    return {
      type: DEVICE.OCULUS.QUEST,
      status: STATUS.CONNECTED,
      storageUsed: 15400,
      capacity: 32000
    }
  }
}