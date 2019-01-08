import React, { Component } from 'react'
import '../css/PlaylistDetails.css'
import Sortable from 'sortablejs'

import { connect } from 'react-redux'
import { setView } from '../actions/viewActions'
import { setPlaylistEditing, savePlaylistDetails, deletePlaylist, fetchLocalPlaylists } from '../actions/playlistsActions'
import PropTypes from 'prop-types'

import deleteIcon from '../assets/delete-filled.png'
import addIcon from '../assets/add-filled.png'
import moreIcon from '../assets/more-filled.png'

let playlistSongs

class PlaylistDetails extends Component {

  componentDidMount() {
    playlistSongs = new Sortable(document.getElementById('playlist-songs'), {
      animation: 150,
      dataIdAttr: 'data-id',
      disabled: true,
      scroll: true,
      bubbleScroll: true,
      scrollSensitivity: 150
    })
  }

  render() {
    if(this.props.loading) {
      return (
        <div id="plsylist-details" className="loading">
          <div className="close-icon" onClick={() => {this.props.setView(this.props.previousView)}}></div>
          <img className="cover-image" alt='' />
          <div className="details-info">
            <span className="details-title"></span>
            <div className="details-artist"></div>
            <div className="action-buttons">
              <span className="action-button delete-button"><img src={deleteIcon} alt='' />DELETE</span>
              <span className="action-button edit-button"><img src={addIcon} alt='' />EDIT</span>
              <span className="action-button more-button"><img src={moreIcon} alt='' /></span>
            </div>
            <div className="details-description"></div>
          </div>
        </div>
      )
    } else {
      return (
        <div id="playlist-details">
          <div className="close-icon" onClick={() => { this.props.setPlaylistEditing(false); this.props.setView(this.props.previousView) }}></div>
          <div className="details-split">
            <div className="details-info">
              <img className="cover-image" src={this.props.playlistDetails.image} alt='' />
              {this.props.editing ? <input id="editing-playlist-title" className="text-box" placeholder="Title" defaultValue={this.props.playlistDetails.playlistTitle} /> : <span className="details-title" title={this.props.playlistDetails.playlistTitle}>{this.props.playlistDetails.playlistTitle}</span>}
              {this.props.editing ? <input id="editing-playlist-author" className="text-box editing-playlist-author" placeholder="Author" defaultValue={this.props.playlistDetails.playlistAuthor} /> : <div className="details-author" title={this.props.playlistDetails.playlistAuthor}>{this.props.playlistDetails.playlistAuthor}</div>}
              <div className="action-buttons">
              <span className={`action-button delete-button${this.props.editing ? ' hidden': ''}`} onClick={() => { this.props.deletePlaylist(this.props.playlistDetails.playlistFile); this.props.fetchLocalPlaylists() }}><img src={deleteIcon} alt='' />DELETE</span>
                <span className="action-button edit-button" onClick={() => { if(this.props.editing) { this.props.savePlaylistDetails({...this.props.playlistDetails, playlistTitle: document.getElementById('editing-playlist-title').value, playlistAuthor: document.getElementById('editing-playlist-author').value, playlistDescription: document.getElementById('editing-playlist-description').value, newOrder: playlistSongs.toArray()}) } this.props.setPlaylistEditing(!this.props.editing); playlistSongs.option('disabled', !playlistSongs.option('disabled')) }}><img src={addIcon} alt='' />{this.props.editing ? 'FINISH EDITING' : 'EDIT'}</span>
                <span className={`action-button more-button${this.props.editing ? ' hidden': ''}`}><img src={moreIcon} alt='' /></span>
              </div>
              {this.props.editing ? <textarea id="editing-playlist-description" className="text-area" placeholder="Description" defaultValue={this.props.playlistDetails.playlistDescription}></textarea> : this.props.playlistDetails.playlistDescription ? <div className="details-description"><b>{'Description: '}</b>{this.props.playlistDetails.playlistDescription}</div> : ''}
            </div>
            <ol id="playlist-songs">
              {this.props.playlistDetails.songs.length === 0 ? <div style={{marginTop: '10px', color: 'silver', fontStyle: 'italic'}}>This playlist is empty.</div> : ''}
              {this.props.playlistDetails.songs.map((song, i) => {
                return <li className={`playlist-song-item${(playlistSongs ? (playlistSongs.option('disabled') ? '' : ' draggable') : '')}`} key={i} data-id={song.key}><span>{song.songName}</span></li>
              })}
            </ol>
          </div>
        </div>
      )
    }
  }
}

PlaylistDetails.propTypes = {
  loading: PropTypes.bool.isRequired,
  previousView: PropTypes.string.isRequired,
  playlistDetails: PropTypes.object.isRequired,
  setView: PropTypes.func.isRequired,
  setPlaylistEditing: PropTypes.func.isRequired,
  savePlaylistDetails: PropTypes.func.isRequired,
  deletePlaylist: PropTypes.func.isRequired,
  fetchLocalPlaylists: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  loading: state.loading,
  previousView: state.view.previousView,
  playlistDetails: state.playlists.playlistDetails,
  editing: state.playlists.editing
})

export default connect(mapStateToProps, { setView, setPlaylistEditing, savePlaylistDetails, deletePlaylist, fetchLocalPlaylists })(PlaylistDetails)