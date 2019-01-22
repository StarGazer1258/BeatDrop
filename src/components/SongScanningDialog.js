import React, { Component } from 'react'
import '../css/SongScanningDialog.css'

import { connect } from 'react-redux'

const { ipcRenderer } = window.require('electron')

class SongScanningDialog extends Component {

  componentWillMount() {
    ipcRenderer.on('electron-updater', (_, event, message) => {
      console.log(event, message)
      switch(event) {
        case 'update-available':
          this.setState({
            updateAvailable: true,
            newVersion: message.version
          })
          return
        case 'download-progress':
          this.setState({ updateProgress: message })
          return
        default:
          return
      }
    })
  }

  render() {
    return (
      <div id="song-scanning-dialog" className={`theme-${this.props.theme} ${this.props.scanning ? '' : 'hidden'}`}>
        <div id="song-scanning-dialog-inner">
          <h1>Scanning for songs...</h1>
          <div id="song-scanning-progress"><div id="song-scanning-progress-inner" style={{width: `${this.props.songsLoaded / this.props.songsDiscovered * 100}%`}}></div></div>
        </div>
      </div>
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