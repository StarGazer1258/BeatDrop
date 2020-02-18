import React, { Component } from 'react';
import Button from './Button'
import Loader from '../assets/loading-dots2.png'
import '../css/LoadMore.scss'

import { loadMore } from '../actions/songListActions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class LoadMore extends Component {

  constructor() {
    super()
    this.state = {
      hidden: false
    }
  }

  render() {
    if(this.props.songs.songs.length >= this.props.songs.totalSongs) return null
    if(this.props.loadingMore) {
      return (
        <li className='load-more loading'>
          <img src={ Loader } alt={ this.props.key } /><div className="flex-br"></div>
          <span style={ { marginTop: '-40px', marginBottom: '40px', textDecoration: 'underline' } } onClick={ this.props.loadMore }>Loading may have failed, click here to try again.</span>
        </li>
      )
    } else {
      return (
        <div className='load-more'>
          <Button onClick={ this.props.loadMore }>Load More...</Button>
        </div>
      )
    }

  }
}

LoadMore.propTypes = {
  loadingMore: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  songs: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  loadingMore: state.loadingMore,
  songs: state.songs
})

export default connect(mapStateToProps, { loadMore })(LoadMore)