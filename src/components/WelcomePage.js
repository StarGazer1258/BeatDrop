import React, { Component } from 'react'
import '../css/WelcomePage.css'

import WhiteDrop from '../assets/img/icon-0.png'
import Button from './Button';

import { setView } from '../actions/viewActions'
import { checkDownloadedSongs } from '../actions/queueActions'
import { connect } from 'react-redux'
import { SONG_LIST } from '../views'

class WelcomePage extends Component {

  render() {
    return (
      <div id="welcome-page">
        <img src={WhiteDrop} alt="BeatDrop Logo"/>
        <h1>Welcome to BeatDrop!</h1>
        <Button type="primary">View Tutorial</Button><div className="flex-br"></div>
        <Button onClick={() => { this.props.setView(SONG_LIST); this.props.checkDownloadedSongs() }}>Get Started</Button>
      </div>
    )
  }

}

export default connect(null, { setView, checkDownloadedSongs })(WelcomePage)