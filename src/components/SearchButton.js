import React, { Component } from 'react'
import '../css/SearchButton.css'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setView } from '../actions/viewActions'
import { SEARCH } from '../views'

class SearchButton extends Component {
  constructor(props) {
    super(props)
    window.addEventListener('keyup', (e) => { if(e.keyCode === 83 && e.ctrlKey) { this.props.setView(SEARCH); document.getElementById('search-box').focus() } if (e.which === 123) { require('electron').remote.getCurrentWindow().toggleDevTools() } })
  }

  render() {
    return <div title="Search" className={"search-button" + (this.props.view === SEARCH ? ' open' : '')} onClick={() => this.props.setView(SEARCH)}></div>
  }
}

SearchButton.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  view: state.view.view
})

export default connect(mapStateToProps, { setView })(SearchButton)