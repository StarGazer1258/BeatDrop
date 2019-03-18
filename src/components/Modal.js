import React, { Component } from 'react'
import '../css/Modal.scss'

import { connect } from 'react-redux'

class Modal extends Component {

  render() {
    return (
      <div className={ `modal-under theme-${this.props.theme}` } onClick={ this.props.onClose }>
        <div style={ { width: this.props.width || 800, height: this.props.height || 450 } } className='modal' onClick={ (e) => { e.stopPropagation() } }>
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