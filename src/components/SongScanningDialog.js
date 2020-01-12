import React, { Component } from 'react'
import '../css/SongScanningDialog.scss'

import { connect } from 'react-redux'
import Modal from './Modal';
import ProgressBar from './ProgressBar';

class SongScanningDialog extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  componentWillReceiveProps(props) {
    if(props.scanning === true) this.setState({ open: true })
  }

  render() {
    return (
      this.state.open ?
        <Modal width={ 575 } height={ 330 } onClose={ () => { this.setState({ open: false }) } }>
          <h1 className={ `scanning-text theme-${this.props.theme}` }>{ !this.props.scanning ? `Finished scanning for songs.` : 'Scanning for songs...' }</h1>
          <div className="song-scanning-progress"><ProgressBar progress={ this.props.processedFiles / this.props.discoveredFiles * 100 } /></div>
          <h5 className="scanning-text">{ `${ this.props.processedFiles } / ${ this.props.discoveredFiles } Files scanned.${ !this.props.scanning ? ` | ${this.props.songs.length } songs discovered.` : '..' }` }</h5>
          { !this.props.scanning ? <h5 className="scanning-text">Click outside to exit.</h5> : null }
        </Modal>
      : null
    )
  }
}

let mapStateToProps = state => ({
  theme: state.settings.theme,
  songs: state.songs.downloadedSongs,
  scanning: state.songs.scanningForSongs,
  discoveredFiles: state.songs.discoveredFiles,
  processedFiles: state.songs.processedFiles
})

export default connect(mapStateToProps, null)(SongScanningDialog)