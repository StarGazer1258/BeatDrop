import React, { Component } from 'react';
import '../css/SortGroup.css'

class SortGroup extends Component {
  render() {
    return <div className='sort-group'>{this.props.children}</div>
  }
}

export default SortGroup