import React, { Component } from 'react';
import '../css/OptionsBar.css'
import SettingsButton from './SettingsButton'
import RefreshButton from './RefreshButton'
import SearchBox from './SearchBox'
import Tab from './Tab'
import TabGroup from './TabGroup'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNew, fetchTopDownloads, fetchTopFinished, fetchLocalSongs, fetchLocalPlaylists } from '../actions/songListActions'
import { setSource, setResource } from '../actions/sourceActions'
import QueueButton from './QueueButton';

function AltTabs(props) {
  switch(props.source.source) {
    case 'beastsaber':
      return (
        <TabGroup k={0}>
          <Tab onClick={props.fetchTopDownloads}>Featured</Tab>
          <Tab onClick={props.fetchTopFinished}>Top Rated</Tab>
          <Tab onClick={props.fetchNew}>Newest Ratings</Tab>
          <Tab onClick={props.fetchNew}>Playlists</Tab>
        </TabGroup>
      )
    case 'beatsaver':
      return (
        <TabGroup k={1}>
          <Tab onClick={props.fetchNew}>Newest</Tab>
          <Tab onClick={props.fetchTopDownloads}>Top Downloads</Tab>
          <Tab onClick={props.fetchTopFinished}>Most Finished</Tab>
        </TabGroup>
      )
    case 'local':
      return (
        <TabGroup k={2}>
          <Tab onClick={props.fetchLocalSongs}>Songs</Tab>
          <Tab onClick={props.fetchLocalPlaylists}>Playlists</Tab>
        </TabGroup>
      )
    default:
      return null
  }
}

class OptionsBar extends Component {
  render() {
    return (
      <div id="options-bar">
        <SettingsButton />
        <RefreshButton />
        <QueueButton />
        <TabGroup>
          <Tab onClick={() => {this.props.setSource('beastsaber'); this.props.setResource('featured')}}>BeastSaber</Tab>
          <Tab onClick={this.props.fetchNew}>BeatSaver</Tab>
          <Tab onClick={this.props.fetchLocalSongs}>Local</Tab>
        </TabGroup>
        <AltTabs source={this.props.source} fetchNew={this.props.fetchNew} fetchTopDownloads={this.props.fetchTopDownloads} fetchTopFinished={this.props.fetchTopFinished} fetchLocalSongs={this.props.fetchLocalSongs} fetchLocalPlaylists={this.props.fetchLocalPlaylists} />
        <SearchBox />
      </div>
    )
  }
}

OptionsBar.propTypes = {
  fetchNew: PropTypes.func.isRequired,
  fetchTopDownloads: PropTypes.func.isRequired,
  fetchTopFinished: PropTypes.func.isRequired,
  fetchLocalSongs: PropTypes.func.isRequired,
  fetchLocalPlaylists: PropTypes.func.isRequired,
  setSource: PropTypes.func.isRequired,
  setResource: PropTypes.func.isRequired,
  source: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  source: state.source
})

export default connect(mapStateToProps, { fetchNew, fetchTopDownloads, fetchTopFinished, fetchLocalSongs, fetchLocalPlaylists, setSource, setResource })(OptionsBar)
/*
<SearchBox />
<SortGroup>
  <SortButton label="Top Downloads" onClick={this.props.fetchTopDownloads} />
  <SortButton label="Top Finish" onClick={this.props.fetchTopFinished} />
  <SortButton label="Newest" onClick={this.props.fetchNew} />
</SortGroup>
<SortGroup>
  <SortDropdown onChange={() => {}} options={[{value: 'mysongs', label: 'My Songs'}, {value: 'favorites', label: 'Favorites'}, {value: 'playlists', label: 'Playlists'}]} />
  <SortButton label="Download Queue" />
</SortGroup>
*/