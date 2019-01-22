import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../css/TitleBar.css'
import BlueDrop from '../assets/appicons/png/BeatDropNoOutlineInvert.png'
import WhiteDrop from '../assets/appicons/png/BeatDropNoOutlineWhite.png'
import { connect } from 'react-redux'
import { resizeWindow } from '../actions/windowActions'
import { resetDownloads } from '../actions/queueActions'
const remote = window.require("electron").remote

class TitleBar extends Component {

  componentDidMount() {
    this.props.resetDownloads()
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
      <nav id="titlebar" className={`theme-${this.props.theme}`}>
        <span className="window-title"><img src={this.props.theme === 'dark' ? WhiteDrop : BlueDrop} alt="BeatDrop" /><b>BeatDrop</b></span>
        <div id="close-button" onClick={() => {remote.getCurrentWindow().close()}}><i id="close-icon" alt="Close"></i></div>
        <div id="resize-button" onClick={() => { this.props.resizeWindow(this.props.window) }}><i id="resize-icon" alt="Maximize/Restore"></i></div>
        <div id="minimize-button" onClick={() => {remote.getCurrentWindow().minimize()}}><i id="minimize-icon" alt="Minimize"></i></div>
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