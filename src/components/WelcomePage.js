import React, { Component } from 'react'
import '../css/WelcomePage.css'

import WhiteDrop from '../assets/img/icon-0.png'
import Button from './Button';

import { checkDownloadedSongs } from '../actions/queueActions'
import { fetchNew } from '../actions/songListActions'
import { connect } from 'react-redux'

class WelcomePage extends Component {

  render() {
    return (
      <div id="welcome-page">
        <img src={WhiteDrop} alt="BeatDrop Logo"/>
        <h1>Welcome to BeatDrop!</h1>
        <Button type="primary">View Tutorial</Button><div className="flex-br"></div>
        <Button onClick={() => { this.props.checkDownloadedSongs(); this.props.fetchNew() }}>Get Started</Button>
      </div>
    )
  }

}

export default connect(null, { fetchNew, checkDownloadedSongs })(WelcomePage)