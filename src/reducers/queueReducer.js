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
      let items = [...state.items]
      if(items.length >= 25) items.pop()
      return {
        ...state,
        items: [
          {
            hash: action.payload.hashMd5,
            image: action.payload.coverUrl,
            title: action.payload.songName,
            artist: action.payload.authorName,
            progress: 0
          },
          ...items
        ]
      }
    case UPDATE_PROGRESS: {
      let items = [...state.items]
      for(let i=0;i<items.length;i++) {
        if(items[i].hash === action.payload.hash) {
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