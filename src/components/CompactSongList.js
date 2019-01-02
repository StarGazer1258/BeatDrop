import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../css/SongList.css'

import { connect } from 'react-redux'
import { refresh, loadMore } from '../actions/songListActions'
import { loadDetails } from '../actions/detailsActions'

import CompactSongListItem from './CompactSongListItem'
import LoadMore from './LoadMore';

function MapsSongs(props) {
  if(props.loading) {
    return (
      <CompactSongListItem loading />
    )
  } else {
    return (
      props.songs.map((song, index) => {
        return <CompactSongListItem key={song.key} songKey={song.key} title={song.songName} artist={song.authorName} uploader={song.uploader} imageSource={song.coverUrl} difficulties={song.difficulties} file={song.file} />
      })
    )
  }
}

class CompactSongList extends Component {

  componentWillMount() {
    this.props.refresh()
  }

  componentDidMount() {
    document.getElementById('song-list').addEventListener('scroll', this.onScroll.bind(this))
  }
  
  componentWillUnmount() {
    document.getElementById('song-list').removeEventListener('scroll', this.onScroll)
  }

  onScroll() {
    let songList = document.getElementById('song-list')
    if(((songList.scrollHeight - songList.scrollTop) - songList.clientHeight) <= 1) {
      if(!this.props.loadingMore && !this.props.loading && this.props.autoLoadMore) {
        this.props.loadMore()
      }
    }
  }

  componentWillReceiveProps(props) {
    console.log(props)
  }

  render() {
    return (
      <ul id='song-list'>
        <MapsSongs loading={this.props.loading} songs={this.props.songs} />
        <LoadMore songs={this.props.songs} />
      </ul>
    )
  }
}

CompactSongList.propTypes = {
  loading: PropTypes.bool.isRequired,
  songs: PropTypes.array.isRequired,
  refresh: PropTypes.func.refresh,
  autoLoadMore: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  songs: state.songs.songs,
  loading: state.loading,
  loadingMore: state.loadingMore,
  autoLoadMore: state.settings.autoLoadMore
})

export default connect(mapStateToProps, { refresh, loadMore, loadDetails })(CompactSongList)