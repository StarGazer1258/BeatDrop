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

  componentDidMount() {
    document.getElementById('song-list').addEventListener('scroll', this.onScroll.bind(this))
    document.getElementById('song-list').scrollTop = this.props.scrollTop
  }
  
  componentWillUnmount() {
    document.getElementById('song-list').removeEventListener('scroll', this.onScroll)
  }

  onScroll() {
    let songList = document.getElementById('song-list')
    if(((songList.scrollHeight - songList.scrollTop) - songList.clientHeight) <= 1) {
      if(!this.props.loadingMore && !this.props.loading && this.props.autoLoadMore) {
        if(this.props.songs.songs.length >= this.props.songs.totalSongs) return
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
        <MapsSongs loading={this.props.loading} songs={this.props.songs.songs} />
        <LoadMore />
      </ul>
    )
  }
}

CompactSongList.propTypes = {
  loading: PropTypes.bool.isRequired,
  songs: PropTypes.object.isRequired,
  scrollTop: PropTypes.number.isRequired,
  refresh: PropTypes.func.refresh,
  autoLoadMore: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  songs: state.songs,
  scrollTop: state.songs.scrollTop,
  loading: state.loading,
  loadingMore: state.loadingMore,
  autoLoadMore: state.settings.autoLoadMore
})

export default connect(mapStateToProps, { refresh, loadMore, loadDetails })(CompactSongList)