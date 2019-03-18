import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../css/TitleBar.scss'
import BlueDrop from '../assets/appicons/png/BeatDropNoOutlineInvert.png'
import WhiteDrop from '../assets/appicons/png/BeatDropNoOutlineWhite.png'
import { connect } from 'react-redux'
import { resizeWindow } from '../actions/windowActions'
import { resetDownloads } from '../actions/queueActions'
import { RESIZE_WINDOW } from '../actions/types'
import { store } from '../store'
const remote = window.require("electron").remote

const onMaximize = function () {
  store.dispatch({
    type: RESIZE_WINDOW,
    payload: true
  })
}

const onUnmaximize = function () {
  store.dispatch({
    type: RESIZE_WINDOW,
    payload: false
  })
}

class TitleBar extends Component {

  constructor(props) {
    super(props)

    this.onMaximize = onMaximize.bind(this)
    this.onUnmaximize = onUnmaximize.bind(this)
  }

  componentDidMount() {
    this.props.resetDownloads()
    remote.getCurrentWindow().on('maximize', this.onMaximize)
    remote.getCurrentWindow().on('unmaximize', this.onUnmaximize)
  }
  
  componentWillUnmount() {
    remote.getCurrentWindow().removeListener('maximize', this.onMaximize)
    remote.getCurrentWindow().removeListener('unmaximize', this.onUnmaximize)
  }

  componentWillReceiveProps(props) {
    if(!props.window.isMaximized) {
      remote.getCurrentWindow().unmaximize()
    } else {
      remote.getCurrentWindow().maximize()
    }
  }

  render() {
    return (
      <nav id="titlebar" className={ `theme-${this.props.theme}` }>
        <span className="window-title"><img src={ this.props.theme === 'dark' || this.props.theme === 'hc' ? WhiteDrop : BlueDrop } alt="BeatDrop" /><b>BeatDrop</b></span>
        <div id="close-button" onClick={ () => {remote.getCurrentWindow().close()} }><i id="close-icon" alt="Close"></i></div>
        <div id="resize-button" onClick={ () => { this.props.resizeWindow(this.props.window) } }><i id="resize-icon" className={ this.props.window.isMaximized ? 'maximized' : '' } alt="Maximize/Restore"></i></div>
        <div id="minimize-button" onClick={ () => {remote.getCurrentWindow().minimize()} }><i id="minimize-icon" alt="Minimize"></i></div>
      </nav>
    )
  }
}

TitleBar.propTypes = {
  resizeWindow: PropTypes.func.isRequired,
  window: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
  resetDownloads: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  window: state.window,
  theme: state.settings.theme
})

export default connect(mapStateToProps, { resizeWindow, resetDownloads })(TitleBar)