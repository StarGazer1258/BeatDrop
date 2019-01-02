import React, { Component } from 'react'
import '../css/TextBox.css'

import PropTypes from 'prop-types'

class TextBox extends Component {
  render() {
    return <input className="text-box" name={this.props.name} type={this.props.type} placeholder={this.props.placeholder || ''} value={this.props.value || ''} disabled={this.props.disabled || false} />
  }
}

TextBox.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string
}

export default TextBox