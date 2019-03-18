import React, { Component } from 'react'
import '../css/SongScanningDialog.scss'

import { connect } from 'react-redux'
import Modal from './Modal';
import ProgressBar from './ProgressBar';

class SongScanningDialog extends Component {

  render() {
    return (
      this.props.scanning ?
        <Modal width={ 575 } height={ 330 }>
          <h1 id="scanning-text" className={ `theme-${this.props.theme}` }>Scanning for songs...</h1>
          <ProgressBar progress={ this.props.songsLoaded / this.props.songsDiscovered * 100 } indeterminate />
        </Modal>
      : null
    )
  }
}

let mapStateToProps = state => ({
  theme: state.settings.theme,
  scanning: state.songs.scanningForSongs,
  songsLoaded: state.songs.songsLoaded,
  songsDicovered: state.songs.songsDiscovered
})

export default connect(mapStateToProps, null)(SongScanningDialog)