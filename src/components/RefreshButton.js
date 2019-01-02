import React, { Component } from 'react'
import '../css/RefreshButton.css'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { refresh } from '../actions/songListActions'

class RefreshButton extends Component {
  render() {
    return <div className="refresh-button" title="Refresh Page" onClick={this.props.refresh}></div>
  }
}

RefreshButton.propTypes = ({
  refresh: PropTypes.func.isRequired
})

export default connect(null, { refresh })(RefreshButton)