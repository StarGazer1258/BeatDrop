import React, { Component } from 'react';
import '../css/Badge.scss'

class Badge extends Component {

  render() {
    return (
      <span className='badge' style={ { backgroundColor: this.props.backgroundColor, color: this.props.color } }>
        {this.props.children}
      </span>
    )
  }
}

export default Badge