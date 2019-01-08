import React, { Component } from 'react'
import '../css/UpdateDialog.css'

import { connect } from 'react-redux'
import Button from './Button';

const { ipcRenderer } = window.require('electron')

class UpdateDialog extends Component {

  constructor(props) {
    super(props)

    this.state = {
      updateProgress: 0,
      updateAvailable: false,
      newVersion: 'Fetching...'
    }
  }

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
      <div id="update-dialog" className={`theme-${this.props.theme} ${this.state.updateAvailable ? '' : 'hidden'}`}>
        <div id="update-dialog-inner">
          <h1 className={this.state.updateProgress > 0 ? ' downloading-update' : ''}>{this.state.updateProgress > 0 ? 'Downloading Update...' : 'Update Available!'}</h1>
          <div id="update-progress"  className={this.state.updateProgress > 0 ? '' : ' hidden'}><div id="update-progress-inner" style={{width: `${this.state.updateProgress}%`}}></div></div>
          <div className={`current-version${this.state.updateProgress > 0 ? ' hidden': ''}`}>Current Version: {require('../../package.json').version}</div>
          <div className={`latest-version${this.state.updateProgress > 0 ? ' hidden': ''}`}>Latest Version: {this.state.newVersion}</div>
          {(this.state.updateProgress > 0) ? null : <Button type="primary" onClick={() => { ipcRenderer.send('electron-updater', 'download-update') }}>Update Now</Button>}<div className="flex-br"></div>
          {(this.state.updateProgress > 0) ? null : <Button onClick={() => { this.setState({ updateAvailable: false }) }}>Remind Me Later</Button>}
        </div>
      </div>
    )
  }
}

let mapStateToProps = state => ({
  theme: state.settings.theme
})

export default connect(mapStateToProps, null)(UpdateDialog)