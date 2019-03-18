import React, { Component } from 'react'
import '../css/ReleaseNotesModal.scss'

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
      <div id="release-notes-modal">
        {require('../../package.json').version !== this.props.latestReleaseNotes ?
          <Modal width={ 600 } onClose={ () => { this.props.setLatestReleaseNotes(require('../../package.json').version) } }>
            <h1 style={ { marginTop: "0" } }>Release Notes for Version {require('../../package.json').version}</h1>
            <h2 style={ { color: 'lightgreen' } }>What's new?</h2>
            <hr style={ { borderColor: 'lightgreen' } } />
            <ul>
              <li>Find out whats good and bad with <b>in-app BeastSaber ratings.</b></li>
              <li>Show some love with the new <b>Donate page.</b></li>
              <li>The lower-left icons get some <b>snazzy animations.</b></li>
              <li>Search-by-numbers is back in style; you can now <b>search by IDs and Keys.</b></li>
              <li>Forget what happened in the latest release? Try the new <b>View Release Notes button</b> in settings.</li>
              <li>Credit given where credit is due; there is now a <b>credits section</b> in settings.</li>
              <li>No internet? No problem. Added <b>offline mode</b> and <b>offline font support.</b></li>
              <li>Dark theme not dark enough? Try the new <b>High Contrast theme</b> for a twiglight feel.</li>
              {/*<li>Want to browse song without taking you hands off the keyboard? Try out the new <b>keyboard controls!</b></li>*/}
            </ul>
            <h2 style={ { color: 'salmon' } }>What's fixed?</h2>
            <hr style={ { borderColor: 'salmon' } } />
            <ul>
              <li>Fixed a bug that caused downloads to be inconsistent.</li>
              <li>Fixed a bug where special characters would break searches.</li>
              <li>Miscellaneous visual tweaks.</li>
            </ul>
            <br />
            <Button type="primary" onClick={ () => { this.props.setLatestReleaseNotes(require('../../package.json').version) } }>Awesome!</Button>
          </Modal>
        : null}
      </div>
    )
  }

}

const mapStateToProps = state => ({
  latestReleaseNotes: state.settings.latestReleaseNotes,
  updateChannel: state.settings.updateChannel
})

export default connect(mapStateToProps, { setLatestReleaseNotes })(ReleaseNotesModal)