import React, { Component } from 'react';
import PropTypes from 'prop-types'
import xIcon from '../assets/x-filled.png'

import { removeWarning } from '../actions/warningActions'
import { connect } from 'react-redux'

import '../css/Warning.scss'

class Warning extends Component {

  constructor(props) {
    super(props)

    this.state = {
      translateY: '-50px',
      opacity: 0,
      timeout: null
    }
  }

  componentDidMount() {
    setTimeout(() => { this.setState({ translateY: '0', opacity: 0.95 }) }, 1)
    if(this.props.timeout) {
      this.setState({
        timeout:
          setTimeout(() => {
            this.setState({ translateY: '-50px', opacity: 0 })
            setTimeout(() => {
              this.props.removeWarning(this.props.index)
            }, 500)
          }, this.props.timeout)
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  render() {
    return (
      <div className="warning" style={ { backgroundColor: this.props.color || 'rgb(255, 128, 128)', transform: `translateY(${ this.state.translateY })`, opacity: this.state.opacity } }>
        <span>{ this.props.text }</span>
        <span className="remove-warning" onClick={ () => { this.props.removeWarning(this.props.index) } }><img src={ xIcon } alt="X"/></span>
      </div>
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