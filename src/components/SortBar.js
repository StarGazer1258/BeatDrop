import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../css/SortBar.scss'
import TabGroup from './TabGroup';
import Tab from './Tab';

import { setSubView } from '../actions/viewActions'
import { setSortBy } from '../actions/viewActions'

import * as VIEWS from '../views'
import * as SORTING from '../constants/sorting'
import * as RESOURCES from '../constants/resources'

class SortBar extends Component {
  render() {
    if(this.props.hidden) return null;
    return (
        <div className='sort-bar'>
            { this.props.view === VIEWS.SONG_LIST && <TabGroup label="View:"><Tab active={ this.props.subView === VIEWS.LIST } onClick={ () => {this.props.setSubView(VIEWS.LIST)} }>List</Tab><Tab active={ this.props.subView === VIEWS.COMPACT_LIST } onClick={ () => {this.props.setSubView(VIEWS.COMPACT_LIST)} }>Compact List</Tab><Tab active={ this.props.subView === VIEWS.GRID } onClick={ () => {this.props.setSubView(VIEWS.GRID)} }>Grid</Tab></TabGroup> }
            { this.props.view === VIEWS.MODS_VIEW && <TabGroup label="View:"><Tab active={ this.props.subView === 'list' } onClick={ () => {this.props.setSubView('list')} }>List</Tab><Tab active={ this.props.subView === 'tiles' } onClick={ () => {this.props.setSubView('tiles')} }>Tiles</Tab></TabGroup> }
            { this.props.resources === RESOURCES.LIBRARY.SONGS && <TabGroup label="Sort by:"><Tab active={ this.props.sortBy === SORTING.SONG_NAME } onClick={ () => { this.props.sortOrder === SORTING.ASC ? this.props.setSortBy(SORTING.SONG_NAME, SORTING.ASC) : this.props.setSortBy(SORTING.SONG_NAME, SORTING.DESC) } }>Song Name</Tab><Tab active={ this.props.sortBy === SORTING.AUTHOR_NAME } onClick={ () => { this.props.sortOrder === SORTING.ASC ? this.props.setSortBy(SORTING.AUTHOR_NAME, SORTING.ASC) : this.props.setSortBy(SORTING.AUTHOR_NAME, SORTING.DESC) } }>Author Name</Tab><Tab active={ this.props.sortBy === SORTING.BEATS_PER_MINUTE } onClick={ () => { this.props.sortOrder === SORTING.ASC ? this.props.setSortBy(SORTING.BEATS_PER_MINUTE, SORTING.ASC) : this.props.setSortBy(SORTING.BEATS_PER_MINUTE, SORTING.DESC) } }>BPM</Tab><Tab active={ this.props.sortBy === SORTING.DIFFICULTY } onClick={ () => { this.props.sortOrder === SORTING.ASC ? this.props.setSortBy(SORTING.DIFFICULTY, SORTING.ASC) : this.props.setSortBy(SORTING.DIFFICULTY, SORTING.DESC) } }>Difficulty</Tab></TabGroup> }
            { this.props.resources === RESOURCES.LIBRARY.SONGS && <TabGroup label="Sort order:"><Tab active={ this.props.sortOrder === SORTING.ASC } onClick={ () => {this.props.setSortBy(this.props.sortBy, SORTING.ASC) } }>ASC</Tab><Tab active={ this.props.sortOrder === SORTING.DESC } onClick={ () => { this.props.setSortBy(this.props.sortBy,SORTING.DESC) } }>DESC</Tab></TabGroup> }
        </div>
    )
  }
}

SortBar.propTypes = {
  setSubView: PropTypes.func.isRequired,
  setSortBy: PropTypes.func.isRequired
}

let mapStateToProps = (state) => ({
  view: state.view.view,
  subView: state.view.subView,
  sortBy: state.view.sortBy,
  resources: state.resource,
  sortOrder: state.view.sortOrder
})

export default connect(mapStateToProps, { setSubView, setSortBy })(SortBar)

//<TabGroup label="Sort Order:"><Tab active={true}>Ascending</Tab><Tab>Descending</Tab></TabGroup>