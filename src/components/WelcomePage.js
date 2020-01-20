import React, { Component } from 'react'
import '../css/WelcomePage.scss'

import WhiteDrop from '../assets/img/icon-0.png'
import PatreonButton from '../assets/become-a-patron-button.png'
import Button from './Button';
import Modal from './Modal'

import { setInstallationDirectory, setInstallationType, setGameVersion } from '../actions/settingsActions'
import { checkDownloadedSongs } from '../actions/queueActions'
import { checkInstalledMods } from '../actions/modActions'
import { fetchNew } from '../actions/songListActions'
import { connect } from 'react-redux'

import { BEATMODS_BASE_URL } from '../constants/urls'
import { makeUrl } from '../utilities'

const { shell } = window.require('electron')

class WelcomePage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
      gameVersions: []
    }
  }

  componentDidMount() {
    if(this.props.settings.installationDirectory === 'Please Choose a Folder...'   ||
       this.props.settings.installationType === 'choose'  ||
       this.props.settings.installationType === undefined ||
       this.props.settings.gameVersion === 'choose'       ||
       this.props.settings.gameVersion === undefined) {
         this.setState({ modalOpen: true })
       }

    fetch(makeUrl(BEATMODS_BASE_URL, '/api/v1/version'))
      .then(res => res.json())
      .then(gameVersions => this.setState({ gameVersions }))
  }

  render() {
    return (
      <div id="welcome-page">
        <img className="logo" src={ WhiteDrop } alt="BeatDrop Logo"/>
        <h1>Welcome to BeatDrop!</h1>
        <Button type="primary" onClick={ () => { shell.openExternal('https://bsaber.com/bdrop-tutorial/') } }>View Tutorial</Button><div className="flex-br"></div>
        <Button onClick={ () => { this.props.fetchNew() } }>Get Started</Button><div className="flex-br"></div>
        <img className="patreon-button"  src={ PatreonButton } alt="Become a Patron" onClick={ () => { window.require('electron').shell.openExternal('https://www.patreon.com/bePatron?u=18487054') } }/>
        { this.state.modalOpen ?
          <Modal>
            <h1>Initial Setup</h1>
            <label htmlFor="dl-location">Beat Saber Installation Directory</label><br /><br />
            <span id="installation-directory-display"><input className="text-box" type="text" id="dl-loc-box" value={ this.props.settings.installationDirectory } disabled /></span>
            <input type="file" id="dl-location" webkitdirectory="" onChange={ (e) => {this.props.setInstallationDirectory(e.target.files[0].path || this.props.settings.installationDirectory)} } /><br />
            <label htmlFor="dl-location"><Button type="primary" onClick={ () => {} }>Choose Folder</Button></label><Button onClick={ () => {window.require('child_process').exec('start "" "' + this.props.settings.installationDirectory + '"')} }>Open Folder</Button><br /><br />
            <label htmlFor="installation-type">Installation Type</label><br /><br />
            <table>
              <tr>
                <th>Installation Type&emsp;</th>
                <th>Game Version</th>
              </tr>
              <br />
              <tr>
                <td>
                  <select id="installation-type-select" name="installation-type-select" value={ this.props.settings.installationType } onChange={ (e) => { this.props.setInstallationType(e.target.value) } }>
                    <option value="choose">Choose One</option>
                    <option value="steam">Steam</option>
                    <option value="oculus">Oculus</option>
                  </select>
                </td>
                <td>
                  <select id="game-version-select" name="game-version-select" value={ this.props.settings.gameVersion } onChange={ (e) => { this.props.setGameVersion(e.target.value) } }>
                    <option value="choose">Choose One</option>
                    { this.state.gameVersions.map(version => <option value={ version }>{ version }</option>) }
                  </select>
                </td>
              </tr>
            </table>
            <br /><br />
            { this.props.settings.installationType === 'steam' && this.props.settings.installationDirectory.includes('Oculus') ? <><span style={ { fontWeight: 'bold', color: 'salmon' } }>Warning: BeatDrop has detected that you may be using the Oculus version of BeatSaber. If this is the case, please set "Installation Type" to "Oculus". Otherwise, you can ignore this message.</span><br /><br /></> : null }
            { this.props.settings.installationType === 'oculus' && this.props.settings.installationDirectory.includes('Steam') ? <><span style={ { fontWeight: 'bold', color: 'salmon' } }>Warning: BeatDrop has detected that you may be using the Steam version of BeatSaber. If this is the case, please set "Installation Type" to "Steam". Otherwise, you can ignore this message.</span><br /><br /></> : null }
            <Button type='primary' onClick={ () => { this.setState({ modalOpen: false }) } } disabled={ this.props.settings.installationDirectory === 'Please Choose a Folder...' || this.props.settings.installationType === 'choose' || this.props.settings.installationType === undefined || this.props.settings.gameVersion === 'choose' || this.props.settings.gameVersion === undefined }>Continue</Button>
          </Modal> : null }
      </div>
    )
  }

}

const mapStateToProps = state => ({
  settings: state.settings
})

export default connect(mapStateToProps, { fetchNew, checkDownloadedSongs, checkInstalledMods, setInstallationDirectory, setInstallationType, setGameVersion })(WelcomePage)