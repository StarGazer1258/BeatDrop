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
            <li>Added failure case for sharing externally downloaded songs.</li>
            <li>Added this fancy new release notes dialog!</li>
            <li>Added auto-update support for beta builds.</li>
          </ul>
          <h2 style={{color: 'gold'}}>What's changed?</h2>
          <hr style={{borderColor: 'gold'}} />
          <ul>
            <li>Highlight color on view tabs is now BeatDrop Blue.</li>
            <li>Loading animations have a cool new look!</li>
          </ul>
          <h2 style={{color: 'salmon'}}>What's fixed?</h2>
          <hr style={{borderColor: 'salmon'}} />
          <ul>
            <li>Fixed bug where app would crash if more than 3 songs were queued to download.</li>
            <li>Fixed bug where "Add to Playlist" button would do nothing if song was downloaded externally.</li>
            <li>Fixed bug where sidebar fails to close on first click.</li>
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