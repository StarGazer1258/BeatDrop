import {DOWNLOAD_CONVERTER} from "../actions/types";

const initialState = {
   path: null
}

export default (state = initialState, action) => {
    switch (action.type) {
      case DOWNLOAD_CONVERTER:
        return {
          state: state,
          path: action.payload
        }
      default:
        return state
    }
}
