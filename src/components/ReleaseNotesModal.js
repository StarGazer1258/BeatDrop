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
            <li>Multiple songs can now be downloaded in a single link.<br /><i>e.g. beatdrop://songs/download/31-11,1183-814,811-535,27-9,517-321</i></li>
          </ul>
          <h2 style={{color: 'salmon'}}>What's fixed?</h2>
          <hr style={{borderColor: 'salmon'}} />
          <ul>
            <li>Auto-updates should finally work for beta builds.</li>
            <li>Fixed bug where app would crash after update.</li>
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