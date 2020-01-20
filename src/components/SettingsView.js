import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setInstallationDirectory, setInstallationType, setGameVersion, setAutoLoadMore, setOfflineMode, setTheme, setThemeImage, setFolderStructure, setUpdateChannel, setLatestReleaseNotes } from '../actions/settingsActions'
import { checkDownloadedSongs } from '../actions/queueActions'
import { checkInstalledMods, checkModsForUpdates } from '../actions/modActions'
import { resetApp } from '../actions/appActions'
import '../css/SettingsView.scss'
import Button from './Button'
import Toggle from './Toggle'
import { BEATMODS_BASE_URL } from '../constants/urls'
import { makeUrl } from '../utilities'

const { ipcRenderer } = window.require('electron')

class SettingsView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      updateStatus: '',
      gameVersions: []
    }
  }

  componentDidMount() {
    ipcRenderer.on('electron-updater', (_, event, message) => {
      if(event === 'checking-for-update' || event === 'update-not-available' || event === 'update-available' || event === 'error') {
        this.setState({ updateStatus: event })
      }
    })

    fetch(makeUrl(BEATMODS_BASE_URL, '/api/v1/version'))
      .then(res => res.json())
      .then(gameVersions => this.setState({ gameVersions }))
  }

  updateValue() {
    switch(this.state.updateStatus) {
      case 'checking-for-update':
        return 'Checking...'
      case 'update-not-available':
        return 'Up to Date!'
      case 'update-available':
        return 'Update Available!'
      case 'error':
        return 'Update Error!'
      default:
        return 'Check for Updates'
    }
  }

  render() {
    return (
      <div id='settings-view'>
        <h1>Settings</h1>
        <h2>Beat Saber Installation</h2>
        <label htmlFor="dl-location">Installation Directory</label><br /><br />
        <span id="installation-directory-display"><input className="text-box" type="text" id="dl-loc-box" value={ this.props.settings.installationDirectory } disabled /></span>
        <input type="file" id="dl-location" webkitdirectory="" onChange={ (e) => {this.props.setInstallationDirectory(e.target.files[0].path || this.props.settings.installationDirectory)} } /><br />
        <label htmlFor="dl-location"><Button type="primary" onClick={ () => {} }>Choose Folder</Button></label><Button onClick={ () => {window.require('child_process').exec('start "" "' + this.props.settings.installationDirectory + '"')} }>Open Folder</Button><br /><br />
        <table>
          <tr>
            <th>Installation Type&emsp;</th>
            <th>Game Version</th>
          </tr>
          <br />
          <tr>
            <td>
              <select id="installation-type-select" name="installation-type-select" value={ this.props.settings.installationType } onChange={ (e) => { this.props.setInstallationType(e.target.value) } }>
                <option value="steam">Steam</option>
                <option value="oculus">Oculus</option>
              </select>
            </td>
            <td>
              <select id="game-version-select" name="game-version-select" value={ this.props.settings.gameVersion } onChange={ (e) => { this.props.setGameVersion(e.target.value) } }>
                { this.state.gameVersions.map(version => <option key={ version } value={ version }>{ version }</option>) }
              </select>
            </td>
          </tr>
        </table>
        { this.props.settings.installationType === 'steam' && this.props.settings.installationDirectory.includes('Oculus') ? <><br /><br /><span style={ { fontWeight: 'bold', color: 'salmon' } }>Warning: BeatDrop has detected that you may be using the Oculus version of BeatSaber. If this is the case, please set "Installation Type" to "Oculus". Otherwise, you can ignore this message.</span><br /><br /></> : null }
        { this.props.settings.installationType === 'oculus' && this.props.settings.installationDirectory.includes('Steam') ? <><br /><br /><span style={ { fontWeight: 'bold', color: 'salmon' } }>Warning: BeatDrop has detected that you may be using the Steam version of BeatSaber. If this is the case, please set "Installation Type" to "Steam". Otherwise, you can ignore this message.</span><br /><br /></> : null }
        <hr />
        <h2>Song List</h2>
        <Toggle toggled={ this.props.settings.autoLoadMore } onToggle={ () => this.props.setAutoLoadMore(!this.props.settings.autoLoadMore) } /><label htmlFor="auto-load-more">Auto Load More</label><br /><br />
        <Toggle toggled={ this.props.settings.offlineMode } onToggle={ () => this.props.setOfflineMode(!this.props.settings.offlineMode) } /><label htmlFor="offline-mode">Offline Mode</label><br />
        <hr />
        <h2>Downloads</h2>
        <Button onClick={ this.props.checkDownloadedSongs }>Scan for Songs</Button><Button onClick={ this.props.checkInstalledMods }>{ this.props.scanningForMods ? 'Scanning...' : 'Scan for Mods' }</Button><br /><br />
        <Button onClick={ () => { this.props.checkModsForUpdates(true) } }>Check for Mod Updates</Button><br /><br />
        <label htmlFor="folder-structure-select">Folder Structure</label><br /><br />
        <select id="folder-structure-select" name="folder-structure-select" value={ this.props.settings.folderStructure } onChange={ (e) => { this.props.setFolderStructure(e.target.value) } }>
          <option value="keySongNameArtistName">Key ( Song Name - Song Artist )</option>
          <option value="idKey">Key</option>
          <option value="songName">Song Name</option>
        </select>
        <hr />
        <h2>Theme</h2>
        <select id="theme-select" name="theme-select" value={ this.props.settings.theme } onChange={ (e) => { this.props.setTheme(e.target.value) } }>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="hc">High Contrast</option>
        </select><br /><br />
        <label>Custom Theme Image</label><br /><br />
        <span id="installation-directory-display"><input className="text-box" type="text" id="theme-image-box" placeholder="No Image Set" value={ this.props.settings.themeImagePath } disabled /></span>
        <input type="file" id="theme-image-path" onChange={ (e) => {this.props.setThemeImage(e.target.files[0].path || this.props.settings.themeImagePath)} } /><br />
        <label htmlFor="theme-image-path"><Button type="primary" onClick={ () => {} }>Choose Image</Button></label><Button onClick={ () => { this.props.setThemeImage('') } }>Clear Image</Button><br /><br />
        <hr />
        <h2>Updates</h2>
        <b>Current Version: </b>{ require('../../package.json').version }<br /><br />
        <Button onClick={ () => { this.props.setLatestReleaseNotes('0.0.0') } }>View Release Notes</Button><br /><br />
        <label htmlFor="update-channel-select">Update Channel</label><br /><br />
        <select id="update-channel-select" name="update-channel-select" value={ this.props.settings.updateChannel } onChange={ (e) => { this.props.setUpdateChannel(e.target.value) } }>
          <option value="latest">Stable</option>
          <option value="beta">Beta</option>
        </select><br /><br />
        {this.props.settings.updateChannel === 'beta' ? <><span style={ { fontWeight: 'bold', color: 'salmon' } }>Warning: Beta builds are unstable, untested and may result in unexpected crashes, loss of files and other adverse effects! By updating to a beta build, you understand and accept these risks.</span><br /><br /></> : null}
        <Button type={ this.state.updateStatus === 'error' ? 'destructive' : null } onClick={ () => { ipcRenderer.send('electron-updater', 'check-for-updates') } }>{ this.updateValue() }</Button>
        <br /><br />
        <hr />
        <h2>DANGER ZONE</h2>
        <i>Please don't touch these unless you know what you're doing.</i><br /><br />
        <Button type="destructive" onClick={ () => { this.props.resetApp() } }>Reset App</Button>
        <br /><br />
        <hr />
        <h2>Credits</h2>
        <b>BeatDrop Developers</b><br />
        <ul>
          <li>StarGazer1258</li>
          <li>Yuuki</li>
          <li><a href="https://github.com/StarGazer1258/BeatDrop/graphs/contributors" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); window.require('electron').shell.openExternal(e.target.href) } }>The GitHub Community</a></li>

        </ul>
        <br />
        <b>Icon and Animation Designer, BeastSaber Developer</b><br />
        <ul>
          <li>Elliotttate</li>
        </ul>
        <br />
        <b>BeatMods Developers</b><br />
        <ul>
          <li>vanZeben</li>
          <li>raftario</li>
        </ul>
        <br />
        <b>Additional Icons Provided by</b><br />
        <ul>
          <li><a href="https://icons8.com/" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); window.require('electron').shell.openExternal(e.target.href) } }>Icons8</a></li>
        </ul>
        <br />
        <h3>Patreon Supporter (Lifetime Pledge)</h3>
        <ul>
          <li>
          <b>Wave Tier</b>
          <ul>
            <li>Shane R. Monroe ($50)</li>
            <li>Carize ($30)</li>
            <li>Myles Hecht ($30)</li>
            <li>Iryna Pavlova ($20)</li>
            <li>Marc Smith ($10)</li>
            <li>Kirk Miller ($10)</li>
            <li></li>
          </ul>
          </li>
          <li>
            <b>Hurricane Tier</b>
            <ul>
              <li><i>Your name here...</i></li>
            </ul>
          </li>
          <li>
            <b>Tsunami Tier</b>
            <ul>
              <li><i>This could be you...</i></li>
            </ul>
          </li>
        </ul>
        <br /><br />
      </div>
    )
  }
}

SettingsView.propTypes = {
  settings: PropTypes.object.isRequired,
  scanningForMods: PropTypes.bool.isRequired,
  setInstallationDirectory: PropTypes.func.isRequired,
  setInstallationType: PropTypes.func.isRequired,
  setAutoLoadMore: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  setFolderStructure: PropTypes.func.isRequired,
  setUpdateChannel: PropTypes.func.isRequired,
  checkDownloadedSongs: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  settings: state.settings,
  scanningForMods: state.mods.scanning
})

export default connect(mapStateToProps, { setInstallationDirectory, setInstallationType, setGameVersion, setAutoLoadMore, setOfflineMode, setTheme, setThemeImage, setFolderStructure, setUpdateChannel, setLatestReleaseNotes, checkDownloadedSongs, checkInstalledMods, checkModsForUpdates, resetApp })(SettingsView)

//<input type="checkbox" name="auto-refresh" id="auto-refresh" checked={this.props.settings.autoRefresh} onClick={() => this.props.setAutoLoadMore(!this.props.settings.autoLoadMore)} /><label htmlFor="auto-refresh">Refresh feed every </label><input type="number" name="auto-refresh-interval" id="auto-refresh-interval"/><label htmlFor="auto-refresh-interval"> seconds</label>