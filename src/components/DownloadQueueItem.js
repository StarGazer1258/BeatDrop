import React, { Component } from 'react'
import '../css/DownloadQueueItem.css'

class DownloadQueueItem extends Component {
  render() {
    return (
        <li className="download-queue-item">
          <img src={this.props.image} alt='' /><div className="queue-item-info"><div className="queue-item-title">{this.props.title}</div><div className="queue-item-artist">{this.props.artist}</div><div className="queue-item-progress"><div className="queue-item-progress-inner" style={{width: `${this.props.progress}%`}}></div></div><div className="queue-item-progress-label">{this.props.progress < 100 ? this.props.progress + '%' : 'Done'}</div></div>
        </li>
    )
  }
}

export default DownloadQueueItem