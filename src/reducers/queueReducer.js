import { ADD_TO_QUEUE, CLEAR_QUEUE, UPDATE_PROGRESS } from '../actions/types'

const initialState = {
  items: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case ADD_TO_QUEUE:
      let items = [...state.items]
      if(items.length >= 25) items.pop()
      return {
        ...state,
        items: [
          {
            utc: action.payload.utc,
            hash: action.payload.hash,
            image: action.payload.image,
            title: action.payload.title,
            author: action.payload.author,
            progress: 0
          },
          ...items
        ]
      }
    case UPDATE_PROGRESS: {
      let items = [...state.items]
      for(let i = 0;i < items.length;i++) {
        if(items[i].hash === action.payload.hash && items[i].utc === action.payload.utc) {
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