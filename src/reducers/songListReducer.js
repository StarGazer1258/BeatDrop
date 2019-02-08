import { FETCH_NEW, FETCH_TOP_DOWNLOADS, FETCH_TOP_FINISHED, LOAD_MORE, REFRESH, ADD_BSABER_RATING, FETCH_LOCAL_SONGS, SET_DOWNLOADED_SONGS, SET_SCROLLTOP, SET_SELECTING, SET_DOWNLOADING_COUNT, SET_WAIT_LIST, SET_SCANNING_FOR_SONGS, SELECT_ITEM, DESELECT_ITEM, DESELECT_ALL} from '../actions/types'

export default function(state={songs: [], scrollTop: 0, selecting: false, selected: [], downloadingCount: 0, waitingToDownload: [], downloadedSongs: [], songsDiscovered: 0, songsLoaded: 0, scanningForSongs: false, totalSongs: 0}, action) {
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
    let ratedState = {...state}
      for(let i=0; i<ratedState.length; i++) {
        if(ratedState[i].key === action.payload.forKey && action.payload.rating !== undefined) {
          ratedState[i].bsaberRating = action.payload.rating[0]
          return ratedState
        }
      }
      return state
    case SET_DOWNLOADED_SONGS:
      return {
        ...state,
        downloadedSongs: action.payload
      }
    case SET_SCROLLTOP:
      return {
        ...state,
        scrollTop: action.payload
      }
    case SET_SELECTING:
      return {
        ...state,
        selecting: action.payload
      }
    case SELECT_ITEM:
      return {
        ...state,
        selected: [
          ...state.selected,
          action.payload
        ]
      }
    case DESELECT_ITEM:
      let deselectedState = { ...state }
      deselectedState.selected.splice(deselectedState.selected.indexOf(action.payload), 1)
      if(deselectedState.selected.length === 0) deselectedState.selecting = false
      return deselectedState
    case DESELECT_ALL:
      return {
        ...state,
        selected: []
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
    case SET_SCANNING_FOR_SONGS:
      return {
        ...state,
        scanningForSongs: action.payload
      }
    default:
      return state
  }
}