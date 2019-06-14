import os from 'os'
import { store } from '../store'
const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')

export const downloadConverter = () => {
  let url = "https://github.com/lolPants/songe-converter/releases/download/v0.4.3/songe-converter";
  let name = ".exe";
  switch (os.platform()) {
    case "win32":
      name = ".exe";
      break;
    case "darwin":
      name = "-mac";
      break;
    case "linux":
      name = "";
      break;
  }
  let urlParts = (url + name).split("/");
  let downloadLink = url + name;
  let downloadPath = path.join(store.getState().settings.installationDirectory, urlParts[urlParts.length - 1]);
  if (fs.existsSync(downloadPath)) {
    store.getState().settings.converterBinaryPath = downloadPath;
    return Promise.resolve();
  }
  return new Promise(async (resolve, reject) => {
    await fetch(downloadLink)
      .then(async (response) => {
        if (!response.ok) {
          throw Error("Can't download!")
        }
        return storeFile(response.body, downloadPath)
      })
      .then(path => {
        store.getState().settings.converterBinaryPath = path;
        if (os.platform() === "darwin" || os.platform() === "linux") {
          console.log('nono')
        } else {
          console.log(store.getState().settings.converterBinaryPath)
          return resolve();
        }
      });
  });
}

export async function storeFile(data, path){
  return new Promise(async (resolve, reject) => {
    if (data == null) throw Error('no data to store');

    const reader = data.getReader()
    const writer = fs.createWriteStream(path)

    while (true) {
      const result = await reader.read()
      if (result.done) {
       return resolve(path);
      }

      const chunk = result.value;
      if (chunk == null) throw Error('Empty chunk!!')
      writer.write(Buffer.from(chunk));
    }
  })
}