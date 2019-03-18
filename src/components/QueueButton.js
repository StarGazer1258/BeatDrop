import React, { Component } from 'react'
import '../css/QueueButton.scss'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setQueueOpen } from '../actions/queueActions'

class QueueButton extends Component {

  componentDidMount() {
    document.addEventListener('mouseup', (e) => { if(!e.target.classList.contains('i-download-queue') && this.props.isOpen) { this.props.setQueueOpen(false) } })
  }

  render() {
    return <div className={ `i-download-queue${this.props.isOpen ? ' open' : ''}` } id="queue-button" title="Download Queue" onClick={ () => { this.props.setQueueOpen(!this.props.isOpen) } }></div>
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