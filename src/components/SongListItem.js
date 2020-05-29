import React, { Component } from 'react'
import '../css/SongListItem.scss'

import Loader from '../assets/loading-dots2.png'
import BSaberLogo from '../assets/beastsaber.webp'

import Badge from './Badge';
import LibraryIndicator from './LibraryIndicator'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadDetailsFromFile, loadDetailsFromKey } from '../actions/detailsActions'
import { setScrollTop } from '../actions/songListActions'

import { COMPACT_LIST } from '../constants/views'

function Uploader(props) {
  if(!props.isDownloaded && !!props.uploader) return (
    <div className="uploader">Uploaded by: {props.uploader.username ? props.uploader.username : props.uploader}<span className="upload-date">{(!!props.uploadDate ? props.uploadDate : '')}</span></div>
  )
  return null
}

function Details(props) {
  if(props.downloads === undefined) return null
  return (
    <div className="beatmap-details">
      <div className="downloads">{props.downloads} <span role="img" aria-label="downloads">⏬</span>{(props.downloads === 1 ? '' : '')}</div>
      <div className="plays">{props.plays} <span role="img" aria-label="finishes">🏁</span></div>
      <div className="upvotes">{props.upvotes} <span role="img" aria-label="upvotes">👍</span>/{props.downvotes} <span role="img" aria-label="downvotes">👎</span></div>
      <div className="rating">{props.ratings ? props.ratings.overall_rating > 0 ? props.ratings.overall_rating : 'No Rating' : 'Fetching Rating...'}<img style={ { width: '17px', height: '17px', borderRadius: '2px', marginBottom: '2px', marginLeft: '5px', marginRight: '3px', verticalAlign: 'middle' } } src={ BSaberLogo } alt=""/></div>
    </div>
  )
}

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

class SongListItem extends Component {

  shouldComponentUpdate(nextProps) {
    return this.props.bsaberRating !== undefined || this.props.view.subView !== nextProps.view.subView
  }

  render() {
    if(this.props.loading) {
      return (
        <li className='song-list-item loading'>
          <img src={ Loader } alt={ this.props.key } />
        </li>
      )
    } else {
      return (
        <li className={ `song-list-item${this.props.view.subView === 'compact-list' ? ' compact' : ''}` } onClick={ () => { this.props.setScrollTop(document.getElementById('song-list').scrollTop); if(this.props.file) { this.props.loadDetailsFromFile(this.props.file) } else { this.props.loadDetailsFromKey(this.props.songKey) } } }>
          <img className="cover-image" src={ this.props.imageSource.startsWith('file://') ? this.props.imageSource : `https://beatsaver.com/${ this.props.imageSource }` } alt={ this.props.songKey } />
          {(!!this.props.file || this.props.downloadedSongs.some(dsong => dsong.hash === this.props.hash)) && this.props.view.songView !== COMPACT_LIST ? <LibraryIndicator /> : null}
          <div className="song-details">
            <div className="song-title">{this.props.title}<span className="id">{!!this.props.songKey ? this.props.songKey : ''}</span></div>
            {(!!this.props.file || this.props.downloadedSongs.some(dsong => dsong.hash === this.props.hash)) && this.props.view.songView === COMPACT_LIST ? <LibraryIndicator /> : null}
            <div className="song-artist">{this.props.artist}</div>
            <Uploader uploader={ this.props.uploader } isDownloaded={ this.props.isDownloaded } uploadDate={ this.props.view.songView !== COMPACT_LIST && !!this.props.uploadDate ? this.props.uploadDate : null } />
            <Difficulties difficulties={ this.props.difficulties } />
          </div>
          <Details downloads={ this.props.downloads } upvotes={ this.props.upvotes } downvotes={ this.props.downvotes } ratings={ this.props.ratings } plays={ this.props.plays } />
        </li>
      )
    }
  }
}

SongListItem.propTypes = ({
  loadDetailsFromFile: PropTypes.func.isRequired,
  loadDetailsFromKey: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired
})

const mapStateToProps = state => ({
  view: state.view,
  details: state.details,
  downloadedSongs: state.songs.downloadedSongs
})

export default connect(mapStateToProps, { loadDetailsFromFile, loadDetailsFromKey, setScrollTop })(SongListItem)