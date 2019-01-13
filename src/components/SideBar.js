import React, { Component } from 'react'
import '../css/SideBar.css'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SettingsButton from './SettingsButton'
import SearchButton from './SearchButton'
import { fetchNew, fetchTopDownloads, fetchTopFinished, fetchLocalSongs } from '../actions/songListActions'
import { fetchLocalPlaylists } from '../actions/playlistsActions'
import { setSource, setResource } from '../actions/sourceActions'
import { resizeSidebar } from '../actions/sidebarActions'
import QueueButton from './QueueButton';
import { SONG_LIST, PLAYLIST_LIST } from '../views'

class SideBar extends Component {

  render() {
    return (
      <div id='sidebar' className={this.props.sidebarOpen ? '' : 'collapsed'}>
        <div className='resize-sidebar' title={this.props.sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'} onClick={this.props.resizeSidebar}></div>
        <h5>LIBRARY</h5>
        <ul>
          <li className={`fetch-local-songs ${this.props.view === SONG_LIST && this.props.source.source === 'local' && this.props.source.resource === 'songs' ? 'selected' : ''}`} onClick={this.props.fetchLocalSongs}>Songs</li>
          <li className={`fetch-local-playlists ${this.props.view === PLAYLIST_LIST ? 'selected' : ''}`} onClick={this.props.fetchLocalPlaylists}>Playlists</li>
        </ul>
        <h5>BEATSAVER</h5>
        <ul>
          <li className={`fetch-new-songs ${this.props.view === SONG_LIST && this.props.source.source === 'beatsaver' && this.props.source.resource === 'new' ? 'selected' : ''}`} onClick={this.props.fetchNew}>New Songs</li>
          <li className={`fetch-top-finished ${this.props.view === SONG_LIST && this.props.source.source === 'beatsaver' && this.props.source.resource === 'topFinished' ? 'selected' : ''}`} onClick={this.props.fetchTopFinished}>Top Finished</li>
          <li className={`fetch-top-downloaded ${this.props.view === SONG_LIST && this.props.source.source === 'beatsaver' && this.props.source.resource === 'topDownloads' ? 'selected' : ''}`} onClick={this.props.fetchTopDownloads}>Top Downloaded</li>
        </ul>
        <div className="buttons-bottom"><SettingsButton /><SearchButton /><QueueButton /></div>
      </div>
    )
  }
}

SideBar.propTypes = {
  fetchNew: PropTypes.func.isRequired,
  fetchTopDownloads: PropTypes.func.isRequired,
  fetchTopFinished: PropTypes.func.isRequired,
  fetchLocalSongs: PropTypes.func.isRequired,
  fetchLocalPlaylists: PropTypes.func.isRequired,
  setSource: PropTypes.func.isRequired,
  setResource: PropTypes.func.isRequired,
  resizeSidebar: PropTypes.func.isRequired,
  source: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  view: state.view.view,
  source: state.source,
  sidebarOpen: state.sidebar.isOpen
})

export default connect(mapStateToProps, { fetchNew, fetchTopDownloads, fetchTopFinished, fetchLocalSongs, fetchLocalPlaylists, setSource, setResource, resizeSidebar })(SideBar)

/*
<h5>BEASTSABER</h5>
<ul>
  <li className={`fetch-new-reviews ${this.props.source.source === 'beastsaber' && this.props.source.resource === 'new' ? 'selected' : ''}`}>New Reviews</li>
  <li className={`fetch-featured-songs`}>Featured Songs</li>
  <li className='fetch-featured-playlists'>Featured Playlists</li>
</ul>
*/