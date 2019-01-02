import React, { Component } from 'react';
import '../css/CoverGridItem.css'

import Loader from '../assets/loading.gif'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadDetails } from '../actions/detailsActions'

const getColors = window.require('get-image-colors')

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
  return badges.map((badge, i) => {
    return <div key={i} className='dot' title={badge.text} style={{backgroundColor: badge.backgroundColor, border: `1px solid ${props.textColor}`}}></div>
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
  getColors(props.coverImage)
      .then(colors => {
        this.setState({
          bgc: `rgb(${colors[0].rgb()[0]},${colors[0].rgb()[1]},${colors[0].rgb()[2]})`,
          textColor: (colors[0].rgb()[0]*0.299 + colors[0].rgb()[1]*0.587 + colors[0].rgb()[2]*0.114) > 186 ? 'black' : 'white'
        })
      })
      .catch(() => {})
}

  componentDidMount() {
    getColors(this.props.coverImage)
      .then(colors => {
        this.setState({
          bgc: `rgb(${colors[0].rgb()[0]},${colors[0].rgb()[1]},${colors[0].rgb()[2]})`,
          textColor: (colors[0].rgb()[0]*0.299 + colors[0].rgb()[1]*0.587 + colors[0].rgb()[2]*0.114) > 186 ? 'black' : 'white'
        })
      })
      .catch(() => {})
  }

  render() {
    if(this.props.loading) {
      return (
        <div className="cover-grid-item">
          <img src={Loader} alt={this.props.key} />
        </div>
      )
    } else {
      return (
        <div key={this.props.key} className='cover-grid-item' onClick={() => { this.props.loadDetails(this.props.songKey || this.props.file) }}>
          <img src={this.props.coverImage} alt=""/>
          <div style={{backgroundColor: this.state.bgc, color: this.state.textColor}} className="cover-grid-info-tab">
            <div className="cover-grid-title">{this.props.title}</div>
            <div className="cover-grid-artist">{this.props.artist}</div>
            <div className="dots">
              <Difficulties difficulties={this.props.difficulties} textColor={this.state.textColor} />
            </div>
          </div>
        </div>
      )
    }
  }
}

CoverGridItem.propTypes = ({
  loadDetails: PropTypes.func.isRequired
})

export default connect(null, { loadDetails })(CoverGridItem)