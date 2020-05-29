import React, { Component } from 'react'
import '../css/DownloadQueue.scss'

import DownloadQueueItem from './DownloadQueueItem'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { clearQueue } from '../actions/queueActions'

class DownloadQueue extends Component {
  render() {
    const shouldHide = !this.props.items || this.props.items.length === 0

    if (shouldHide) {
      return null
    }

    return (
      <div id="download-queue" className={ `i-download-queue theme-${this.props.theme}` }>
        <div id="queue-toolbar" className={ 'i-download-queue' }><div className="i-download-queue" style={ { width: '40px' } }></div><div className="i-download-queue" style={ { height: '20px' } }>Download Queue</div><div className="i-download-queue" title="Clear Queue" id="clear-queue-button" onClick={ this.props.clearQueue }></div></div>
        <ul>
            {this.props.items.map((song, i) => {
              return (
                <DownloadQueueItem key={ i } image={ song.image } title={ song.title } artist={ song.artist } progress={ song.progress } />
              )
            })}
        </ul>
      </div>
    )
  }
}

DownloadQueue.propTypes = {
  items: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
  clearQueue: PropTypes.func.isRequired
}

let mapStateToProps = (state) => ({
  items: state.queue.items,
  theme: state.settings.theme
})

export default connect(mapStateToProps, { clearQueue })(DownloadQueue)