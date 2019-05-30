import { SET_MOD_LIST, APPEND_MOD_LIST, LOAD_MOD_DETAILS, INSTALL_MOD, UNINSTALL_MOD, CLEAR_MODS, SET_INSTALLED_MODS, SET_SCANNING_FOR_MODS, SET_MOD_ACTIVE, ADD_PENDING_MOD, ADD_DEPENDENT, SET_PATCHING, REMOVE_DEPENDENT } from '../actions/types'

const initialState = {
  mods: [],
  modDetails: {},
  installedMods: [],
  pendingInstall: [],
  scanning: false,
  patching: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_MOD_LIST:
      return {
        ...state,
        mods: action.payload
      }
    case APPEND_MOD_LIST:
      return {
        ...state,
        mods: [
          ...state.mods,
          action.payload
        ]
      }
    case LOAD_MOD_DETAILS:
      return {
        ...state,
        modDetails: action.payload
      }
    case INSTALL_MOD:
      let installedState = { ...state }
      installedState.pendingInstall.splice(installedState.pendingInstall.findIndex(mod => mod === action.payload.name), 1)
      installedState.installedMods.push(action.payload)
      return installedState
    case SET_INSTALLED_MODS:
      return {
        ...state,
        installedMods: action.payload
      }
    case ADD_DEPENDENT:
      let newDependentState = { ...state }
      newDependentState.installedMods[action.payload.index].dependencyOf.push(action.payload.dependent)
      return newDependentState
    case REMOVE_DEPENDENT:
      let removedDependantState = { ...state }
      removedDependantState.installedMods[action.payload.index].dependencyOf.splice(removedDependantState.installedMods[action.payload.index].dependencyOf.findIndex(m => m.name === action.payload.dependant), 1)
      return removedDependantState
    case UNINSTALL_MOD:
      let uninstalledState = { ...state }
      uninstalledState.installedMods.splice(action.payload, 1)
      return uninstalledState
    case ADD_PENDING_MOD:
      return {
        ...state,
        pendingInstall: [
          ...state.pendingInstall,
          action.payload
        ]
      }
    case CLEAR_MODS:
      return {
        ...state,
        installedMods: [],
        pendingInstall: []
      }
    case SET_SCANNING_FOR_MODS:
      return {
        ...state,
        scanning: action.payload
      }
    case SET_MOD_ACTIVE:
      let activatedState = { ...state }
      activatedState.installedMods[action.payload.index].active = action.payload.active
      return activatedState
    case SET_PATCHING:
      return {
        ...state,
        patching: action.payload
      }
    default:
      return state
  }
}