import React, { Component } from 'react'
import '../css/SongDetails.css'

import { connect } from 'react-redux'
import { setDetailsOpen } from '../actions/detailsActions'
import { downloadSong, deleteSong } from '../actions/queueActions'
import { setView } from '../actions/viewActions'

import Badge from './Badge'
import downloadIcon from '../assets/download-filled.png'
import deleteIcon from '../assets/delete-filled.png'
import addIcon from '../assets/add-filled.png'
import moreIcon from '../assets/more-filled.png'

function Difficulties(props) {
  if(!props.difficulties) return null
  let badges = []
  if(Object.keys(props.difficulties).includes('Easy')) {
    badges.push({
      text: 'Easy',
      backgroundColor: 'teal',
      color: 'white'
    })
  }
  if(Object.keys(props.difficulties).includes('Normal')) {
    badges.push({
      text: 'Normal',
      backgroundColor: 'green',
      color: 'white'
    })
  }
  if(Object.keys(props.difficulties).includes('Hard')) {
    badges.push({
      text: 'Hard',
      backgroundColor: 'orange',
      color: 'white'
    })
  }
  if(Object.keys(props.difficulties).includes('Expert')) {
    badges.push({
      text: 'Expert',
      backgroundColor: 'darkred',
      color: 'white'
    })
  }
  if(Object.keys(props.difficulties).includes('ExpertPlus')) {
    badges.push({
      text: 'Expert+',
      backgroundColor: 'purple',
      color: 'white'
    })
  }
  return (
    <div className="details-difficulties">
      <div><b>Available Difficulties:</b></div>
      {
        badges.map((badge, i) => {
          return <Badge key={i} backgroundColor={badge.backgroundColor} color={badge.color}>{badge.text}</Badge>
        })
      }
    </div>
  )
}

function Description(props) {
  if(!props.details.song.description) return null
  return <div className="details-description"><b>Description:</b><br />{props.details.song.description}</div>
}

function Uploader(props) {
  if(!props.details.song.uploader) return null
  return <div className="details-uploader" title={`Uploaded by: ${props.details.song.uploader}`}><b>Uploaded by:</b> {props.details.song.uploader}</div>
}

function BeatSaver(props) {
  if(!props.details.song.downloadCount) return null
  return (
    <div className="details-ratings">
      <b>BeatSaver Details:</b>
      <div className="details-downloads">&nbsp;&nbsp;&nbsp;&nbsp;<b>Downloads: </b>{props.details.song.downloadCount}</div>
      <div className="details-updownvotes">&nbsp;&nbsp;&nbsp;&nbsp;<b>Upvotes: </b>{props.details.song.upVotes} <b>Downvotes: </b>{props.details.song.downVotes}</div>
      <div className="details-finishes">&nbsp;&nbsp;&nbsp;&nbsp;<b>Finishes: </b>{props.details.song.playedCount}</div>
      <br />
    </div>
  )
}

function PrimeAction(props) {
  if(!!props.details.song.file) {
    return <span className="action-button delete-button" onClick={() => {props.deleteSong(props.details.song.file)}}><img src={deleteIcon} alt='' />DELETE</span>
  } else {
    return <span className="action-button download-button" onClick={() => {props.downloadSong(props.details.song.key)}}><span style={{width: props.queueItems[0] === undefined ? '101%' : props.queueItems[0].progress + 5}}></span><img src={downloadIcon} alt='' /><span>{props.queueItems[0] === undefined ? 'DOWNLOAD' : props.queueItems[0].progress === 100 ? 'DOWNLOAD' : props.queueItems[0].progress + '%'}</span></span>
  }
}

class SongDetails extends Component {

  render() {
    if(this.props.details.loading) {
      return (
        <div id="song-details" className="loading">
          <div className="close-icon" onClick={() => {this.props.setView(this.props.previousView)}}></div>
          <img className="cover-image" alt='' />
          <div className="details-info">
            <span className="details-title"></span>
            <span className="details-subtitle"></span>
            <div className="details-artist"></div>
            <div className="action-buttons">
              <span className="action-button download-button"><img src={downloadIcon} alt='' />DOWNLOAD</span>
              <span className="action-button playlist-add-button"><img src={addIcon} alt='' />ADD TO PLAYLIST</span>
              <span className="action-button more-button"><img src={moreIcon} alt='' /></span>
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
          <div className="close-icon" onClick={() => {this.props.setView(this.props.previousView)}}></div>
          <img className="cover-image" src={this.props.details.song.coverUrl} alt='' />
          <div className="details-info">
            <span className="details-title" title={this.props.details.song.songName}>{this.props.details.song.songName}</span>
            <div className="details-subtitle" title={this.props.details.song.songSubName}>{this.props.details.song.songSubName}</div>
            <div className="details-artist" title={this.props.details.song.authorName}>{this.props.details.song.authorName}</div>
            <div className="action-buttons">
              <PrimeAction details={this.props.details} downloadSong={this.props.downloadSong} deleteSong={this.props.deleteSong} queueItems={this.props.queueItems} />
              <span className="action-button playlist-add-button"><img src={addIcon} alt='' />ADD TO PLAYLIST</span>
              <span className="action-button more-button"><img src={moreIcon} alt='' /></span>
            </div>
            <Description details={this.props.details} />
            <Uploader details={this.props.details} />
            <Difficulties difficulties={this.props.details.song.difficulties} />
            <div className="preview"><b>Preview:</b><br /><audio id="preview" src={this.props.details.audioSource} controls /></div>
          </div>
          <BeatSaver details={this.props.details} />
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  queueItems: state.queue.items,
  details: state.details,
  previousView: state.view.previousView
})

export default connect(mapStateToProps, { setDetailsOpen, downloadSong, deleteSong, setView })(SongDetails)