import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../css/SortBar.css'
import TabGroup from './TabGroup';
import Tab from './Tab';

import { setSongView } from '../actions/viewActions'

class SortBar extends Component {
  render() {
    if(this.props.hidden) return null
    return (
      <div className='sort-bar'>
        <TabGroup label="View:"><Tab active={this.props.songView === 'list'} onClick={() => {this.props.setSongView('list')}}>List</Tab><Tab active={this.props.songView === 'compact-list'} onClick={() => {this.props.setSongView('compact-list')}}>Compact List</Tab><Tab active={this.props.songView === 'grid'} onClick={() => {this.props.setSongView('grid')}}>Grid</Tab></TabGroup>
      </div>
    )
  }
}

SortBar.propTypes = {
  setSongView: PropTypes.func.isRequired
}

let mapStateToProps = (state) => ({
  songView: state.view.songView
})

export default connect(mapStateToProps, { setSongView })(SortBar)

//<TabGroup label="Sort Order:"><Tab active={true}>Ascending</Tab><Tab>Descending</Tab></TabGroup>