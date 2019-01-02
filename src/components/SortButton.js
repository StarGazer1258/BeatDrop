import React, { Component } from 'react';
import '../css/SortButton.css'

class SortButton extends Component {
  render() {
    return <button className='sort-button' onClick={this.props.onClick}>{this.props.label}</button>
  }
}

export default SortButton