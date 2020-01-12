import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../css/ViewSwitcher.scss'

import WelcomePage from './WelcomePage'
import SongList from './SongList'
import CoverGrid from './CoverGrid'
import SideBar from './SideBar'
import SortBar from './SortBar'
import SearchView from './SearchView'
import PlaylistView from './PlaylistView'
import SettingsView from './SettingsView'
import SongDetails from './SongDetails'
import Warning from './Warning'
import * as VIEWS from '../constants/views'
import PlaylistDetails from './PlaylistDetails'
import DonateView from './DonateView'
import ModsView from './ModsView'
import ModDetails from './ModDetails'
import ModsListView from './ModsListView';
import DownloadsView from './DownloadsView'

function Songs(props) {
  switch(props.subView) {
    case 'list':
      return <SongList />
    case 'compact-list':
      return <SongList />
    case 'grid':
      return <CoverGrid />
    default:
      return <SongList />
  }
}

function MainView(props) {
  switch(props.view) {
    case VIEWS.WELCOME:
      return <WelcomePage />
    case VIEWS.DONATE:
      return <DonateView />
    case VIEWS.SONG_LIST:
      return <Songs subView={ props.subView } />
    case VIEWS.PLAYLIST_LIST:
      return <PlaylistView />
    case VIEWS.MODS_VIEW:
      return props.subView === 'list' ? <ModsListView /> : <ModsView />
    case VIEWS.SETTINGS:
      return <SettingsView />
    case VIEWS.SEARCH:
      return <SearchView />
    case VIEWS.SONG_DETAILS:
      return <SongDetails />
    case VIEWS.PLAYLIST_DETAILS:
      return <PlaylistDetails />
    case VIEWS.MOD_DETAILS:
      return <ModDetails />
    case VIEWS.DOWNLOADS:
      return <DownloadsView />
    default:
      return <Songs subView={ props.subView } />
  }
}

function Warnings(props) {
  return (
    <div className='warnings'>
      {props.warnings.map((warning, i) => {
        return <Warning text={ warning.text } color={ warning.color } timeout={ warning.timeout } index={ i } key={ i } />
      })}
    </div>
  )
} 

class ViewSwitcher extends Component {

  render() {
    return (
      <div id="view-switcher" className={ `theme-${this.props.settings.theme}` }>
        <SideBar />
        <div className={ `view-right ${this.props.sidebarOpen ? '' : 'sidebar-collapsed'}` }>
          { (this.props.settings.installationDirectory === ''   ||
             this.props.settings.installationType === undefined ||
             this.props.settings.installationType === 'choose'  ||
             this.props.settings.gameVersion === undefined      ||
             this.props.settings.gameVersion === 'choose')      &&
             this.props.view !== VIEWS.WELCOME                  ?
               <WelcomePage />                                  :
               <>
                 { [VIEWS.SONG_LIST].some(view => this.props.view === view) && <SortBar /> }
                 <MainView view={ this.props.view } subView={ this.props.subView } />
               </>
          }
          <Warnings warnings={ this.props.warnings } />
        </div>
      </div>
    )
  }
}

ViewSwitcher.propTypes = {
  view: PropTypes.string.isRequired,
  subView: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  warnings: PropTypes.array,
  sidebarOpen: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  view: state.view.view,
  subView: state.view.subView,
  settings: state.settings,
  details: state.details,
  warnings: state.warnings,
  sidebarOpen: state.sidebar.isOpen
})

export default connect(mapStateToProps, null)(ViewSwitcher)
