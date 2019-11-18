import { CLEAR_FLASHES, DISPLAY_FLASH, REMOVE_FLASH } from '../actions/types'
import * as uniqid  from 'uniqid';

export default function(state = [], action) {
  switch(action.type) {
    case DISPLAY_FLASH:
      return [
        ...state,
        {
          id: uniqid(),
          payload: action.payload
        }
      ]
    case REMOVE_FLASH:
      return state.filter(flash => {
        return flash.id !== action.payload
      })
    case CLEAR_FLASHES:
      return []
    default:
      return state
  }
}