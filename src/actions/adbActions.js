import { store } from "../store";
import { downloadADBTools } from "./deviceActions";

export const startAdb = () => (dispatch, getState) => {
  let state = { ...getState() }
  if (!state.instance)
  if (!adbReady()) downloadADBTools()
  store.getState().settings.adb = adb.createClient({bin: path.join(store.getState().settings.adbToolsPath, getAdbBinary())})
}
