import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../css/ViewSwitcher.css'

import WelcomePage from './WelcomePage'
import SongList from './SongList'
import CompactSongList from './CompactSongList'
import CoverGrid from './CoverGrid'
import SideBar from './SideBar'
import SortBar from './SortBar'
import SearchView from './SearchView'
import PlaylistView from './PlaylistView'
import SettingsView from './SettingsView'
import SongDetails from './SongDetails'
import Warning from './Warning'
import { WELCOME, SONG_LIST, SONG_DETAILS, PLAYLIST_LIST, PLAYLIST_DETAILS, SETTINGS, SEARCH } from '../views';
import PlaylistDetails from './PlaylistDetails';
import SelectBar from './SelectBar';

function Songs(props) {
  switch(props.songView) {
    case 'list':
      return <SongList />
    case 'compact-list':
      return <CompactSongList />
    case 'grid':
      return <CoverGrid />
    default:
      return <SongList />
  }
}

function MainView(props) {
  switch(props.view) {
    case WELCOME:
      return <WelcomePage />
    case SONG_LIST:
      return <Songs songView={props.songView} />
    case PLAYLIST_LIST:
      return <PlaylistView />
    case SETTINGS:
      return <SettingsView />
    case SEARCH:
      return <SearchView />
    case SONG_DETAILS:
      return <SongDetails />
    case PLAYLIST_DETAILS:
      return <PlaylistDetails />
    default:
      return <Songs songView={props.songView} />
  }
}

function Warnings(props) {
  return (
    <div className='warnings'>
      {props.warnings.map((warning, i) => {
        return <Warning text={warning.text} color={warning.color} timeout={warning.timeout} index={i} key={i} />
      })}
    </div>
  )
} 

class ViewSwitcher extends Component {

  render() {
    return (
      <div id="view-switcher" className={`theme-${this.props.settings.theme}`}>
        <SideBar />
        <div className={`view-right ${this.props.sidebarOpen ? '' : 'sidebar-collapsed'}`}>
          <SortBar hidden={this.props.view !== SONG_LIST} />
          {this.props.selecting ? <SelectBar /> : null}
          <MainView view={this.props.view} songView={this.props.songView} />
          <Warnings warnings={this.props.warnings} />
        </div>
      </div>
    )
  }
}

ViewSwitcher.propTypes = {
  view: PropTypes.string.isRequired,
  songView: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  warnings: PropTypes.array,
  sidebarOpen: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  view: state.view.view,
  songView: state.view.songView,
  settings: state.settings,
  details: state.details,
  warnings: state.warnings,
  sidebarOpen: state.sidebar.isOpen,
  selecting: state.songs.selecting
})

export default connect(mapStateToProps, null)(ViewSwitcher)