import { START_ADB_SERVICE, DOWNLOAD_TOOLS } from "../actions/types";

const initialState = {
  instance: null,
  started: false,
  toolsDownloaded: false,
  toolsPath: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case START_ADB_SERVICE:
      return {
        ...state,
        instance: action.payload.instance,
        started: action.payload.started
      }
    case DOWNLOAD_TOOLS:
      return {
        ...state,
        toolsPath: action.payload.path,
        toolsDownloaded: action.payload.toolsDownloaded
      }
    default:
      return state
  }
}
