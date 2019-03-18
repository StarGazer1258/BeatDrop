import React, { Component } from 'react'
import '../css/TextArea.scss'

import PropTypes from 'prop-types'

class TextArea extends Component {
  render() {
    return <textarea className="text-area" name={ this.props.name } type={ this.props.type } placeholder={ this.props.placeholder || '' } rows={ this.props.rows || 7 } cols={ this.props.cols || 30 } />
  }
}

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string
}

export default TextArea