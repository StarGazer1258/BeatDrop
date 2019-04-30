import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../css/SortBar.scss'
import TabGroup from './TabGroup';
import Tab from './Tab';

import { setSongView } from '../actions/viewActions'

import * as VIEWS from '../views'
 
class SortBar extends Component {
  render() {
    if(this.props.hidden) return null
    return (
      <div className='sort-bar'>
        { this.props.view === VIEWS.SONG_LIST && <TabGroup label="View:"><Tab active={ this.props.songView === 'list' } onClick={ () => {this.props.setSongView('list')} }>List</Tab><Tab active={ this.props.songView === 'compact-list' } onClick={ () => {this.props.setSongView('compact-list')} }>Compact List</Tab><Tab active={ this.props.songView === 'grid' } onClick={ () => {this.props.setSongView('grid')} }>Grid</Tab></TabGroup> }
        { this.props.view === VIEWS.MODS_VIEW && <TabGroup label="View:"><Tab active={ this.props.songView === 'basic' } onClick={ () => {this.props.setSongView('basic')} }>Basic</Tab><Tab active={ this.props.songView === 'advanced' } onClick={ () => {this.props.setSongView('advanced')} }>Advanced</Tab></TabGroup> }
      </div>
    )
  }
}

SortBar.propTypes = {
  setSongView: PropTypes.func.isRequired
}

let mapStateToProps = (state) => ({
  view: state.view.view,
  songView: state.view.songView
})

export default connect(mapStateToProps, { setSongView })(SortBar)

//<TabGroup label="Sort Order:"><Tab active={true}>Ascending</Tab><Tab>Descending</Tab></TabGroup>