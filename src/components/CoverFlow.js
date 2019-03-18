import React, { Component } from 'react';
import '../css/CoverFlow.css'
import CoverFlowItem from './CoverFlowItem'
import Coverflow from 'react-coverflow'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchNew } from '../actions/songListActions'

class CoverFlow extends Component {

  componentWillMount() {
    this.props.fetchNew()
  }

  render() {
    return (
      <Coverflow width="985" height="500"
        displayQuantityOfSide={ 2 }
        navigation={ true }
        enableScroll={ true }
        clickable={ true }
        active="middle"
      >
        {this.props.songs.map((song, index) => {
          return <CoverFlowItem key={ index } title={ song.songName } artist={ song.authorName } uploader={ song.uploader } coverImage={ song.coverUrl } />
        })}
      </Coverflow>
    )
  }
}

CoverFlow.propTypes = {
  songs: PropTypes.array.isRequired,
  fetchNew: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  songs: state.songs
})

export default connect(mapStateToProps, { fetchNew })(CoverFlow)