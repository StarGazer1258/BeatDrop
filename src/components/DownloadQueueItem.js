import React, { Component } from 'react'
import '../css/DownloadQueueItem.scss'

class DownloadQueueItem extends Component {

  render() {
    return (
        <li className="download-queue-item i-download-queue">
          <img className="i-download-queue" src={ this.props.image } alt='' />
          <div className="queue-item-info i-download-queue"><div className="queue-item-title i-download-queue">{this.props.title}</div>
            <div className="queue-item-artist i-download-queue">{this.props.artist}</div>
            <div className="queue-item-progress i-dowload-queue">
              <div className="queue-item-progress-inner i-download-queue" style={ { width: `${this.props.progress}%` } }></div>
            </div>
            <div className="queue-item-progress-label i-download-queue">{this.props.progress < 100 ? this.props.progress + '%' : 'Done'}</div>
          </div>
        </li>
    )
  }
  
}

export default DownloadQueueItem