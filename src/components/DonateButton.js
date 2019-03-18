import React, { Component } from 'react'
import '../css/DonateButton.scss'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setView } from '../actions/viewActions'
import { DONATE } from '../views'

class DonateButton extends Component {

  render() {
    return <div id="donate-button" className={ this.props.view === DONATE ? ' open' : '' } title="Donate" onClick={ () => { this.props.setView(DONATE) } }></div>
  }

}

DonateButton.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  view: state.view.view
})

export default connect(mapStateToProps, { setView })(DonateButton)