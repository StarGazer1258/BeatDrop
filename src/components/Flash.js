import React, { Component } from 'react';
import PropTypes from 'prop-types'
import xIcon from '../assets/x-filled.png'

import { removeFlash } from '../actions/flashActions'
import { connect } from 'react-redux'

import '../css/Flash.scss'

class Flash extends Component {

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
              this.props.removeFlash(this.props.index)
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
      <div className="flash" style={ { backgroundColor: this.props.color || 'rgb(255, 128, 128)', transform: `translateY(${ this.state.translateY })`, opacity: this.state.opacity } }>
        <span>{ this.props.text }</span>
        <span className="remove-flash" onClick={ () => { this.props.removeFlash(this.props.index) } }><img src={ xIcon } alt="X"/></span>
      </div>
    )
  }
}

Flash.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  timeout: PropTypes.number,
  index: PropTypes.string.isRequired,
  removeFlash: PropTypes.func.isRequired
}

export default connect(null, { removeFlash: removeFlash })(Flash)