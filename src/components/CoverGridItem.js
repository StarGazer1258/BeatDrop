import React, { Component } from 'react';
import '../css/CoverGridItem.scss'

import LibraryIndicator from './LibraryIndicator'

import Loader from '../assets/loading-dots2.png'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadDetailsFromFile, loadDetailsFromKey } from '../actions/detailsActions'
import { setScrollTop } from '../actions/songListActions'

const getColors = window.require('get-image-colors')

function Difficulties(props) {
  let difficulties = props.difficulties
  if (!difficulties) return null
  let badges = []
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
  return badges.map((badge, i) => {
    return <div key={ i } className='dot' title={ badge.text } style={ { backgroundColor: badge.backgroundColor, border: `1px solid ${props.textColor}` } }></div>
  })
}

class CoverGridItem extends Component {

  constructor() {
    super()
    this.state = {
      bgc: 'rgba(128, 128, 128)',
      textColor: 'black'
    }
  }

componentWillReceiveProps(props) {
  getColors(this.props.imageSource.startsWith('file://') ? this.props.imageSource.substring(7, this.props.imageSource.length) : `https://beatsaver.com/${ this.props.imageSource }`)
      .then(colors => {
        this.setState({
          bgc: `rgb(${colors[0].rgb()[0]},${colors[0].rgb()[1]},${colors[0].rgb()[2]})`,
          textColor: (colors[0].rgb()[0] * 0.299 + colors[0].rgb()[1] * 0.587 + colors[0].rgb()[2] * 0.114) > 186 ? 'black' : 'white'
        })
      })
      .catch(() => {})
}

  componentDidMount() {
    console.log( encodeURI(this.props.imageSource) )
    if(!this.props.imageSource) return
    getColors(this.props.imageSource.startsWith('file://') ? this.props.imageSource.substring(7, this.props.imageSource.length) : `https://beatsaver.com/${ this.props.imageSource }`)
      .then(colors => {
        this.setState({
          bgc: `rgb(${colors[0].rgb()[0]},${colors[0].rgb()[1]},${colors[0].rgb()[2]})`,
          textColor: (colors[0].rgb()[0] * 0.299 + colors[0].rgb()[1] * 0.587 + colors[0].rgb()[2] * 0.114) > 186 ? 'black' : 'white'
        })
      })
      .catch(() => {})
  }

  render() {
    if(this.props.loading) {
      return (
        <div className="cover-grid-item loading">
          <img className="cover-image" src={ Loader } alt={ this.props.alt } />
        </div>
      )
    } else {
      return (
        <div key={ this.props.key } className='cover-grid-item' onClick={ () => { this.props.setScrollTop(document.getElementById('cover-grid-container').scrollTop); if(this.props.file) { this.props.loadDetailsFromFile(this.props.file) } else { this.props.loadDetailsFromKey(this.props.songKey) } } }>
          <img className="cover-image" src={ this.props.imageSource.startsWith('file://') ? this.props.imageSource : `https://beatsaver.com/${ this.props.imageSource }` } alt=""/>
          {(!!this.props.file || this.props.downloadedSongs.some(dsong => dsong.hash === this.props.hash)) ? <LibraryIndicator /> : null}
          <div style={ { backgroundColor: this.state.bgc, color: this.state.textColor } } className="cover-grid-info-tab">
            <div className="cover-grid-title">{this.props.title}</div>
            <div className="cover-grid-artist">{this.props.artist}</div>
            <div className="dots">
              <Difficulties difficulties={ this.props.difficulties } textColor={ this.state.textColor } />
            </div>
          </div>
        </div>
      )
    }
  }
}

CoverGridItem.propTypes = ({
  loadDetailsFromFile: PropTypes.func.isRequired,
  loadDetailsFromKey: PropTypes.func.isRequired
})

let mapStateToProps = state => ({
  downloadedSongs: state.songs.downloadedSongs
})

export default connect(mapStateToProps, { loadDetailsFromFile, loadDetailsFromKey, setScrollTop })(CoverGridItem)