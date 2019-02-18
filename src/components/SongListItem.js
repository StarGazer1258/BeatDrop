import React, { Component } from 'react'
import '../css/SongListItem.css'

import Loader from '../assets/loading-dots2.png'
import LibraryBlue from '../assets/library-blue.png'

import Badge from './Badge';

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadDetails } from '../actions/detailsActions'
import { setScrollTop } from '../actions/songListActions'

function Uploader(props) {
  if(!props.isDownloaded && !!props.uploader) return (
    <div className="uploader">Uploaded by: {props.uploader}</div>
  )
  return null
}

function Details(props) {
  if(!props.downloads) return null
  return (
    <div className="beatmap-details">
      <div className="downloads">{props.downloads} <span role="img" aria-label="downloads">⏬</span>{(props.downloads === 1 ? '' : '')}</div>
      <div className="upvotes">{props.upvotes} <span role="img" aria-label="upvotes">👍</span>/{props.downvotes} <span role="img" aria-label="downvotes">👎</span></div>
      <div className="plays">{props.plays} <span role="img" aria-label="finishes">🏁</span></div>
    </div>
  )
}

function Difficulties(props) {
  let difficulties = props.difficulties
  if(typeof props.difficulties[0] === 'object') {
    difficulties = {}
    for(let i = 0; i < props.difficulties.length; i++) {
      difficulties[props.difficulties[i].difficulty] = props.difficulties[i]
    }
  }
  let badges = []
  if(Object.keys(difficulties).includes('Easy')) {
    badges.push({
      text: 'Easy',
      backgroundColor: 'teal',
      color: 'white'
    })
  }
  if(Object.keys(difficulties).includes('Normal')) {
    badges.push({
      text: 'Normal',
      backgroundColor: 'green',
      color: 'white'
    })
  }
  if(Object.keys(difficulties).includes('Hard')) {
    badges.push({
      text: 'Hard',
      backgroundColor: 'orange',
      color: 'white'
    })
  }
  if(Object.keys(difficulties).includes('Expert')) {
    badges.push({
      text: 'Expert',
      backgroundColor: 'darkred',
      color: 'white'
    })
  }
  if(Object.keys(difficulties).includes('ExpertPlus')) {
    badges.push({
      text: 'Expert+',
      backgroundColor: 'purple',
      color: 'white'
    })
  }
  return badges.map((badge, i) => {
    return <Badge key={i} backgroundColor={badge.backgroundColor} color={badge.color}>{badge.text}</Badge>
  })
}

class SongListItem extends Component {

  shouldComponentUpdate() {
    return this.props.bsaberRating !== undefined
  }

  render() {
    if(this.props.loading) {
      return (
        <li className='song-list-item loading'>
          <img src={Loader} alt={this.props.key} />
        </li>
      )
    } else {
      return (
        <li className="song-list-item" onClick={() => { this.props.setScrollTop(document.getElementById('song-list').scrollTop); this.props.loadDetails(this.props.file || this.props.songKey) }}>
          <img className="cover-image" src={this.props.imageSource} alt={this.props.songKey} />
          {(!!this.props.file || this.props.downloadedSongs.some(dsong => dsong.hash === this.props.hash)) ? <span className="download-status"><img src={LibraryBlue} alt=""/>In Library</span> : null}
          <div className="song-details">
            <div className="song-title">{this.props.title}<span className="id">{!!this.props.songKey ? this.props.songKey : ''}</span></div>
            <div className="song-artist">{this.props.artist}</div>
            <Uploader uploader={this.props.uploader} isDownloaded={this.props.isDownloaded} />
            <Difficulties difficulties={this.props.difficulties} />
          </div>
          <Details downloads={this.props.downloads} upvotes={this.props.upvotes} downvotes={this.props.downvotes} plays={this.props.plays} />
        </li>
      )
    }
  }
}

SongListItem.propTypes = ({
  loadDetails: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired
})

const mapStateToProps = state => ({
  details: state.details,
  downloadedSongs: state.songs.downloadedSongs
})

export default connect(mapStateToProps, { loadDetails, setScrollTop })(SongListItem)