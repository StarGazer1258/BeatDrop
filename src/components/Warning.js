import React, { Component } from 'react';
import PropTypes from 'prop-types'
import xIcon from '../assets/x-filled.png'

import { removeWarning } from '../actions/warningActions'
import { connect } from 'react-redux'

import '../css/Warning.css'

class Warning extends Component {

  render() {
    return (
      <div className="warning"><span>{this.props.text}</span><span className="remove-warning" onClick={() => { this.props.removeWarning(this.props.index) }}><img src={xIcon} alt="X"/></span></div>
    )
  }
}

Warning.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  timeout: PropTypes.number,
  index: PropTypes.number.isRequired,
  removeWarning: PropTypes.func.isRequired
}

export default connect(null, { removeWarning })(Warning)