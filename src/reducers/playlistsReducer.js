import { FETCH_LOCAL_PLAYLISTS, LOAD_NEW_PLAYLIST_IMAGE, SET_NEW_PLAYLIST_OPEN, CLEAR_PLAYLIST_DIALOG, LOAD_PLAYLIST_DETAILS, CLEAR_PLAYLIST_DETAILS } from '../actions/types'

export default function(state={playlists: [], playlistDetails: {playlistTitle: '', playlistAuthor: '', playlistDescription: '', image: '', songs: []}, newCoverImageSource: '', newPlaylistDialogOpen: false}, action) {
  switch(action.type) {
    case FETCH_LOCAL_PLAYLISTS:
      return {
        ...state,
        playlists: action.payload
      }
    case LOAD_NEW_PLAYLIST_IMAGE:
      return {
        ...state,
        newCoverImageSource: action.payload
      }
    case SET_NEW_PLAYLIST_OPEN:
      return {
        ...state,
        newPlaylistDialogOpen: action.payload
      }
    case CLEAR_PLAYLIST_DIALOG:
      return {
        ...state,
        newCoverImageSource: ''
      }
    case LOAD_PLAYLIST_DETAILS:
      return {
        ...state,
        playlistDetails: {
          ...state.playlistDetails,
          ...action.payload
        }
      }
    case CLEAR_PLAYLIST_DETAILS:
      return {
        ...state,
        playlistDetails: {
          playlistTitle: '',
          playlistAuthor: '',
          playlistDescription: '',
          image: '',
          songs: []
        }
      }
    default:
      return state
  }
}