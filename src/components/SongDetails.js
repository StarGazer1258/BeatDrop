import React, { Component } from 'react'
import '../css/SongDetails.scss'

import { connect } from 'react-redux'
import { downloadSong, deleteSong, checkDownloadedSongs } from '../actions/queueActions'
import { setPlaylistPickerOpen } from '../actions/playlistsActions'
import { setView } from '../actions/viewActions'
import { displayFlash } from '../actions/flashActions'

import Badge from './Badge'
import downloadIcon from '../assets/download-filled.png'
import deleteIcon from '../assets/delete-filled.png'
import addIcon from '../assets/add-filled.png'
import moreIcon from '../assets/more-filled.png'

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"

import Linkify from 'react-linkify'
import PlaylistPicker from './PlaylistPicker'
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
    this.closeDetail = this.closeDetail.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keyup', this.exitDetailsShortcut)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.exitDetailsShortcut)
  }

  render() {
    const songDetails = this.props.details
    if(songDetails.loading) {
      return (
        <div id="song-details" className="loading">
          <div className="close-icon" onClick={ this.closeDetail }/>
          <img className="cover-image" alt='' />
          <div className="details-info">
            <span className="details-title"/>
            <span className="details-subtitle"/>
            <div className="details-artist"/>
            <div className="action-buttons">
              <span className="action-button download-button">
                <span style={ { width: '101%' } }/>
                <img src={ downloadIcon } alt='' />
                <span>DOWNLOAD</span>
              </span>
              <span className="action-button playlist-add-button">
                <img src={ addIcon } alt='' />
                ADD TO PLAYLIST
              </span>
              <span className="action-button more-button">
                <img src={ moreIcon } alt='' />
              </span>
            </div>
            <div className="details-description"/>
            <div className="details-uploader"/>
            <div className="preview">
              <b>Preview:</b>
              <br />
              <audio id="preview" controls />
            </div>
          </div>
        </div>
      )
    } else {
      const songMetadata = songDetails.metadata
      const songName = songDetails.songName || songDetails._songName || (songMetadata && songMetadata.songName)
      const songSubName = songDetails.songSubName || songDetails._songSubName || (songMetadata && songMetadata.songSubName)
      const songAuthorName = songDetails.authorName || songDetails._songAuthorName || songDetails._songAuthorName || (songMetadata && songMetadata.songAuthorName)
      const songHash = songDetails.hash || songDetails.hashMd5
      const difficulties = songDetails.difficultyLevels || songDetails._difficultyBeatmapSets || (songMetadata && songMetadata.difficulties)

      return (
        <div id="song-details">
          <div className="close-icon" title="Close" onClick={ this.closeDetail }/>
          <img className="cover-image" src={ this.getCoverImageSrc(songDetails) } alt=''/>
          <div className="details-info">
            <span className="details-title" title={ songName }>{songName}</span>
            <div className="details-subtitle" title={ songSubName }>{songSubName}</div>
            <div className="details-artist" title={ songAuthorName }>{songAuthorName}</div>
            {this.props.downloadedSongs.some(song => song.hash === songDetails.hash) &&
            <div className="song-in-library">This song is in your library.</div>}
            <div className="action-buttons">
              {this.isDownloaded(songDetails) ? this.getDeleteButton() : this.getDownloadButton(songDetails)}
              {this.getAddToPlaylistButton()}
              <ContextMenuTrigger id={ songHash } holdToDisplay={ 0 }>
                <span className="action-button more-button">
                  <img src={ moreIcon } alt=''/>
                </span>
              </ContextMenuTrigger>
              <ContextMenu id={ songHash }>
                <MenuItem onClick={ (e) => {
                  e.stopPropagation()
                  if (this.props.details.hash !== undefined || this.props.details.hashMd5 !== undefined || this.props.details.key !== undefined) {
                    clipboard.writeText(`beatdrop://songs/details/${this.props.details.hash || this.props.details.hashMd5 || this.props.key}`)
                    this.props.displayFlash({
                      timeout: 5000,
                      color: 'lightgreen',
                      text: `Sharable Link for ${this.props.details.metadata.songName} copied to clipboard!`
                    })
                  } else {
                    this.props.displayFlash({ text: `Failed to identify song. Song may have been downloaded externally. Songs will now be scanned. Please try again when scanning is finished.` })
                    this.props.checkDownloadedSongs()
                    this.closeDetail()
                  }
                } }>Share</MenuItem>
                {(!!songDetails.id ? <MenuItem onClick={ (e) => {
                  e.stopPropagation()
                  shell.openExternal(`https://www.bsaber.com/songs/${this.props.details.id}`)
                } }>View on BeastSaber</MenuItem> : null)}
              </ContextMenu>
            </div>
            <Description details={ songDetails }/>
            <Uploader details={ songDetails }/>
            <Difficulties difficulties={ difficulties }/>
            <div className="preview">
              <b>Preview:</b>
              <br/>
              <audio id="preview" src={ songDetails.audioSource } controls controlsList="nodownload"/>
            </div>
          </div>
          <BeatSaver details={ songDetails }/>
          <PlaylistPicker song={ songDetails }/>
        </div>
      )
    }
  }

  getAddToPlaylistButton() {
    return <span className="action-button playlist-add-button" title="Add to Playlist" onClick={ () => {
      this.props.setPlaylistPickerOpen(true)
    } }><img src={ addIcon } alt=''/>ADD TO PLAYLIST</span>
  }

  getDownloadButton(songDetails) {
    return <span className="action-button download-button" onClick={ () => { this.props.downloadSong(this.props.details.hash) } }>
        <span style={
          { width: this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === songDetails.hash)] === undefined ? '102%' : this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === songDetails.hash)].progress + 5 }
        }/>
        <img src={ downloadIcon } alt=''/>
        <span>{this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === songDetails.hash)] === undefined ? 'DOWNLOAD' : this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === songDetails.hash)].progress === 100 ? 'DOWNLOAD' : this.props.queueItems[this.props.queueItems.findIndex(song => song.hash === songDetails.hash)].progress + '%'}</span>
    </span>
  }

  getDeleteButton() {
    return <span className="action-button delete-button" onClick={ () => {
      document.getElementById('preview').src = ''
      document.getElementById('preview').load()
      this.props.deleteSong(this.props.details.file || this.props.downloadedSongs[this.props.downloadedSongs.findIndex(song => song.hash === this.props.details.hash)].file)
    } }><img src={ deleteIcon } alt=''/>{this.state.deletionStatus}</span>
  }

  isDownloaded(songDetails) {
    return !!songDetails.file || this.props.downloadedSongs.some(song => song.hash === songDetails.hash)
  }

  getCoverImageSrc(songDetails) {
    return songDetails.coverURL.startsWith('file://') ? songDetails.coverURL : `https://beatsaver.com${songDetails.coverURL}`
  }

  closeDetail() {
    this.props.setView(this.props.previousView)
  }
}

const mapStateToProps = (state) => ({
  queueItems: state.queue.items,
  details: state.details,
  previousView: state.view.previousView,
  downloadedSongs: state.songs.downloadedSongs,
  newCoverImageSource: state.playlists.newCoverImageSource
})

export default connect(mapStateToProps, { downloadSong, deleteSong, setView, displayFlash, checkDownloadedSongs, setPlaylistPickerOpen })(SongDetails)