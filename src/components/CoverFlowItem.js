import React, { Component } from 'react';
import '../css/CoverFlowItem.css'

class CoverFlowItem extends Component {
  render() {
    return (
      <div className='cover-flow-item'>
        <img src={ this.props.coverImage } alt=""/>
      </div>
    )
  }
}

export default CoverFlowItem