import React, { Component } from 'react';
import '../css/Tab.css'

class Tab extends Component {
  render() {
    return <span className={'tab' + (this.props.active ? ' active' : '')} onClick={() => {this.props.onClick()}}>{this.props.children}</span>
  }
}

export default Tab