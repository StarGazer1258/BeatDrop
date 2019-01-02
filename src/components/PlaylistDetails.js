import React, { Component } from 'react'
import '../css/PlaylistDetails.css'

import { connect } from 'react-redux'
import { setView } from '../actions/viewActions'
import PropTypes from 'prop-types'

import deleteIcon from '../assets/delete-filled.png'
import addIcon from '../assets/add-filled.png'
import moreIcon from '../assets/more-filled.png'

class PlaylistDetails extends Component {

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
          <div className="close-icon" onClick={() => {this.props.setView(this.props.previousView)}}></div>
          <img className="cover-image" src={this.props.playlistDetails.image} alt='' />
          <div className="details-info">
            <span className="details-title" title={this.props.playlistDetails.playlistTitle}>{this.props.playlistDetails.playlistTitle}</span>
            <div className="details-author" title={this.props.playlistDetails.playlistAuthor}>{this.props.playlistDetails.playlistAuthor}</div>
            <div className="action-buttons">
            <span className="action-button delete-button"><img src={deleteIcon} alt='' />DELETE</span>
              <span className="action-button edit-button"><img src={addIcon} alt='' />EDIT</span>
              <span className="action-button more-button"><img src={moreIcon} alt='' /></span>
            </div>
            <div className="details-description"><b>{'Description: '}</b>{this.props.playlistDetails.playlistDescription}</div>
            <ol id="playlist-songs">
              {this.props.playlistDetails.songs.map((song, i) => {
                return <li className="playlist-song-item" key={i}><span>{song.songName}</span></li>
              })}
            </ol>
          </div>
        </div>
      )
    }
  }
}

PlaylistDetails.propTypes = {
  loading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  loading: state.loading,
  previousView: state.view.previousView,
  playlistDetails: state.playlists.playlistDetails
})

export default connect(mapStateToProps, { setView })(PlaylistDetails)