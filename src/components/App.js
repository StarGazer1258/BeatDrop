import React, { Component } from 'react'
import '../css/App.scss'
import '../css/fonts.scss'

import TitleBar from './TitleBar'
import Slate from './Slate'
import { store } from '../store'
import ViewSwitcher from './ViewSwitcher';
import DownloadQueue from './DownloadQueue';
import UpdateDialog from './UpdateDialog';
import SongScanningDialog from './SongScanningDialog';
import ReleaseNotesModal  from './ReleaseNotesModal'
import CrashMessage from './CrashMessage'

import { connect } from 'react-redux'

import { setHasError, setErrorMessage } from '../actions/windowActions'
import { downloadSong } from '../actions/queueActions'
import { loadModDetails, installMod, checkModsForUpdates } from '../actions/modActions'
import { loadDetailsFromKey } from '../actions/detailsActions'
import { setView } from '../actions/viewActions'
import { fetchLocalPlaylists } from '../actions/playlistsActions'

import { SONG_DETAILS, SONG_LIST, MOD_DETAILS, MODS_VIEW } from '../constants/views'

const { ipcRenderer } = window.require('electron')
const fs = window.require('fs')
const path = window.require('path')

class App extends Component {
  
  componentDidMount() {
    checkModsForUpdates()(store.dispatch, store.getState)
    ipcRenderer.send('launch-events', 'check-launch-events')
    ipcRenderer.on('launch-events', (_, event, message) => {
      switch(event) {
        case 'launch-events':
          for(let i = 0; i < message.songs.details.length; i++) {
            if(store.getState().view.view === SONG_DETAILS && store.getState().view.previousView !== SONG_DETAILS) {
              setView(store.getState().view.previousView)(store.dispatch, store.getState)
            } else {
              setView(SONG_LIST)(store.dispatch, store.getState)
            }
            loadDetailsFromKey()(store.dispatch, store.getState)
            
          }
          for(let i = 0; i < message.mods.details.length; i++) {
            if(store.getState().view.view === MOD_DETAILS && store.getState().view.previousView !== MOD_DETAILS) {
              setView(store.getState().view.previousView)(store.dispatch, store.getState)
            } else {
              setView(MODS_VIEW)(store.dispatch, store.getState)
            }
            loadModDetails(message.mods.details[i])(store.dispatch, store.getState)
          }
          for(let i = 0; i < message.songs.download.length; i++) {
            downloadSong(message.songs.download[i])(store.dispatch, store.getState)
          }
          for(let i = 0; i < message.mods.install.length; i++) {
            installMod(message.mods.install[i], '')(store.dispatch, store.getState)
          }
          for(let i = 0; i < message.files.length; i++) {
            let dir = message.files[i].file.split(path.sep)
            let filename = dir[dir.length - 1] + message.files[i].ext
            let newPath = path.join(store.getState().settings.installationDirectory, "Playlists", filename);
            fs.rename(message.files[i].file, newPath, (err) => {
              if (err) throw err;
              fetchLocalPlaylists(true)(store.dispatch, store.getState)
            })
          }
          return
        default:
          return
      }
    })
  }

  componentDidCatch(error, info) {
    this.props.setErrorMessage(error, info)
    this.props.setHasError(true)
  }

  render() {
    return (
      <div className='app'>
        <TitleBar />
        <Slate />
        { !this.props.hasError ?
          <>
            <ViewSwitcher />
            <DownloadQueue />
            <SongScanningDialog />
            <ReleaseNotesModal />
            <UpdateDialog />
          </>
          :
          <CrashMessage />
        }
      </div>
    )
  }
}

const mapStateToProps = state =>  ({
  hasError: state.window.hasError
})

export default connect(mapStateToProps, { setHasError, setErrorMessage })(App)