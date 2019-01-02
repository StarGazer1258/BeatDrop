import { SET_QUEUE_OPEN, ADD_TO_QUEUE, CLEAR_QUEUE, UPDATE_PROGRESS } from '../actions/types'

const initialState = {
  isOpen: false,
  items: []
}

export default function(state=initialState, action) {
  switch(action.type) {
    case SET_QUEUE_OPEN:
      return {
        ...state,
        isOpen: action.payload
      }
    case ADD_TO_QUEUE:
      let items = state.items
      if(items.length >= 25) items.pop()
      return {
        ...state,
        items: [
          {
            key: action.payload.song.key,
            image: action.payload.song.coverUrl,
            title: action.payload.song.songName,
            artist: action.payload.song.authorName,
            progress: 0
          },
          ...items
        ]
      }
    case UPDATE_PROGRESS: {
      let items = state.items
      for(let i=0;i<items.length;i++) {
        if(items[i].key === action.payload.key) {
          items[i].progress = action.payload.progress
        }
      }
      return {
        ...state,
        items: [
          ...items
        ]
      }
    }
    case CLEAR_QUEUE:
      return {
        ...state,
        items: []
      }
    default:
      return state
  }
}