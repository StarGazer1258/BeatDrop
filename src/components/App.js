import React, { Component } from 'react'
import '../css/App.css'
import '../css/fonts.css'
import TitleBar from './TitleBar'
import Slate from './Slate'
import { Provider } from 'react-redux'
import { store, persistor } from '../store'
import ViewSwitcher from './ViewSwitcher';
import { PersistGate } from 'redux-persist/integration/react';
import DownloadQueue from './DownloadQueue';
import UpdateDialog from './UpdateDialog';
import SongScanningDialog from './SongScanningDialog';

import { downloadSong } from '../actions/queueActions'
import { loadDetails } from '../actions/detailsActions'

const { ipcRenderer } = window.require('electron')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      window: {
        x: 0,
        y: 0,
        width: 985,
        height: 585
      }
    }
  }

  componentDidMount() {
    ipcRenderer.send('launch-events', 'check-launch-events')
    ipcRenderer.on('launch-events', (_, event, message) => {
      switch(event) {
        case 'launch-events':
          for(let i = 0; i < message.songs.details.length; i++) {
            loadDetails(message.songs.details[i])(store.dispatch, store.getState)
          }
          for(let i = 0; i < message.songs.download.length; i++) {
            downloadSong(message.songs.download[i])(store.dispatch, store.getState)
          }
          return
        default:
          return
      }
    })
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <div className='app'>
            <TitleBar />
            <Slate />
            <ViewSwitcher />
            <DownloadQueue />
            <UpdateDialog />
            <SongScanningDialog />
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App