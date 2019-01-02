import React, { Component } from 'react'
import '../css/SettingsButton.css'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setView } from '../actions/viewActions'
import { SETTINGS } from '../views'

class SettingsButton extends Component {
  render() {
    return <div title="Settings" className={"settings-button" + (this.props.view === SETTINGS ? ' open' : '')} onClick={() => this.props.setView(SETTINGS)}></div>
  }
}

SettingsButton.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  view: state.view.view
})

export default connect(mapStateToProps, { setView })(SettingsButton)