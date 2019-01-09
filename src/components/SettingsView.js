import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setInstallationDirectory, setAutoLoadMore, setTheme, setFolderStructure } from '../actions/settingsActions'
import '../css/SettingsView.css'
import Button from './Button'

const { ipcRenderer } = window.require('electron')

class SettingsView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      updateStatus: 'update-available'
    }
  }

  componentDidMount() {
    ipcRenderer.on('electron-updater', (_, event, message) => {
      if(event === 'checking-for-update' || event === 'update-not-available' || event === 'update-available') {
        this.setState({updateStatus: event})
      }
    })
  }

  render() {
    return (
      <div id='settings-view'>
        <h1>Settings</h1>
        <h3><label htmlFor="installation-directory">Beat Saber Installation Directory</label></h3>
        <span id="installation-directory-display"><input className="text-box" type="text" id="dl-loc-box" value={this.props.settings.installationDirectory} disabled /></span>
        <input type="file" id="dl-location" webkitdirectory="" onChange={(e) => {this.props.setInstallationDirectory(e.target.files[0].path || this.props.settings.installationDirectory)}} /><br />
        <label htmlFor="dl-location"><Button type="primary">Choose Folder</Button></label><Button onClick={() => {window.require('child_process').exec('start "" "' + this.props.settings.installationDirectory + '"')}}>Open Folder</Button><br /><br />
        <h3>Song List</h3>
        <input type="checkbox" name="auto-load-more" id="auto-load-more" checked={this.props.settings.autoLoadMore} onClick={() => this.props.setAutoLoadMore(!this.props.settings.autoLoadMore)} /><label htmlFor="auto-load-more">Auto Load More</label><br />
        <h3>Downloads</h3>
        <label htmlFor="folder-structure-select">Folder Structure</label><br /><br />
        <select id="folder-structure-select" name="folder-structure-select" value={this.props.settings.folderStructure} onChange={(e) => { this.props.setFolderStructure(e.target.value) }}>
          <option value="idKey">ID/Key</option>
          <option value="songName">Song Name</option>
        </select>
        <h3><label htmlFor="theme-select">Theme</label></h3>
        <select id="theme-select" name="theme-select" value={this.props.settings.theme} onChange={(e) => { this.props.setTheme(e.target.value) }}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <h3>Updates</h3>
        <b>Current Version: </b>{require('../../package.json').version}<br /><br />
        <Button onClick={() => { ipcRenderer.send('electron-updater', 'check-for-updates') }}>{this.state.updateStatus === 'checking-for-update' ? 'Checking...' : this.state.updateStatus === 'update-available' ? 'Check for Updates': 'Up to date!'}</Button>
        <br /><br />
      </div>
    )
  }
}

SettingsView.propTypes = {
  settings: PropTypes.object.isRequired,
  setInstallationDirectory: PropTypes.func.isRequired,
  setAutoLoadMore: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  setFolderStructure: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  settings: state.settings
})

export default connect(mapStateToProps, { setInstallationDirectory, setAutoLoadMore, setTheme, setFolderStructure })(SettingsView)

//<input type="checkbox" name="auto-refresh" id="auto-refresh" checked={this.props.settings.autoRefresh} onClick={() => this.props.setAutoLoadMore(!this.props.settings.autoLoadMore)} /><label htmlFor="auto-refresh">Refresh feed every </label><input type="number" name="auto-refresh-interval" id="auto-refresh-interval"/><label htmlFor="auto-refresh-interval"> seconds</label>