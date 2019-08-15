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
          <Modal width={ 600 } height={ 500 }  onClose={ () => { this.props.setLatestReleaseNotes(require('../../package.json').version) } }>
            <h1 style={ { marginTop: "0" } }>Release Notes for Version {require('../../package.json').version}</h1>
            <h2 style={ { color: 'lightgreen' } }>What's new?</h2>
            <hr style={ { borderColor: 'lightgreen' } } />
            <ul>
              <li>You can now <b>update mods</b> through the <b>revamped downloads page!</b></li>
              <li>Did I mention we <b>remade the download queue?</b> It's now it's own page with an <b>updates section (when applicable.)</b></li>
              <li>BeatDrop will also <b>search for mod updates periodically</b> and <b>notify you if updates are available.</b></li>
              <li>As requested, you can now <b>reset the app from settings.</b></li>
            </ul>
            <h2 style={ { color: 'salmon' } }>What's fixed?</h2>
            <hr style={ { borderColor: 'salmon' } } />
            <ul>
              <li>Fixed bug where <b>app would crash randomly after downloading songs and mods.</b></li>
              <li>Fixed bug where <b>songs would be scanned twice on inital setup.</b></li>
              <li>Fixed <a href="https://github.com/StarGazer1258/BeatDrop/issues/65" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); window.require('electron').shell.openExternal(e.target.href) } }>#65.</a></li>
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