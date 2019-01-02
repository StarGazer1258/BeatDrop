import { SET_INSTALLATION_DIRECTORY, SET_AUTO_LOAD_MORE, SET_SETTINGS_OPEN, SET_THEME } from '../actions/types'

const initialState = {
  isOpen: false,
  installationDirectory: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Beat Saber",
  autoLoadMore: true,
  theme: 'light'
}

export default function(state=initialState, action) {
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
    case SET_THEME:
      return {
        ...state,
        theme: action.payload
      }
    default:
      return state
  }
}