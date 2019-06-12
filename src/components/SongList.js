import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../css/SongList.scss'

import { connect } from 'react-redux'
import { loadMore } from '../actions/songListActions'
import { downloadSong, deleteSong, checkDownloadedSongs } from '../actions/queueActions'
import { setPlaylistPickerOpen, setNewPlaylistDialogOpen, clearPlaylistDialog, createNewPlaylist, addSongToPlaylist } from '../actions/playlistsActions'
import { displayWarning } from '../actions/warningActions'

import SongListItem from './SongListItem'
import LoadMore from './LoadMore';
import Button from './Button'

import addIcon from '../assets/add-filled.png'
import { defaultPlaylistIcon } from '../b64Assets'

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import { makeRenderKey } from '../utilities'

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
            let songTags = [
              {
                boolean: true,
                tag: song.hash || song.hashMd5 || song.songName
              },
              {
                boolean: !!song.file || this.props.songs.downloadedSongs.some(dsong => dsong.hash === (song.hash || song.hashMd5)),
                tag: '.downloaded'
              },
              {
                boolean: !!song.ratings,
                tag: '.ratings-loaded'
              },
              {
                boolean: this.props.view.subView === 'compact-list',
                tag: '.compact'
              }
            ];
            return (
              <ContextMenuTrigger id={ song.hash || song.hashMd5 }>
                <SongListItem
                    key={ makeRenderKey(songTags) }
                    title={ song.metadata.songName }
                    ratings={ song.stats.rating }
                    artist={ song.metadata.songAuthorName }
                    uploader={ song.uploader.username }
                    difficulties={ song.metadata.difficulties || song.difficultyLevels }
                    imageSource={ song.coverURL }
                    songKey={ song.key }
                    hash={ song.hash || song.hashMd5 }
                    file={ song.file }
                    downloads={ song.stats.downloads }
                    upvotes={ song.stats.upVotes }
                    downvotes={ song.stats.downVotes }
                    plays={ song.stats.plays }
                    uploadDate={ !!song.uploaded ? new Date(Date.parse(song.uploaded)).toLocaleString() : '' } />
                <ContextMenu id={ song.hash || song.hashMd5 }>
                  <MenuItem onClick={ (e) => {e.stopPropagation(); (!!song.file || this.props.songs.downloadedSongs.some(dsong => dsong.hash === (song.hash || song.hashMd5))) ? this.props.deleteSong(song.file || song.hash || song.hashMd5) : this.props.downloadSong(song.hash || song.hashMd5)} }>
                    {`${(!!song.file || this.props.songs.downloadedSongs.some(dsong => dsong.hash === (song.hash || song.hashMd5))) ? 'Delete'  : 'Download'} ${song.songName}`}
                  </MenuItem>
                  <MenuItem onClick={ (e) => {e.stopPropagation(); this.setState({ song }); this.props.setPlaylistPickerOpen(true)} }>
                    Add to Playlist
                  </MenuItem>
                  <MenuItem divider />
                  <MenuItem onClick={ (e) => {e.stopPropagation(); if(song.hash || song.hashMd5 || song.key) { clipboard.writeText(`beatdrop://songs/details/${song.hash || song.hashMd5 || song.key}`); this.props.displayWarning({ timeout: 5000, color:'lightgreen', text: `Sharable Link for ${song.songName} copied to clipboard!` })} else { this.props.displayWarning({ text: `Failed to identify song. Song may have been downloaded externally. Songs will now be scanned. Please try again when scanning is finished.` }); this.props.checkDownloadedSongs(); }} }>Share</MenuItem>
                  {(!!song.id ? <MenuItem onClick={ (e) => {e.stopPropagation(); shell.openExternal(`https://www.bsaber.com/songs/${song.id}`)} }>View on BeastSaber</MenuItem> : null)}
                </ContextMenu>
              </ContextMenuTrigger>
            )
          })}
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
  playlists: state.playlists.playlists,
  scrollTop: state.songs.scrollTop,
  loading: state.loading,
  loadingMore: state.loadingMore,
  autoLoadMore: state.settings.autoLoadMore,
  playlistPickerOpen: state.playlists.pickerOpen
})

export default connect(mapStateToProps, { loadMore, downloadSong, deleteSong, setPlaylistPickerOpen, setNewPlaylistDialogOpen, clearPlaylistDialog, createNewPlaylist, addSongToPlaylist, displayWarning, checkDownloadedSongs })(SongList)