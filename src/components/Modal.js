import React, { Component } from 'react'
import '../css/Modal.css'

import { connect } from 'react-redux'

class Modal extends Component {

  render() {
    return (
      <div className={`modal-under theme-${this.props.theme}`}>
        <div style={{width: this.props.width || 800, height: this.props.height || 450}} className='modal'>
          {this.props.children}
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  theme: state.settings.theme
})

export default connect(mapStateToProps, null)(Modal)