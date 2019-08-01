import React, { Component } from 'react';
import '../css/Tab.scss'

class Tab extends Component {
  render() {
    return <span className={ `tab${ this.props.active ? ' active' : '' }${ this.props.disabled ? ' disabled' : '' }` } onClick={ () => { if(!this.props.disabled) this.props.onClick() } }>{ this.props.children }</span>
  }
}

export default Tab