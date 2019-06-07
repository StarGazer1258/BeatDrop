import {SET_VIEW, SET_SUB_VIEW, SET_SORT_BY, SET_SORT_ORDER} from '../actions/types'
import { WELCOME, SONG_LIST } from '../views'

const initialState = {
  previousView: SONG_LIST,
  view: WELCOME,
  subView: 'list',
  sortBy: 'songName',
  sortOrder: 'asc'
};

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_VIEW:
      return {
        ...state,
        previousView: state.view,
        view: action.payload,
      };
    case SET_SUB_VIEW:
      return {
        ...state,
        subView: action.payload
      };
    case SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload
      };
    case SET_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.payload
      };
    default:
      return state
  }
}