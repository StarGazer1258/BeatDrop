import React, { Component } from 'react'
import '../css/SideBar.scss'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import SettingsButton from './SettingsButton'
import SearchButton from './SearchButton'
import { fetchNew, fetchTopDownloads, fetchTopFinished, fetchLocalSongs } from '../actions/songListActions'
import { fetchApprovedMods, fetchRecommendedMods, fetchModCategories, fetchLocalMods, fetchActivatedMods, checkInstalledMods } from '../actions/modActions'
import { fetchLocalPlaylists } from '../actions/playlistsActions'
import { setResource } from '../actions/sourceActions'
import { resizeSidebar, setSection } from '../actions/sidebarActions'
import QueueButton from './QueueButton';
import { SONG_LIST, PLAYLIST_LIST, MODS_VIEW } from '../views'
import * as RESOURCES from '../constants/resources'
import * as SECTIONS from '../constants/sections'
import DonateButton from './DonateButton';

class SideBar extends Component {

  render() {
    return (
      <div id='sidebar' className={ this.props.sidebarOpen ? '' : 'collapsed' }>
        <div className='resize-sidebar' title={ this.props.sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar' } onClick={ this.props.resizeSidebar }></div>
        <h4 title={ `Songs` } className={ `section section-songs${this.props.section === SECTIONS.SONGS ? ' selected' : ''}` } onClick={ () => { this.props.setSection(SECTIONS.SONGS); if(!this.props.offlineMode) { this.props.fetchNew() } else { this.props.fetchLocalSongs() } } }>SONGS</h4>
        <div className={ `section-content${this.props.section === SECTIONS.SONGS ? ' selected' : ''}` }>
          <h5>LIBRARY</h5>
          <ul>
            <li className={ `fetch-local-songs${this.props.view === SONG_LIST && this.props.resource === RESOURCES.LIBRARY.SONGS ? ' selected' : ''}` } onClick={ this.props.fetchLocalSongs }>Songs</li>
            <li className={ `fetch-local-playlists${this.props.view === PLAYLIST_LIST ? ' selected' : ''}` } onClick={ this.props.fetchLocalPlaylists }>Playlists</li>
          </ul>
          <h5>BEATSAVER</h5>
          <ul>
            <li title={ `New Songs${this.props.offlineMode ? ' (Not available in offline mode)' : ''}` } className={ `fetch-new-songs${this.props.view === SONG_LIST && this.props.resource === RESOURCES.BEATSAVER.NEW_SONGS ? ' selected' : ''}${this.props.offlineMode ? ' disabled' : ''}` } onClick={ this.props.offlineMode ? null : this.props.fetchNew }>New Songs</li>
            <li title={ `Top Finished${this.props.offlineMode ? ' (Not available in offline mode)' : ''}` } className={ `fetch-top-finished ${this.props.view === SONG_LIST  && this.props.resource === RESOURCES.BEATSAVER.TOP_FINISHED_SONGS ? 'selected' : ''}${this.props.offlineMode ? ' disabled' : ''}` } onClick={ this.props.offlineMode ? null : this.props.fetchTopFinished }>Top Finished</li>
            <li title={ `Top Downloaded${this.props.offlineMode ? ' (Not available in offline mode)' : ''}` } className={ `fetch-top-downloaded ${this.props.view === SONG_LIST && this.props.resource === RESOURCES.BEATSAVER.TOP_DOWNLOADED_SONGS ? 'selected' : ''}${this.props.offlineMode ? ' disabled' : ''}` } onClick={ this.props.offlineMode ? null : this.props.fetchTopDownloads }>Top Downloaded</li>
          </ul>
        </div>
        <h4 title={ `Mods` } className={ `section section-mods${this.props.section === SECTIONS.MODS ? ' selected' : ''}` } onClick={ () => { this.props.setSection(SECTIONS.MODS); if(!this.props.offlineMode) { this.props.fetchApprovedMods() } else { this.props.fetchLocalMods() } } }>MODS</h4>
        <div className={ `section-content${this.props.section === SECTIONS.MODS ? ' selected' : ''}` }>
          <h5>LIBRARY</h5>
          <ul>
            <li title={ `All Library Mods` } className={ `library-all-mods${this.props.view === MODS_VIEW && this.props.resource === RESOURCES.LIBRARY.MODS.ALL ? ' selected' : ''}` } onClick={ this.props.fetchLocalMods }>All</li>
            <li title={ `Activated Mods` } className={ `library-activated-mods${this.props.view === MODS_VIEW && this.props.resource === RESOURCES.LIBRARY.MODS.ACTIVATED ? ' selected' : ''}` } onClick={ this.props.fetchActivatedMods }>Activated</li>
          </ul>
          <h5>BEATMODS</h5>
          <ul>
            <li title={ `All BeatMod Mods${this.props.offlineMode ? ' (Not available in offline mode)' : ''}` } className={ `modsaber-all${this.props.view === MODS_VIEW && this.props.resource === RESOURCES.BEATMODS.NEW_MODS ? ' selected' : ''}${this.props.offlineMode ? ' disabled' : ''}` } onClick={ this.props.offlineMode ? null : this.props.fetchApprovedMods }>All</li>
            <li title={ `Recommended Mods${this.props.offlineMode ? ' (Not available in offline mode)' : ''}` } className={ `modsaber-recommended${this.props.view === MODS_VIEW && this.props.resource === RESOURCES.BEATMODS.RECOMMENDED_MODS ? ' selected' : ''}${this.props.offlineMode ? ' disabled' : ''}` } onClick={ this.props.offlineMode ? null : this.props.fetchRecommendedMods }>Recommended</li>
            <li title={ `Mod Categories${this.props.offlineMode ? ' (Not available in offline mode)' : ''}` } className={ `modsaber-categories${this.props.view === MODS_VIEW && this.props.resource === RESOURCES.BEATMODS.MOD_CATEGORIES ? ' selected' : ''}${this.props.offlineMode ? ' disabled' : ''}` } onClick={ this.props.offlineMode ? null : this.props.fetchModCategories }>Categories</li>
          </ul>
        </div>
        <div className="buttons-bottom"><SettingsButton /><SearchButton /><QueueButton /><DonateButton /></div>
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
  fetchApprovedMods: PropTypes.func.isRequired,
  fetchRecommendedMods: PropTypes.func.isRequired,
  fetchModCategories: PropTypes.func.isRequired,
  setResource: PropTypes.func.isRequired,
  resizeSidebar: PropTypes.func.isRequired,
  setSection: PropTypes.func.isRequired,
  resource: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  view: state.view.view,
  resource: state.resource,
  sidebarOpen: state.sidebar.isOpen,
  offlineMode: state.settings.offlineMode,
  section: state.sidebar.section
})

export default connect(mapStateToProps, { fetchNew, fetchTopDownloads, fetchTopFinished, fetchLocalSongs, fetchLocalPlaylists, fetchApprovedMods, fetchLocalMods, fetchActivatedMods, fetchRecommendedMods, fetchModCategories, setResource, resizeSidebar, setSection, checkInstalledMods })(SideBar)

/*
<li className={ `library-conflicted-mods${this.props.view === MODS_VIEW && this.props.resource === RESOURCES.LIBRARY.MODS.CONFLICTS ? ' selected' : ''}` }>Mod Packs</li>
<h4 className={ `section section-sabers${this.props.section === SECTIONS.SABERS ? ' selected' : ''}` } onClick={ () => { this.props.setSection(SECTIONS.SABERS) } }>SABERS</h4>
<h4 className={ `section section-platforms${this.props.section === SECTIONS.PLATFORMS ? ' selected' : ''}` } onClick={ () => { this.props.setSection(SECTIONS.PLATFORMS) } }>PLATFORMS</h4>
<h4 className={ `section section-avatars${this.props.section === SECTIONS.AVATARS ? ' selected' : ''}` } onClick={ () => { this.props.setSection(SECTIONS.AVATARS) } }>AVATARS</h4>
<h5>BEASTSABER</h5>
<ul>
  <li className={`fetch-new-reviews ${this.props.source.source === 'beastsaber' && this.props.source.resource === 'new' ? 'selected' : ''}`}>New Reviews</li>
  <li className={`fetch-featured-songs`}>Featured Songs</li>
  <li className='fetch-featured-playlists'>Featured Playlists</li>
</ul>
*/