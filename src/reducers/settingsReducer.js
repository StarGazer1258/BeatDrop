import { SET_INSTALLATION_DIRECTORY, SET_AUTO_LOAD_MORE, SET_OFFLINE_MODE, SET_SETTINGS_OPEN, SET_THEME, SET_FOLDER_STRUCTURE, SET_UPDATE_CHANNEL, SET_LATEST_RELEASE_NOTES } from '../actions/types'

const initialState = {
  isOpen: false,
  installationDirectory: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Beat Saber",
  autoLoadMore: true,
  offlineMode: false,
  theme: 'light',
  folderStructure: 'idKey',
  updateChannel: 'latest',
  latestReleaseNotes: '0.0.0'
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_SETTINGS_OPEN:
      return {
        ...state,
        isOpen: action.payload
      }
    case SET_INSTALLATION_DIRECTORY:
      return {
        ...state,
        installationDirectory: action.payload
      }
    case SET_AUTO_LOAD_MORE:
      return {
        ...state,
        autoLoadMore: action.payload
      }
    case SET_OFFLINE_MODE:
      return {
        ...state,
        offlineMode: action.payload
      }
    case SET_THEME:
      return {
        ...state,
        theme: action.payload
      }
    case SET_FOLDER_STRUCTURE:
      return {
        ...state,
        folderStructure: action.payload
      }
    case SET_UPDATE_CHANNEL:
      return {
        ...state,
        updateChannel: action.payload
      }
    case SET_LATEST_RELEASE_NOTES:
      return {
        ...state,
        latestReleaseNotes: action.payload
      }
    default:
      return state
  }
}