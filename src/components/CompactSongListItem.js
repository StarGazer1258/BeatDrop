import React, { Component } from 'react';
import '../css/CompactSongListItem.css'
import Loader from '../assets/loading-dots2.png'
import Badge from './Badge'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadDetails } from '../actions/detailsActions'
import { setScrollTop } from '../actions/songListActions'

function Uploader(props) {
  if(!!props.uploader) return (
    <div class="uploader">Uploaded by: {props.uploader}</div>
  )
  return null
}

function Details(props) {
  if(props.isDownloaded) return (
   <div className="beatmap-details">
      <div className="downloads">{props.dowloads}</div>
      <div className="upvotes">{props.upvotes}</div>
      <div className="plays">{props.plays}</div>
      <a href={`https://bsaber.com/songs/${props.key}#ratemap`}>Rate this song</a>
    </div>
  )
  return null
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
    return <Badge backgroundColor={badge.backgroundColor} color={badge.color}>{badge.text}</Badge>
  })
}

class CompactSongListItem extends Component {

  render() {
    if(this.props.loading) {
      return (
        <li className='compact-song-list-item loading'>
          <img src={Loader} alt={this.props.key} />
        </li>
      )
    } else {
       return (
        <li className='compact-song-list-item' onClick={() => { this.props.setScrollTop(document.getElementById('song-list').scrollTop); this.props.loadDetails(this.props.songKey || this.props.file) }}>
          <div className="song-details">
            <span className="song-title">{this.props.title}</span>
            <span className="song-artist">{this.props.artist}</span>
            <Uploader uploader={this.props.uploader} isDownloaded={this.props.isDownloaded} />
          </div>
          <Details isDownloaded={this.props.isDownloaded} />
          <Difficulties difficulties={this.props.difficulties} />
        </li>
      )
    }
  }
}

CompactSongListItem.propTypes = ({
  loadDetails: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired,
  setScrollTop: PropTypes.func.isRequired
})

const mapStateToProps = state => ({
  details: state.details
})

export default connect(mapStateToProps, { loadDetails, setScrollTop })(CompactSongListItem)