import { FETCH_LOCAL_PLAYLISTS, LOAD_NEW_PLAYLIST_IMAGE, SET_NEW_PLAYLIST_OPEN, CLEAR_PLAYLIST_DIALOG, LOAD_PLAYLIST_DETAILS, LOAD_PLAYLIST_SONGS, CLEAR_PLAYLIST_DETAILS, SET_PLAYLIST_EDITING, SET_PLAYLIST_PICKER_OPEN } from '../actions/types'

export default function(state = { playlists: [], playlistDetails: { playlistTitle: '', playlistAuthor: '', playlistDescription: '', image: '', songs: [] }, newCoverImageSource: '', newPlaylistDialogOpen: false, pickerOpen: false, editing: false }, action) {
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

    case SET_PLAYLIST_PICKER_OPEN:
      return {
        ...state,
        pickerOpen: action.payload
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
    case LOAD_PLAYLIST_SONGS:
      let sortedSongs = [
        ...state.playlistDetails.songs,
        action.payload
      ]
      sortedSongs.sort((a, b) => a.order - b.order)
      return {
        ...state,
        playlistDetails: {
          ...state.playlistDetails,
          songs: [
            ...sortedSongs
          ]
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
    case SET_PLAYLIST_EDITING:
      return {
        ...state,
        editing: action.payload
      }
    default:
      return state
  }
}