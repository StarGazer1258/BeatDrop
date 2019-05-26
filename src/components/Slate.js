import React, { Component } from 'react';
import '../css/Slate.scss'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Slate extends Component {
  render() {
    return (
      <div id="slate" className={ `theme-${this.props.theme}` } style={ { backgroundImage: `url(file://${encodeURI(this.props.themeImage)}), linear-gradient(${this.props.theme === 'light' ? 'rgba(255, 255, 255, 0.7), rgba(255, 255, 255, .8)' : 'rgba(0, 0, 0, 0.8), rgba(0, 0, 0, .8)' })` } } ></div>
    )
  }
}

Slate.propTypes = {
  theme: PropTypes.string.isRequired
}

let mapStateToProps = state => ({
  theme: state.settings.theme,
  themeImage: state.settings.themeImagePath
})

export default connect(mapStateToProps, null)(Slate)