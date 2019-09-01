import React, { Component } from 'react'
import '../css/UpdateDialog.scss'

import { connect } from 'react-redux'
import Button from './Button';
import Modal from './Modal';
import ProgressBar from './ProgressBar'

import semver from 'semver'
const { ipcRenderer } = window.require('electron')

class UpdateDialog extends Component {

  constructor(props) {
    super(props)

    this.state = {
      updateProgress: 0,
      updateAvailable: false,
      newVersion: 'Fetching...'
    }

    this.onUpdateStatus = (_, event, message) => {
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
    }
  }

  componentWillMount() {
    ipcRenderer.on('electron-updater', this.onUpdateStatus)
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('electron-updater', this.onUpdateStatus)
  }

  render() {
    return (
      this.state.updateAvailable ?
        <Modal width={ 575 } height={ 500 } onClose={ () => { this.setState({ updateAvailable: false }) } }>
          <h1 id="update-dialog-text" className={ this.state.updateProgress > 0 ? ' downloading-update' : '' }>{ this.state.updateProgress > 0 ? 'Downloading Package...' : semver.gt(this.state.newVersion, require('../../package.json').version) ? 'Update Available!' : 'Stable Downgrade Available!' }</h1>
          { this.state.updateProgress > 0 ?
              <ProgressBar progress={ this.state.updateProgress } />
          :
            <>
              <div className={ `current-version${ this.state.updateProgress > 0 ? ' hidden' : '' }` }>Current Version: { require('../../package.json').version }</div>
              <div className={ `latest-version${ this.state.updateProgress > 0 ? ' hidden' : '' }` }>Latest { semver.gt(this.state.newVersion, require('../../package.json').version) ? '' : 'Stable ' }Version: { this.state.newVersion }</div>
              <div id="update-action-buttons">
                <Button type="primary" onClick={ () => { ipcRenderer.send('electron-updater', 'download-update') } }>{ semver.gt(this.state.newVersion, require('../../package.json').version) ? 'Update' : 'Downgrade' } Now</Button>
                <Button onClick={ () => { this.setState({ updateAvailable: false }) } }>Remind Me Later</Button>
              </div>
              
            </>
          }
          <div className="flex-br"></div>
        </Modal>
      : null
    )
  }
}

let mapStateToProps = state => ({
  theme: state.settings.theme
})

export default connect(mapStateToProps, null)(UpdateDialog)