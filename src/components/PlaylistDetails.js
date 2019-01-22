import React, { Component } from 'react'
import '../css/PlaylistDetails.css'
import Sortable from 'sortablejs'

import { connect } from 'react-redux'
import { setView } from '../actions/viewActions'
import { setPlaylistEditing, savePlaylistDetails, deletePlaylist, fetchLocalPlaylists } from '../actions/playlistsActions'
import { downloadSong } from '../actions/queueActions'
import { displayWarning } from '../actions/warningActions'
import PropTypes from 'prop-types'

import deleteIcon from '../assets/delete-filled.png'
import addIcon from '../assets/add-filled.png'
import moreIcon from '../assets/more-filled.png'
import errorIcon from '../assets/error.png'

import Linkify from 'react-linkify'
const shell = window.require('electron').shell

let playlistSongs

class PlaylistDetails extends Component {

  constructor(props) {
    super(props)

    this.state = {
      moreOpen: false
    }
  }

  componentDidMount() {
    playlistSongs = new Sortable(document.getElementById('playlist-songs'), {
      animation: 150,
      dataIdAttr: 'data-id',
      disabled: !this.props.editing,
      scroll: true,
      bubbleScroll: true,
      scrollSensitivity: 150
    })
    document.addEventListener('mouseup', (e) => { if(!e.target.classList.contains('i-more-actions')) { this.setState({ moreOpen: false }) } })
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', (e) => { if(!e.target.classList.contains('i-more-actions')) { this.setState({ moreOpen: false }) } })
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
          <div className="close-icon" title="Close" onClick={() => { this.props.setPlaylistEditing(false); this.props.setView(this.props.previousView) }}></div>
          <div className="details-split">
            <div className="details-info">
              <img className="cover-image" src={this.props.playlistDetails.image} alt='' />
              {this.props.editing ? <input id="editing-playlist-title" className="text-box" placeholder="Title" defaultValue={this.props.playlistDetails.playlistTitle} /> : <span className="details-title" title={this.props.playlistDetails.playlistTitle}>{this.props.playlistDetails.playlistTitle}</span>}
              {this.props.editing ? <input id="editing-playlist-author" className="text-box editing-playlist-author" placeholder="Author" defaultValue={this.props.playlistDetails.playlistAuthor} /> : <div className="details-author" title={this.props.playlistDetails.playlistAuthor}>{this.props.playlistDetails.playlistAuthor}</div>}
              <div className="action-buttons">
              <span className={`action-button delete-button${this.props.editing ? ' hidden': ''}`} onClick={() => { this.props.deletePlaylist(this.props.playlistDetails.playlistFile); this.props.fetchLocalPlaylists() }}><img src={deleteIcon} alt='' />DELETE</span>
                <span className="action-button edit-button" onClick={() => { if(this.props.editing) { this.props.savePlaylistDetails({...this.props.playlistDetails, playlistTitle: document.getElementById('editing-playlist-title').value, playlistAuthor: document.getElementById('editing-playlist-author').value, playlistDescription: document.getElementById('editing-playlist-description').value, newOrder: playlistSongs.toArray()}) } this.props.setPlaylistEditing(!this.props.editing); playlistSongs.option('disabled', !playlistSongs.option('disabled')) }}><img src={addIcon} alt='' />{this.props.editing ? 'FINISH EDITING' : 'EDIT'}</span>
                <span id="more-button" className={`action-button more-button i-more-actions${this.props.editing ? ' hidden': ''}`} onClick={() => { this.setState({moreOpen: !this.state.moreOpen}) }}><img className="i-more-actions" src={moreIcon} alt='' /></span>
              </div>
              {this.state.moreOpen ? <div className="i-more-actions" id="more-actions" style={{top: document.getElementById('more-button').offsetTop + 30 + 'px', left: document.getElementById('more-button').offsetLeft + 'px'}}>
                <div className="more-action i-more-actions button primary" onClick={() => { let neededSongs = 0; for(let i = 0; i < this.props.playlistDetails.songs.length; i++) { if(!this.props.downloadedSongs.songKeys.includes(this.props.playlistDetails.songs[i].key)) { this.props.downloadSong(this.props.playlistDetails.songs[i].key); neededSongs++ } } if(neededSongs === 0) this.props.displayWarning({color: 'lightgreen', text: 'All available songs are already downloaded.', timeout: 5000}); this.setState({moreOpen: false}) } }>Download Missing Songs</div>
              </div> : null}
              {this.props.editing ? <textarea id="editing-playlist-description" className="text-area" placeholder="Description" defaultValue={this.props.playlistDetails.playlistDescription}></textarea> : this.props.playlistDetails.playlistDescription ? <div className="details-description"><b>{'Description: '}</b><Linkify properties={{onClick: (e) => {e.preventDefault(); e.stopPropagation(); if(window.confirm(`The link you just clicked is attemting to send you to: ${e.target.href}\nWould you link to continue?`)) { shell.openExternal(e.target.href) }}}}>{this.props.playlistDetails.playlistDescription}</Linkify></div> : ''}
            </div>
            <ol id="playlist-songs">
              {this.props.playlistDetails.songs.length === 0 ? <div style={{marginTop: '10px', color: 'silver', fontStyle: 'italic'}}>This playlist is empty.</div> : ''}
              {this.props.playlistDetails.songs.map((song, i) => {
                return <li className={`playlist-song-item${(playlistSongs ? (playlistSongs.option('disabled') ? '' : ' draggable') : '')}`} key={i} data-id={song.key}><span><img style={{boxShadow: 'none', background: 'transparent'}} src={song.coverUrl || errorIcon} alt="?" /><div className="playlist-item-title">{song.name || song.songName || 'Error: Song Unavailable.'}</div>{this.props.downloadedSongs.songKeys.includes(song.key) && !this.props.editing ? <div className='playlist-item-downloaded'></div> : null}{this.props.editing ? <div className='delete-playlist-item' onClick={(e) => {e.target.parentNode.parentNode.remove()}}></div> : null}</span></li>
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
  fetchLocalPlaylists: PropTypes.func.isRequired,
  downloadSong: PropTypes.func.isRequired,
  displayWarning: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  loading: state.loading,
  previousView: state.view.previousView,
  playlistDetails: state.playlists.playlistDetails,
  editing: state.playlists.editing,
  downloadedSongs: state.songs.downloadedSongs
})

export default connect(mapStateToProps, { setView, setPlaylistEditing, savePlaylistDetails, deletePlaylist, fetchLocalPlaylists, downloadSong, displayWarning })(PlaylistDetails)