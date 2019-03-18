import React, { Component } from 'react'
import '../css/SearchButton.scss'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setView } from '../actions/viewActions'
import { SEARCH } from '../views'

const searchShortcut = function (e) { if(e.keyCode === 83 && e.ctrlKey) { this.props.setView(SEARCH); document.getElementById('search-box').focus() } }

class SearchButton extends Component {
  constructor(props) {
    super(props)

    this.searchShortcut = searchShortcut.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keyup', this.searchShortcut)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.searchShortcut)
  }

  render() {
    return <div title="Search" id="search-button" className={ this.props.view === SEARCH ? ' open' : '' } onClick={ () => this.props.setView(SEARCH) }></div>
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