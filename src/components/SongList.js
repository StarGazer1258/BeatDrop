import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../css/SongList.scss'

import { connect } from 'react-redux'
import { loadMore } from '../actions/songListActions'
import { downloadSong, deleteSong, checkDownloadedSongs } from '../actions/queueActions'
import { setPlaylistPickerOpen } from '../actions/playlistsActions'
import { displayWarning } from '../actions/warningActions'

import SongListItem from './SongListItem'
import LoadMore from './LoadMore';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import PlaylistPicker from './PlaylistPicker';

const { clipboard, shell } = window.require('electron')

const upArrowShortcut   = function(e) { if(e.keyCode === 38 && this.state.highlighted > 0)                             { this.setState({ highlighted: this.state.highlighted - 1 }) } }
const downArrowShortcut = function(e) { if(e.keyCode === 40 && this.state.highlighted < this.props.songs.songs.length) { this.setState({ highlighted: this.state.highlighted + 1 }) } }

class SongList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      song: '',
      highlighted: -1
    }

    this.upArrowShortcut = upArrowShortcut.bind(this)
    this.downArrowShortcut = downArrowShortcut.bind(this)
  }

  componentDidMount() {
    document.getElementById('song-list').addEventListener('scroll', this.onScroll.bind(this))
    document.getElementById('song-list').scrollTop = this.props.scrollTop

    window.addEventListener('keyup', this.upArrowShortcut)
    window.addEventListener('keyup', this.downArrowShortcut)
  }

  componentWillUnmount() {
    document.getElementById('song-list').removeEventListener('scroll', this.onScroll)

    window.removeEventListener('keyup', this.upArrowShortcut)
    window.removeEventListener('keyup', this.downArrowShortcut)
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
        {(this.props.loading) ?
          <SongListItem loading />
        :
          this.props.songs.songs.map((song, i) => {
            let hash = song.hash || song.hashMd5
            return (
              <ContextMenuTrigger id={ hash } key={ hash || i }>
                <SongListItem
                  key={ hash || i }
                  title={ song.songName || song._songName || song.metadata.songName }
                  ratings={ song.ratings || song.stats ? song.stats.rating : '' }
                  artist={ song.authorName || song._songAuthorName || (song.metadata === undefined ? null : song.metadata.songAuthorName) }
                  uploader={ song.uploader ? song.uploader.username : '' }
                  difficulties={ song.difficultyLevels || song.difficulties || song._difficultyBeatmapSets || ((song.metadata !== undefined) ? song.metadata.difficulties : null) }
                  imageSource={ song.coverURL || song.coverUrl }
                  songKey={ song.key }
                  hash={ hash }
                  file={ song.file }
                  downloads={ song.stats ? song.stats.downloads : song.downloadCount }
                  upvotes={ song.stats ? song.stats.upVotes : song.upVotes }
                  downvotes={ song.stats ? song.stats.downVotes : song.downVotes }
                  plays={ song.stats ? song.stats.plays : song.playedCount }
                  uploadDate={ !!song.uploaded ? new Date(Date.parse(song.uploaded)).toLocaleString() : '' }
                />
                <ContextMenu id={ hash }>
                  <MenuItem onClick={ (e) => {e.stopPropagation(); (!!song.file || this.props.songs.downloadedSongs.some(dsong => dsong.hash === (hash))) ? this.props.deleteSong(song.file || hash) : this.props.downloadSong(hash)} }>
                    {`${(!!song.file || this.props.songs.downloadedSongs.some(dsong => dsong.hash === (hash))) ? 'Delete'  : 'Download'} ${song.songName || song._songName || song.metadata.songName}`}
                  </MenuItem>
                  <MenuItem onClick={ (e) => {e.stopPropagation(); this.setState({ song }); this.props.setPlaylistPickerOpen(true)} }>
                    Add to Playlist
                  </MenuItem>
                  <MenuItem divider />
                  <MenuItem onClick={ (e) => {e.stopPropagation(); if(hash || song.key) { clipboard.writeText(`beatdrop://songs/details/${hash || song.key}`); this.props.displayWarning({ timeout: 5000, color:'lightgreen', text: `Sharable Link for ${song.songName} copied to clipboard!` })} else { this.props.displayWarning({ text: `Failed to identify song. Song may have been downloaded externally. Songs will now be scanned. Please try again when scanning is finished.` }); this.props.checkDownloadedSongs(); }} }>Share</MenuItem>
                  {(!!song.id ? <MenuItem onClick={ (e) => {e.stopPropagation(); shell.openExternal(`https://www.bsaber.com/songs/${song.id}`)} }>View on BeastSaber</MenuItem> : null)}
                </ContextMenu>
              </ContextMenuTrigger>
            )
          })}
        <LoadMore />
        <PlaylistPicker song={ this.state.song } />
      </ul>
    )
  }
}

SongList.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadingMore: PropTypes.bool.isRequired,
  songs: PropTypes.object.isRequired,
  scrollTop: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  autoLoadMore: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  view: state.view,
  songs: state.songs,
  scrollTop: state.songs.scrollTop,
  loading: state.loading,
  loadingMore: state.loadingMore,
  autoLoadMore: state.settings.autoLoadMore
})

export default connect(mapStateToProps, { loadMore, downloadSong, deleteSong, setPlaylistPickerOpen, displayWarning, checkDownloadedSongs })(SongList)