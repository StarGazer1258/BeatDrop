import { FETCH_NEW, FETCH_TOP_DOWNLOADS, FETCH_TOP_FINISHED, LOAD_MORE, REFRESH, ADD_BSABER_RATING, FETCH_LOCAL_SONGS, CHECK_DOWNLOADED_SONGS, SET_SCROLLTOP, SET_DOWNLOADING_COUNT, SET_WAIT_LIST } from '../actions/types'

export default function(state={songs: [], scrollTop: 0, downloadingCount: 0, waitingToDownload: [], downloadedSongs: {songKeys: [], songFiles: []}, totalSongs: 0}, action) {
  switch(action.type) {
    case FETCH_NEW:
    case FETCH_TOP_DOWNLOADS:
    case FETCH_TOP_FINISHED:
    case REFRESH:
    return {
      ...state,
      songs:  [
        ...action.payload.songs
      ],
      totalSongs: action.payload.total
    }
    case FETCH_LOCAL_SONGS:
      return {
        ...state,
        songs:  [
          ...action.payload
        ],
        totalSongs: action.payload.length
      }
    case LOAD_MORE:
      return {
        ...state,
        songs:  [
          ...state.songs,
          ...action.payload.songs
        ],
        totalSongs: action.payload.total
      }
    case ADD_BSABER_RATING:
    let newState = {...state}
      for(let i=0; i<newState.length; i++) {
        if(newState[i].key === action.payload.forKey && action.payload.rating !== undefined) {
          newState[i].bsaberRating = action.payload.rating[0]
          return newState
        }
      }
      return state
    case CHECK_DOWNLOADED_SONGS:
      return {
        ...state,
        downloadedSongs: action.payload
      }
    case SET_SCROLLTOP:
      return {
        ...state,
        scrollTop: action.payload
      }
    case SET_DOWNLOADING_COUNT:
      return {
        ...state,
        downloadingCount: action.payload
      }
    case SET_WAIT_LIST:
      return {
        ...state,
        waitingToDownload: action.payload
      }
    default:
      return state
  }
}