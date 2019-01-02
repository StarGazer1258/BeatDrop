import React, { Component } from 'react';
import '../css/PageIndicator.css'

import { connect } from 'react-redux'

class PageIndicator extends Component {
  render() {
    return (
      <div id="page-indicator">{this.props.page.index}<span id="total-pages">{this.props.page.current + this.props.page.length}</span></div>
    )
  }
}

const mapStateToProps = state => ({
  page: state.page
})

export default connect(mapStateToProps, null)(PageIndicator)