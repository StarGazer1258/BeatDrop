import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../css/SongList.css'

import { connect } from 'react-redux'
import { refresh, loadMore } from '../actions/songListActions'

import SongListItem from './SongListItem'
import LoadMore from './LoadMore';

function MapsSongs(props) {
  if(props.loading) {
    return (
      <SongListItem loading />
    )
  } else {
    return (
      props.songs.map((song, i) => {
        return <SongListItem key={i} title={song.songName} artist={song.authorName} uploader={song.uploader} difficulties={song.difficulties} imageSource={song.coverUrl} songKey={song.key} file={song.file} downloads={song.downloadCount} upvotes={song.upVotes} downvotes={song.downVotes} plays={song.playedCount} />
      })
    )
  }
}

class SongList extends Component {

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

  render() {
    return (
      <ul id='song-list'>
        <MapsSongs loading={this.props.loading} songs={this.props.songs.songs} source={this.props.source} />
        <LoadMore />
      </ul>
    )
  }
}

SongList.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  songs: PropTypes.object.isRequired,
  scrollTop: PropTypes.number.isRequired,
  refresh: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  autoLoadMore: PropTypes.bool.isRequired,
  source: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  songs: state.songs,
  scrollTop: state.songs.scrollTop,
  loading: state.loading,
  loadingMore: state.loadingMore,
  autoLoadMore: state.settings.autoLoadMore,
  source: state.source.source
})

export default connect(mapStateToProps, { refresh, loadMore })(SongList)