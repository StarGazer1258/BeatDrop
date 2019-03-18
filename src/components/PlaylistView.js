import React, { Component } from 'react'
import '../css/PlaylistView.scss'

import { loadPlaylistCoverImage, setNewPlaylistDialogOpen, createNewPlaylist, clearPlaylistDialog, loadPlaylistDetails } from '../actions/playlistsActions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Button from './Button'
import { defaultPlaylistIcon } from '../b64Assets'

class PlaylistView extends Component {

  render() {
    return (
      <div id="playlists-view">
        <h1>Playlists</h1><span id="new-playlist-button" title="New Playlist" onClick={ () => { this.props.setNewPlaylistDialogOpen(true) } }>+</span>

        {this.props.playlists.map((playlist, i) => {
          return (
            <div key={ i } className="playlist-item" onClick={ () => {this.props.loadPlaylistDetails(playlist.file)} }>
              <img src={ playlist.image } alt=""/>
              <div className="playlist-item-info">
                <span className="playlist-item-title">{playlist.playlistTitle}</span><span className="playlist-item-length-info">{playlist.songs.length} Songs</span>
                <div className="playlist-item-author">Created by: {playlist.playlistAuthor}</div>
                <div className={ `playlist-item-description${(!playlist.playlistDescription || playlist.playlistDescription === 'This playlist has no description.') ? ' no-description' : ''}` }>{playlist.playlistDescription || "This playlist must be updated to support descriptions."}</div>
              </div>
            </div>
          )
        })}

        <div id="new-playlist-dialog-under" style={ { display: (this.props.newPlaylistDialogOpen ? 'block' : 'none') } }>
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
              <Button type="primary" onClick={ () => { this.props.createNewPlaylist({ playlistTitle: document.getElementById('new-playlist-title').value || 'Untitled Playlist', playlistAuthor: document.getElementById('new-playlist-author').value || 'Anonymous', playlistDescription: document.getElementById('new-playlist-description').value || 'This playlist has no description.' }); this.props.setNewPlaylistDialogOpen(false); this.props.clearPlaylistDialog() } }>Create Playlist</Button>
              <Button onClick={ () => { this.props.setNewPlaylistDialogOpen(false); this.props.clearPlaylistDialog() } }>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PlaylistView.propsTypes = {
  loadPlaylistCoverImage: PropTypes.func.isRequired,
  setNewPlaylistDialogOpen: PropTypes.func.isRequired,
  createNewPlaylist: PropTypes.func.isRequired,
  clearPlaylistDialog: PropTypes.func.isRequired,
  newCoverImageSource: PropTypes.string.isRequired,
  playlists: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  newCoverImageSource: state.playlists.newCoverImageSource,
  newPlaylistDialogOpen: state.playlists.newPlaylistDialogOpen,
  playlists: state.playlists.playlists,
  settings: state.settings
})

export default connect(mapStateToProps, { loadPlaylistCoverImage, setNewPlaylistDialogOpen, createNewPlaylist, clearPlaylistDialog, loadPlaylistDetails })(PlaylistView)