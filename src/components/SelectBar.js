import React, { Component } from 'react'
import '../css/SelectBar.css'

import { connect } from 'react-redux'
import { setSelecting, deselectAll } from '../actions/songListActions'
import { downloadSong } from '../actions/queueActions'

class SelectBar extends Component {

  render() {
    return (
      <div id='select-bar'>
        <span>Select All</span><span onClick={ () => { this.props.deselectAll(); this.props.setSelecting(false) } }>Deselect All</span><span className={this.props.source === 'local' ? 'hidden' : null} onClick={ () => { for(let i = 0; i < this.props.selected.length; i++) { this.props.downloadSong(this.props.songs[this.props.selected[i]].hashMd5) } this.props.setSelecting(false) } } >Download Selected</span><span>Delete Selected</span><span>Add Selected to Playlist</span>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  source: state.source.source,
  view: state.view.view,
  selected: state.songs.selected,
  songs: state.songs.songs
})

export default connect(mapStateToProps, { setSelecting, deselectAll, downloadSong })(SelectBar)