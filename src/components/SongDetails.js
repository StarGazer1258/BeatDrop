import React, { Component } from 'react'
import '../css/SongDetails.scss'

import { connect } from 'react-redux'
import { downloadSong, deleteSong, checkDownloadedSongs } from '../actions/queueActions'
import { setPlaylistPickerOpen } from '../actions/playlistsActions'
import { setView } from '../actions/viewActions'
import { displayWarning } from '../actions/warningActions'

import Badge from './Badge'
import downloadIcon from '../assets/download-filled.png'
import deleteIcon from '../assets/delete-filled.png'
import addIcon from '../assets/add-filled.png'
import moreIcon from '../assets/more-filled.png'

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import Linkify from 'react-linkify'
import PlaylistPicker from './PlaylistPicker';
const { shell, clipboard } = window.require('electron')

const exitDetailsShortcut = function (e) { if(e.keyCode === 27) { this.props.setView(this.props.previousView) } }

function Difficulties(props) {
  let difficulties = props.difficulties
  let badges = []
  if(Array.isArray(difficulties)) {
    for(let i = 0; i < difficulties[0]._difficultyBeatmaps.length; i++) {
      if(difficulties[0]._difficultyBeatmaps[i]._difficulty === 'Easy') {
        badges.push({
          text: 'Easy',
          backgroundColor: 'teal',
          color: 'white'
        })
      }
      if(difficulties[0]._difficultyBeatmaps[i]._difficulty === 'Normal') {
        badges.push({
          text: 'Normal',
          backgroundColor: 'green',
          color: 'white'
        })
      }
      if(difficulties[0]._difficultyBeatmaps[i]._difficulty === 'Hard') {
        badges.push({
          text: 'Hard',
          backgroundColor: 'orange',
          color: 'white'
        })
      }
      if(difficulties[0]._difficultyBeatmaps[i]._difficulty === 'Expert') {
        badges.push({
          text: 'Expert',
          backgroundColor: 'darkred',
          color: 'white'
        })
      }
      if(difficulties[0]._difficultyBeatmaps[i]._difficulty === 'ExpertPlus') {
        badges.push({
          text: 'Expert+',
          backgroundColor: 'purple',
          color: 'white'
        })
      }
    }
  } else {
    if(difficulties.easy) {
      badges.push({
        text: 'Easy',
        backgroundColor: 'teal',
        color: 'white'
      })
    }
    if(difficulties.normal) {
      badges.push({
        text: 'Normal',
        backgroundColor: 'green',
        color: 'white'
      })
    }
    if(difficulties.hard) {
      badges.push({
        text: 'Hard',
        backgroundColor: 'orange',
        color: 'white'
      })
    }
    if(difficulties.expert) {
      badges.push({
        text: 'Expert',
        backgroundColor: 'darkred',
        color: 'white'
      })
    }
    if(difficulties.expertPlus) {
      badges.push({
        text: 'Expert+',
        backgroundColor: 'purple',
        color: 'white'
      })
    }
  }
  return badges.map((badge, i) => {
    return <Badge key={ i } backgroundColor={ badge.backgroundColor } color={ badge.color }>{badge.text}</Badge>
  })
}

function Description(props) {
  if(!props.description) return null
  return <div className="details-description"><b>Description:</b><br /><Linkify properties={ { onClick: (e) => {e.preventDefault(); e.stopPropagation(); if(window.confirm(`The link you just clicked is attemting to send you to: ${e.target.href}\nWould you like to continue?`)) { shell.openExternal(e.target.href) }} } }>{props.description}</Linkify></div>
}

function Uploader(props) {
  if(!props.uploader) return null
  return <div className="details-uploader" title={ `Uploaded by: ${props.uploader.username}` }><b>Uploaded by:</b> {props.uploader.username}</div>
}

function BeatSaver(props) {
  if(props.details.stats === undefined) return null
  return (
    <div className="details-ratings">
      <b>BeatSaver Details:</b>
      <div className="details-downloads">&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="downloads">⏬</span> Downloads: </b>{props.details.stats.downloadCount}</div>
      <div className="details-finishes">&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="finishes">🏁</span> Finishes: </b>{props.details.stats.plays}</div>
      <div className="details-updownvotes">&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="upvotes">👍</span>Upvotes: </b>{props.details.stats.upVotes}</div>
      <div className="details-updownvotes">&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="downvotes">👎</span> Downvotes: </b>{props.details.stats.downVotes}</div>
      <br />
      <br />
      <b>BeastSaber Ratings:</b>
      <div className="details-overall-rating">&nbsp;&nbsp;&nbsp;&nbsp;<b>Overall Rating: </b>{props.details.ratings ? props.details.ratings.overall_rating > 0 ? props.details.ratings.overall_rating : 'No Rating' : '...'}</div>
      <div className="details-fun-factor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span role="img" aria-label="rhythm">😃</span><b>Fun Factor: </b>{props.details.ratings ? props.details.ratings.average_ratings.fun_factor > 0 ? props.details.ratings.average_ratings.fun_factor : 'N/A' : '...'}</div>
      <div className="details-overall-rating">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="rhythm">🎶</span>Rhythm: </b>{props.details.ratings ? props.details.ratings.average_ratings.rhythm > 0 ? props.details.ratings.average_ratings.rhythm : 'N/A' : '...'}&emsp;&emsp;&emsp;</div>
      <div className="details-overall-rating">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="flow">🌊</span>Flow: </b>{props.details.ratings ? props.details.ratings.average_ratings.flow > 0 ? props.details.ratings.average_ratings.flow : 'N/A' : '...'}&emsp;&emsp;&emsp;&emsp;</div>
      <div className="details-overall-rating">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="pattern quality">💠</span>Pattern Quality: </b>{props.details.ratings ? props.details.ratings.average_ratings.pattern_quality > 0 ? props.details.ratings.average_ratings.pattern_quality : 'N/A' : '...'}</div>
      <div className="details-overall-rating">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="readability">👓</span>Readability: </b>{props.details.ratings ? props.details.ratings.average_ratings.readability > 0 ? props.details.ratings.average_ratings.readability : 'N/A' : '...'}</div>
      <div className="details-overall-rating">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><span role="img" aria-label="level quality">✔️</span>Level Quality: </b>{props.details.ratings ? props.details.ratings.average_ratings.level_quality > 0 ? props.details.ratings.average_ratings.level_quality : 'N/A' : '...'}</div>
    </div>
  )
}

class SongDetails extends Component {

  constructor(props) {
    super(props)

    this.state = {
      previewEnabled: true,
      deletionStatus: 'DELETE'
    }

    this.exitDetailsShortcut = exitDetailsShortcut.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keyup', this.exitDetailsShortcut)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.exitDetailsShortcut)
  }

  render() {
    if(this.props.details.loading) {
      return (
        <div id="song-details" className="loading">
          <div className="close-icon" onClick={ () => {this.props.setView(this.props.previousView)} }></div>
          <img className="cover-image" alt='' />
          <div className="details-info">
            <span className="details-title"></span>
            <span className="details-subtitle"></span>
            <div className="details-artist"></div>
            <div className="action-buttons">
            <span className="action-button download-button"><span style={ { width: '101%' } }></span><img src={ downloadIcon } alt='' /><span>DOWNLOAD</span></span>
              <span className="action-button playlist-add-button"><img src={ addIcon } alt='' />ADD TO PLAYLIST</span>
              <span className="action-button more-button"><img src={ moreIcon } alt='' /></span>
            </div>
            <div className="details-description"></div>
            <div className="details-uploader"></div>
            <div className="preview"><b>Preview:</b><br /><audio id="preview" controls /></div>
          </div>
        </div>
      )
    } else {
      return (
        <div id="song-details">
          <div className="close-icon" title="Close" onClick={ () => {this.props.setView(this.props.previousView)} }></div>
          <img className="cover-image" src={ this.props.details.coverURL.startsWith('file://') ? this.props.details.coverURL : `https://beatsaver.com${this.props.details.coverURL}` } alt='' />
          <div className="details-info">
            <span className="details-title" title={ this.props.details.songName || this.props.details._songName || this.props.details.metadata.songName }>{ this.props.details.songName || this.props.details._songName || this.props.details.metadata.songName }</span>
            <div className="details-subtitle" title={ this.props.details.songSubName || this.props.details._songSubName || this.props.details.metadata ? this.props.details.metadata.songSubName : '' }>{ this.props.details.songSubName || this.props.details._songSubName || this.props.details.metadata ? this.props.details.metadata.songSubName : '' }</div>
            <div className="details-artist" title={ this.props.details.authorName || this.props.details.songAuthorName || this.props.details._songAuthorName || this.props.details.metadata.songAuthorName }>{ this.props.details.authorName || this.props.details.songAuthorName || this.props.details._songAuthorName || this.props.details.metadata.songAuthorName }</div>
            {this.props.downloadedSongs.some(song => song.hash === this.props.details.hash) ? <div className="song-in-library">This song is in your library.</div> : null}
            <div className="action-buttons">
              {(!!this.props.details.file || this.props.downloadedSongs.some(song => song.hash === this.props.details.hash)) ?
                <span className="action-button delete-button" onClick={ () => {document.getElementById('preview').src = ''; document.getElementById('preview').load(); this.props.deleteSong(this.props.details.file || this.props.downloadedSongs[this.props.downloadedSongs.findIndex(song => song.hash === this.props.details.hash)].file)} }><img src={ deleteIcon } alt='' />{this.state.deletionStatus}</span>
              :
                <span className="action-button download-button" onClick={ () => {this.props.downloadSong(this.props.details.hash)} }><span style={ { width: this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === this.props.details.hash)] === undefined ? '102%' : this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === this.props.details.hash)].progress + 5 } }></span><img src={ downloadIcon } alt='' /><span>{this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === this.props.details.hash)] === undefined ? 'DOWNLOAD' : this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === this.props.details.hash)].progress === 100 ? 'DOWNLOAD' : this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === this.props.details.hash)].progress + '%'}</span></span>
              }
              <span className="action-button playlist-add-button" title="Add to Playlist" onClick={ () => { this.props.setPlaylistPickerOpen(true) } }><img src={ addIcon } alt='' />ADD TO PLAYLIST</span>
              <ContextMenuTrigger id={ this.props.details.hash || this.props.details.hashMd5 } holdToDisplay={ 0 }><span className="action-button more-button"><img src={ moreIcon } alt='' /></span></ContextMenuTrigger>
              <ContextMenu id={ this.props.details.hash || this.props.details.hashMd5 }>
                <MenuItem onClick={ (e) => {e.stopPropagation(); if(this.props.details.hash !== undefined || this.props.details.hashMd5 !== undefined || this.props.details.key !== undefined) { clipboard.writeText(`beatdrop://songs/details/${this.props.details.hash || this.props.details.hashMd5 || this.props.key}`); this.props.displayWarning({ timeout: 5000, color:'lightgreen', text: `Sharable Link for ${this.props.details.metadata.songName} copied to clipboard!` })} else { this.props.displayWarning({ text: `Failed to identify song. Song may have been downloaded externally. Songs will now be scanned. Please try again when scanning is finished.` }); this.props.checkDownloadedSongs(); this.props.setView(this.props.previousView) }} }>Share</MenuItem>
                {(!!this.props.details.id ? <MenuItem onClick={ (e) => {e.stopPropagation(); shell.openExternal(`https://www.bsaber.com/songs/${this.props.details.id}`)} }>View on BeastSaber</MenuItem> : null)}
              </ContextMenu>
            </div>
            <Description details={ this.props.details } />
            <Uploader details={ this.props.details } />
            <Difficulties difficulties={ this.props.details.difficultyLevels || this.props.details._difficultyBeatmapSets || this.props.details.metadata.difficulties } />
            <div className="preview"><b>Preview:</b><br /><audio id="preview" src={ this.props.details.audioSource } controls controlsList="nodownload" /></div>
          </div>
          <BeatSaver details={ this.props.details } />
          <PlaylistPicker song={ this.props.details } />
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  queueItems: state.queue.items,
  details: state.details,
  previousView: state.view.previousView,
  downloadedSongs: state.songs.downloadedSongs,
  newCoverImageSource: state.playlists.newCoverImageSource
})

export default connect(mapStateToProps, { downloadSong, deleteSong, setView, displayWarning, checkDownloadedSongs, setPlaylistPickerOpen })(SongDetails)