import { SELECT_DEVICE } from '../actions/types'
import { store } from "../store";
import AdmZip from 'adm-zip'
import os from 'os'
const { remote } = window.require('electron')
const Promise = require('bluebird')
const adb = require('adbkit');
const fs = remote.require('fs')
const path = remote.require('path')

export const selectDevice = device => dispatch => {
  dispatch({
    type: SELECT_DEVICE,
    payload: device
  })
}

export const getDevices = async () => {
  if (!isAdbStarted()) await startAdb()
  const adb = store.getState().settings.adb
  adb.listDevices()
    .then(devices => {
      console.log(getProperty(devices[0].id, "ro.product.manufacturer"))
      return adb.getPackages(devices[0].id)
    })
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

export const downloadADBTools = () => {
  if (adbReady()) return;
  let url = 'https://dl.google.com/android/repository/platform-tools-latest-';
  let name = "windows.zip";
  switch (os.platform()) {
    case "win32":
      name = "windows.zip";
      break;
    case "darwin":
      name = "darwin.zip";
      break;
    case "linux":
      name = "linux.zip";
      break;
  }
  let downloadLink = url + name;
  let downloadPath = path.join(store.getState().settings.installationDirectory);
  return new Promise(async (resolve, reject) => {
    await fetch(downloadLink)
      .then(res => res.arrayBuffer())
      .then((data) => {
        let zip = new AdmZip(new Buffer(data))
        try{
          zip.extractAllTo(downloadPath, true)
          store.getState().settings.adbToolsPath = path.join(downloadPath, 'platform-tools');
        } catch (err) {
          console.log(err)
        }
        return resolve(downloadPath)
      })
  });
}

function isAdbStarted(){
  return store.getState().settings.adb;
}

function adbReady(){
  try {
    return fs.existsSync(store.getState().settings.adbToolsPath);
  } catch (err) {
    return false;
  }
}

function getAdbBinary() {
  switch (os.platform()) {
    case 'win32':
      return 'adb.exe';
    default:
      return 'adb.exe';
  }
}