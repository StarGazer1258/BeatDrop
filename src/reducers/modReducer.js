import { SET_MOD_LIST, APPEND_MOD_LIST, LOAD_MOD_DETAILS, INSTALL_MOD, UNINSTALL_MOD, CLEAR_MODS, SET_INSTALLED_MODS, SET_SCANNING_FOR_MODS, SET_MOD_ACTIVE, ADD_PENDING_MOD, ADD_DEPENDENT, SET_PATCHING, REMOVE_DEPENDENT, SET_MOD_UPDATE_AVAILABLE, CLEAR_MOD_UPDATES, SET_IGNORE_MOD_UPDATE } from '../actions/types'

const initialState = {
  mods: [],
  modDetails: {},
  installedMods: [],
  pendingInstall: [],
  updates: 0,
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
      if(uninstalledState.installedMods[action.payload].updateAvailable) uninstalledState.updates--
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
    case SET_MOD_UPDATE_AVAILABLE:
      console.log(`Setting ${ state.installedMods[action.payload.modIndex].name } to  ${ action.payload.updateAvailable }@${ action.payload.latestVersion }`)
      let updatedState = { ...state }
      updatedState.installedMods[action.payload.modIndex].updateAvailable = action.payload.updateAvailable
      if(action.payload.updateAvailable) {
        updatedState.installedMods[action.payload.modIndex].latestVersion = action.payload.latestVersion
        updatedState.updates++
      }
      console.log(JSON.stringify(updatedState.installedMods[action.payload.modIndex]))
      return updatedState
    case CLEAR_MOD_UPDATES:
      let clearedUpdatesState = { ...state }
      for(let i = 0; i < clearedUpdatesState.installedMods.length; i++) {
        clearedUpdatesState.installedMods[i].updateAvailable = false
        //clearedUpdatesState.installedMods[i].latestVersion = clearedUpdatesState.installedMods[i].vesion
      }
      clearedUpdatesState.updates = 0
      return clearedUpdatesState
    case SET_IGNORE_MOD_UPDATE:
      let ignoredState = { ...state }
      ignoredState.installedMods[action.payload.modIndex].ignoreUpdate = action.payload.ignoreUpdate
      if(action.payload.ignoreUpdate) ignoredState.updates--
      return ignoredState
    default:
      return state
  }
}