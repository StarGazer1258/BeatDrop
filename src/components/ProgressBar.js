import React, { Component } from 'react'
import '../css/ProgressBar.scss'

class ProgressBar extends Component {
  render() {
    return (
      <div className="progress-bar">
        <div className={ `progress-bar-inner${ this.props.indeterminate ? ' indeterminate' : '' }` } style={ { width: `${this.props.progress}%` } }></div>
      </div>
    )
  }
}

export default ProgressBar