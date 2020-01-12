import { RESET_APP } from "./types"

export const resetApp = () => dispatch => {
  dispatch({
    type: RESET_APP
  })
}