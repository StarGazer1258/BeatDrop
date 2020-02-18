import React, { Component } from 'react';
import '../css/CoverGrid.scss'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadMore } from '../actions/songListActions'

import CoverGridItem from './CoverGridItem'
import LoadMore from './LoadMore'
import Button from './Button'

import addIcon from '../assets/add-filled.png'
import { defaultPlaylistIcon } from '../b64Assets'

import { setPlaylistPickerOpen, setNewPlaylistDialogOpen, clearPlaylistDialog, createNewPlaylist, addSongToPlaylist } from '../actions/playlistsActions'
import { downloadSong, deleteSong, checkDownloadedSongs } from '../actions/queueActions'
import { displayWarning } from '../actions/warningActions'

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const { clipboard, shell } = window.require('electron')

class CoverGrid extends Component {

  constructor(props) {
    super(props)

    this.state = {
      song: ''
    }
  }

  componentDidMount() {
    document.getElementById('cover-grid-container').addEventListener('scroll', this.onScroll.bind(this))
    document.getElementById('cover-grid-container').scrollTop = this.props.scrollTop
  }

  componentWillUnmount() {
    document.getElementById('cover-grid-container').removeEventListener('scroll', this.onScroll)
  }

  onScroll() {
    let coverGridContainer = document.getElementById('cover-grid-container')
    if(((coverGridContainer.scrollHeight - coverGridContainer.scrollTop) - coverGridContainer.clientHeight) <= 1) {
      if(!this.props.loadingMore && !this.props.loading && this.props.autoLoadMore) {
        if(this.props.songs.songs.length >= this.props.songs.totalSongs) return
        this.props.loadMore()
      }
    }
  }

  render() {
    return (
      <div id="cover-grid-container">
        <div className="cover-grid">
        {(this.props.loading) ?
            Array(15).fill(0).map((v, i) => {
              return <CoverGridItem key={ i } loading />
            })
          :
            this.props.songs.songs.map((song, i) => {
              let hash = song.hash || song.hashMd5
              return (
                <ContextMenuTrigger id={ hash }>
                <CoverGridItem
                  key = { hash || i }
                  title={ song.songName || song._songName || song.metadata.songName }
                  artist={ song.authorName || song._songAuthorName || (song.metadata === undefined ? null : song.metadata.songAuthorName) }
                  difficulties={ song.difficulties || song.difficultyLevels || song._difficultyBeatmapSets || song.metadata.difficulties }
                  imageSource={ song.coverURL || song.coverUrl }
                  songKey={ song.key } hash={ hash }
                  file={ song.file } downloads={ song.downloadCount }
                  upvotes={ song.upVotes } downvotes={ song.downVotes }
                  plays={ song.playedCount }
                />
                <ContextMenu id={ hash }>
                  <MenuItem onClick={ (e) => {e.stopPropagation(); (!!song.file || this.props.songs.downloadedSongs.some(dsong => dsong.hash === (hash))) ? this.props.deleteSong(song.file || hash) : this.props.downloadSong(hash)} }>
                    {`${(!!song.file || this.props.songs.downloadedSongs.some(dsong => dsong.hash === (hash))) ? 'Delete'  : 'Download'} ${song.songName}`}
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
            })
          }
        </div>
        <LoadMore />
        <div id="playlist-picker" className={ this.props.playlistPickerOpen ? '' : 'hidden' }>
            <div id="playlist-picker-inner">
              <h1>Add to playlist:</h1><Button onClick={ () => { this.props.setPlaylistPickerOpen(false) } }>Cancel</Button>
              <div id="playlist-picker-table">
                {this.props.playlists.map((playlist, i) => {
                  return <div className="playlist-picker-item" key={ i } onClick={ () => { this.props.addSongToPlaylist(this.state.song, playlist.file); this.props.setPlaylistPickerOpen(false) } }><img src={ playlist.image } alt=""/><div><div className="playlist-picker-item-title">{playlist.playlistTitle}</div><div className="flex-br"></div><div className="playlist-picker-item-author">{playlist.playlistAuthor}</div><div className="flex-br"></div>{playlist.songs.length} Songs</div></div>
                })}
                <div className="playlist-picker-item" onClick={ () => { this.props.setNewPlaylistDialogOpen(true); this.props.setPlaylistPickerOpen(false) } }><img src={ addIcon } alt=""/><div><div className="playlist-picker-item-title">Create New</div></div></div>
              </div>
            </div>
          </div>
          <div id="new-playlist-dialog-under" className={ this.props.newPlaylistDialogOpen ? '' : 'hidden' }>
            <div id="new-playlist-dialog">
              <div>
                <h2>New Playlist</h2>
                <label htmlFor="new-playlist-cover-image" id="new-playlist-add-cover-image"><img src={ this.props.newCoverImageSource || defaultPlaylistIcon } alt="" /></label>
                <label htmlFor="new-playlist-cover-image" id="image-text">Cover Image (Click to Change)</label>
                <input type="file" name="new-playlist-cover-image" id="new-playlist-cover-image" accept=".jpg,.jpeg,.png,.gif" onChange={ (e) => {this.props.loadPlaylistCoverImage(e.target.files[0].path || this.props.settings.newCoverImageSource)} } /><br />
              </div>
              <div id="new-playlist-info">
                <label htmlFor="new-playlist-title">Playlist Title</label>
                <input className="text-box" type='text' name="new-playlist-title" id="new-playlist-title" placeholder="Untitled Playlist" /><br /><br />
                <label htmlFor="new-playlist-author">Playlist Author</label>
                <input className="text-box" type="text" name="new-playlist-author" id="new-playlist-author" placeholder="Anonymous" /><br /><br />
                <label htmlFor="new-playlist-description">Playlist Description</label>
                <textarea className="text-area" name="new-playlist-description" id="new-playlist-description" cols="40" rows="7" placeholder="This playlist has no description." /><br /><br />
                <Button type="primary" onClick={ () => { this.props.createNewPlaylist({ playlistTitle: document.getElementById('new-playlist-title').value || 'Untitled Playlist', playlistAuthor: document.getElementById('new-playlist-author').value || 'Anonymous', playlistDescription: document.getElementById('new-playlist-description').value || 'This playlist has no description.' }); this.props.setNewPlaylistDialogOpen(false); this.props.setPlaylistPickerOpen(true); this.props.clearPlaylistDialog() } }>Create Playlist</Button>
                <Button onClick={ () => { this.props.setNewPlaylistDialogOpen(false); this.props.setPlaylistPickerOpen(true); this.props.clearPlaylistDialog() } }>Cancel</Button>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

CoverGrid.propTypes = {
  songs: PropTypes.object.isRequired,
  playlists: PropTypes.array.isRequired,
  scrollTop: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  songs: state.songs,
  playlists: state.playlists.playlists,
  scrollTop: state.songs.scrollTop,
  loading: state.loading,
  autoLoadMore: state.settings.autoLoadMore,
  playlistPickerOpen: state.playlists.pickerOpen,
  newPlaylistDialogOpen: state.playlists.newPlaylistDialogOpen
})

export default connect(mapStateToProps, { loadMore, downloadSong, deleteSong, setPlaylistPickerOpen, setNewPlaylistDialogOpen, clearPlaylistDialog, createNewPlaylist, addSongToPlaylist, displayWarning, checkDownloadedSongs })(CoverGrid)