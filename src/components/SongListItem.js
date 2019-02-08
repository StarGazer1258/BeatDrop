import React, { Component } from 'react'
import '../css/SongListItem.css'
import Loader from '../assets/loading.gif'
import Badge from './Badge';

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadDetails } from '../actions/detailsActions'
import { setScrollTop, selectItem, deselectItem } from '../actions/songListActions'

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

  constructor(props) {
    super(props)

    this.state = {
      selected: props.selected
    }
  }

  static getDerivedStateFromProps(props, state) {
    if(props.selected !== state.selected) {
      return { selected: props.selected }
    }
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
        <li className={`song-list-item${this.state.selected ? ' selected' : ''}`} onClick={this.props.selecting ? (e) => { if(!this.state.selected) { if(e.shiftKey) { for(let i = Math.min(this.props.i, this.props.selectedItems[0]); i < Math.max(this.props.i+1, this.props.selectedItems[0]); i++) { this.props.selectItem(i) } } else { this.props.selectItem(this.props.i) } } else { this.props.deselectItem(this.props.i) } } : () => { this.props.setScrollTop(document.getElementById('song-list').scrollTop); this.props.loadDetails(this.props.file || this.props.songKey) }}>
          <img src={this.props.imageSource} alt={this.props.songKey} />
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
  selecting: state.songs.selecting,
  selectedItems: state.songs.selected
})

export default connect(mapStateToProps, { loadDetails, setScrollTop, selectItem, deselectItem })(SongListItem)