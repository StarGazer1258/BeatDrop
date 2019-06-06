import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../css/SortBar.scss'
import TabGroup from './TabGroup';
import Tab from './Tab';

import { setSubView } from '../actions/viewActions'
import { setSortBy } from '../actions/viewActions'

import * as VIEWS from '../views'

class SortBar extends Component {
  render() {
    if(this.props.hidden) return null;
    return (
        <div className='sort-bar'>
            { this.props.view === VIEWS.SONG_LIST && <TabGroup label="View:"><Tab active={ this.props.subView === 'list' } onClick={ () => {this.props.setSubView('list')} }>List</Tab><Tab active={ this.props.subView === 'compact-list' } onClick={ () => {this.props.setSubView('compact-list')} }>Compact List</Tab><Tab active={ this.props.subView === 'grid' } onClick={ () => {this.props.setSubView('grid')} }>Grid</Tab></TabGroup> }
            { this.props.view === VIEWS.MODS_VIEW && <TabGroup label="View:"><Tab active={ this.props.subView === 'list' } onClick={ () => {this.props.setSubView('list')} }>List</Tab><Tab active={ this.props.subView === 'tiles' } onClick={ () => {this.props.setSubView('tiles')} }>Tiles</Tab></TabGroup> }
            { this.props.sortBy === VIEWS.SONGNAME && <TabGroup label="Sort by:"><Tab active={ this.props.sortBy === 'songName' } onClick={ () => {this.props.setSortBy('songName')} }>Song Name</Tab><Tab active={ this.props.sortBy === 'authorName' } onClick={ () => {this.props.setSortBy('songName')} }>Author Name</Tab><Tab active={ this.props.sortBy === 'beatsPerMinute' } onClick={ () => {this.props.setSortBy('beatsPerMinute')} }>BPM</Tab></TabGroup> }
        </div>
    )
  }
}

SortBar.propTypes = {
  setsubView: PropTypes.func.isRequired,
  setSortBy: PropTypes.func.isRequired
}

let mapStateToProps = (state) => ({
  view: state.view.view,
  subView: state.view.subView,
  sortBy: state.view.sortBy
})

export default connect(mapStateToProps, { setSubView, setSortBy })(SortBar)

//<TabGroup label="Sort Order:"><Tab active={true}>Ascending</Tab><Tab>Descending</Tab></TabGroup>