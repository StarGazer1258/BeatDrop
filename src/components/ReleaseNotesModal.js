import React, { Component } from 'react'
import '../css/ReleaseNotesModal.scss'

import Modal from './Modal'
import Button from './Button'

import { connect } from 'react-redux'
import { setLatestReleaseNotes } from '../actions/settingsActions'

const { ipcRenderer } = window.require('electron')

const { shell } = window.require('electron')

class ReleaseNotesModal extends Component {

  componentDidMount() {
    ipcRenderer.send('electron-updater', 'set-update-channel', this.props.updateChannel)
    ipcRenderer.send('electron-updater', 'check-for-updates')
  }

  render() {
    return (
      <div id="release-notes-modal">
        {require('../../package.json').version !== this.props.latestReleaseNotes ?
          <Modal width={ 600 } height={ 500 }  onClose={ () => { this.props.setLatestReleaseNotes(require('../../package.json').version) } }>
            <h1 style={ { marginTop: "0" } }>Release Notes for Version {require('../../package.json').version}</h1>
            <h2 style={ { color: 'lightgreen' } }>What's new?</h2>
            <hr style={ { borderColor: 'lightgreen' } } />
            <ul>
              <li>Not much, mostly bug fixes for now. :)</li>
            </ul>
            <h2 style={ { color: 'salmon' } }>What's fixed?</h2>
            <hr style={ { borderColor: 'salmon' } } />
            <ul>
              <li>Fixed <a href="https://github.com/StarGazer1258/BeatDrop/issues/3" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); shell.openExternal(e.target.href) } }>#3 - App crashes when local mods are loaded</a></li>
              <li>Fixed <a href="https://github.com/StarGazer1258/BeatDrop/issues/4" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); shell.openExternal(e.target.href) } }>#4 - Right-Click context menu shows options for multiple other songs, but clicked one</a></li>
              <li>Fixed <a href="https://github.com/StarGazer1258/BeatDrop/issues/5" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); shell.openExternal(e.target.href) } }>#5 - App installs incorrect version of mod</a></li>
              <li>Fixed <a href="https://github.com/StarGazer1258/BeatDrop/issues/7" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); shell.openExternal(e.target.href) } }>#7 - 'View on BeastSaber' opens wrong URL</a></li>
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