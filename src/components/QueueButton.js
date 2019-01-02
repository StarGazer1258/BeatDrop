import React, { Component } from 'react'
import '../css/QueueButton.css'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setQueueOpen } from '../actions/queueActions'

class QueueButton extends Component {
  render() {
    return <div id="queue-button" title="Download Queue" onClick={() => { this.props.setQueueOpen(!this.props.isOpen) }}></div>
  }
}

QueueButton.propTypes = ({
  setQueueOpen: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
})

let mapStateToProps = (state) => ({
  isOpen: state.queue.isOpen
})

export default connect(mapStateToProps, { setQueueOpen })(QueueButton)