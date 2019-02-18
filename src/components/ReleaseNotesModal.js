import React, { Component } from 'react'

import Modal from './Modal'
import Button from './Button'

import { connect } from 'react-redux'
import { setLatestReleaseNotes } from '../actions/settingsActions'

const { ipcRenderer } = window.require('electron')

class ReleaseNotesModal extends Component {

  componentDidMount() {
    ipcRenderer.send('electron-updater', 'set-update-channel', this.props.updateChannel)
    ipcRenderer.send('electron-updater', 'check-for-updates')
  }

  render() {
    return (
    <>{require('../../package.json').version !== this.props.latestReleaseNotes ?
        <Modal>
          <h1 style={{marginTop: "0"}}>Release Notes for Version {require('../../package.json').version}</h1>
          <h2 style={{color: 'lightgreen'}}>What's new?</h2>
          <hr style={{borderColor: 'lightgreen'}} />
          <ul>
            <li>Added an indicator on the song list to show whether or not a song is in your library.</li>
            <li>BeatDrop will now warn if a playlist file is invalid or cannot be parsed.</li>
          </ul>
          <h2 style={{color: 'gold'}}>What's changed?</h2>
          <hr style={{borderColor: 'gold'}} />
          <ul>
            <li>ContextMenu is now slightly translucent.</li>
          </ul>
          <h2 style={{color: 'salmon'}}>What's fixed?</h2>
          <hr style={{borderColor: 'salmon'}} />
          <ul>
            <li>Fixed bug where app would crash if playlist file was invalid.</li>
            <li>Fixed bug where app would not download updates properly.</li>
            <li>Fixed bug where buttons would overlap other elements.</li>
          </ul>
          <br />
          <Button type="primary" onClick={() => { this.props.setLatestReleaseNotes(require('../../package.json').version) }}>Awesome!</Button>
        </Modal>
      : null}</>
    )
  }

}

const mapStateToProps = state => ({
  latestReleaseNotes: state.settings.latestReleaseNotes,
  updateChannel: state.settings.updateChannel
})

export default connect(mapStateToProps, { setLatestReleaseNotes })(ReleaseNotesModal)