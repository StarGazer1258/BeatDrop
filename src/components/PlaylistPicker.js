import React, { Component } from 'react'
import '../css/PlaylistPicker.scss'

import Button from './Button'

import addIcon from '../assets/add-filled.png'
import { defaultPlaylistIcon } from '../b64Assets'

import { connect } from 'react-redux'
import { setPlaylistPickerOpen, setNewPlaylistDialogOpen, clearPlaylistDialog, createNewPlaylist, addSongToPlaylist, loadPlaylistCoverImage } from '../actions/playlistsActions'

class PlaylistPicker extends Component {
  render() {
      return (
        <>
          <div id="playlist-picker" className={ this.props.open ? '' : 'hidden' }>
            <div id="playlist-picker-inner">
              <h1>Add to playlist:</h1><Button onClick={ () => { this.props.setPlaylistPickerOpen(false) } }>Cancel</Button>
              <div id="playlist-picker-table">
                {this.props.playlists.map((playlist, i) => {
                  return <div className="playlist-picker-item" key={ i } onClick={ () => { this.props.addSongToPlaylist(this.props.song, playlist.file); this.props.setPlaylistPickerOpen(false) } }><img src={ playlist.image } alt=""/><div><div className="playlist-picker-item-title">{playlist.playlistTitle}</div><div className="flex-br"></div><div className="playlist-picker-item-author">{playlist.playlistAuthor}</div><div className="flex-br"></div>{playlist.songs.length} Songs</div></div>
                })}
                <div className="playlist-picker-item" onClick={ () => { this.props.setNewPlaylistDialogOpen(true); this.props.setPlaylistPickerOpen(false) } }><img src={ addIcon } alt=""/><div><div className="playlist-picker-item-title">Create New</div></div></div>
              </div>
            </div>
          </div>
          <div id="new-playlist-dialog-under" className={ this.props.newPlaylistDialogOpen ? '' : 'hidden' }>
            <div id="new-playlist-dialog">
              <div>
                <h2>New Playlist</h2>
                <label htmlFor="new-playlist-cover-image" id="new-playlist-add-cover-image"><img src={ this.props.newCoverImageSource || defaultPlaylistIcon } alt="" /></label>
                <label htmlFor="new-playlist-cover-image" id="image-text">Cover Image (Click to Change)</label>
                <input type="file" name="new-playlist-cover-image" id="new-playlist-cover-image" accept=".jpg,.jpeg,.png,.gif" onChange={ (e) => {this.props.loadPlaylistCoverImage(e.target.files[0].path || this.props.settings.newCoverImageSource)} } /><br />
              </div>
              <div id="new-playlist-info">
                <label htmlFor="new-playlist-title">Playlist Title</label>
                <input className="text-box" type='text' name="new-playlist-title" id="new-playlist-title" placeholder="Untitled Playlist" /><br /><br />
                <label htmlFor="new-playlist-author">Playlist Author</label>
                <input className="text-box" type="text" name="new-playlist-author" id="new-playlist-author" placeholder="Anonymous" /><br /><br />
                <label htmlFor="new-playlist-description">Playlist Description</label>
                <textarea className="text-area" name="new-playlist-description" id="new-playlist-description" cols="40" rows="7" placeholder="This playlist has no description." /><br /><br />
                <Button type="primary" onClick={ () => { this.props.createNewPlaylist({ playlistTitle: document.getElementById('new-playlist-title').value || 'Untitled Playlist', playlistAuthor: document.getElementById('new-playlist-author').value || 'Anonymous', playlistDescription: document.getElementById('new-playlist-description').value || 'This playlist has no description.' }); this.props.setNewPlaylistDialogOpen(false); this.props.setPlaylistPickerOpen(true); this.props.clearPlaylistDialog() } }>Create Playlist</Button>
                <Button onClick={ () => { this.props.setNewPlaylistDialogOpen(false); this.props.setPlaylistPickerOpen(true); this.props.clearPlaylistDialog() } }>Cancel</Button>
              </div>
            </div>
          </div>
        </>
      )
  }
}

const mapStateToProps = state => ({
  playlists: state.playlists.playlists,
  open: state.playlists.pickerOpen,
  newPlaylistDialogOpen: state.playlists.newPlaylistDialogOpen,
})

export default connect(mapStateToProps, { setPlaylistPickerOpen, setNewPlaylistDialogOpen, clearPlaylistDialog, createNewPlaylist, addSongToPlaylist, loadPlaylistCoverImage })(PlaylistPicker)