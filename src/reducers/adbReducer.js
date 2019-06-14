import { START_ADB_SERVICE } from "./types";

const initialState = {
  instance: null,
  started: false,
  toolsDownloaded: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case START_ADB_SERVICE:
      return {
        state:
        payload:
      }
  }
}
