import React, { Component } from 'react';
import '../css/Button.scss'

class Button extends Component {
  render() {
    return <span className={ `button ${this.props.type || ''}${this.props.disabled ? ' disabled' : ''}` } onClick={ () => { if(!this.props.disabled) this.props.onClick() } }>{this.props.children}</span>
  }
}

export default Button