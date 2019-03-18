import React, { Component } from 'react';
import '../css/Slate.scss'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Slate extends Component {
  render() {
    return (
      <div id="slate" className={ `theme-${this.props.theme}` }></div>
    )
  }
}

Slate.propTypes = {
  theme: PropTypes.string.isRequired
}

let mapStateToProps = state => ({
  theme: state.settings.theme
})

export default connect(mapStateToProps, null)(Slate)