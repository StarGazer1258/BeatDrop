import React, { Component } from 'react'
import '../css/CrashMessage.scss'

import Button from './Button'

import { setHasError } from '../actions/windowActions'
import { setView } from '../actions/viewActions'
import { WELCOME } from '../constants/views'

import { store } from '../store'
import { RESET_APP } from '../actions/types'

import { connect } from 'react-redux'

class CrashMessage extends Component {
  render() {
      return (
        <div id="crash-message" className={ `theme-${this.props.theme}` }>
          <div>
            <div className="error-image"></div>
            <h1>Oops! BeatDrop has crashed!</h1>
            <p>If you want to help with fixing this, provide a screenshot of this message and <a href="https://github.com/StarGazer1258/BeatDrop/issues/new?assignees=&amp;labels=&amp;template=bug_report.md&amp;title=" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); window.require('electron').shell.openExternal(e.target.href) } }>file a bug report in the GitHub repo</a>.<br /><b>Please search for your issue first before filing a duplicate issue.</b></p>
            <p className="errorMessage">{ this.props.errorMessage.name }{ this.props.errorInfo.componentStack }</p>
            <p>In the meantime, you can try resetting the view back the the welcome screen. If that doesn't work, you may have to reset the application entirely. This will reset all of your preferences, but will not delete any files.</p>
            <Button type="primary" onClick={ () => { this.props.setView(WELCOME); this.props.setHasError(false) } }>Reset View</Button>
            <Button type="destructive" onClick={ () => { store.dispatch({ type: RESET_APP }); this.props.setHasError(false) } }>Reset Everything</Button>
          </div>
        </div>
      )
  }
}

const mapStateToProps = state => ({
  theme: state.settings.theme,
  errorMessage: state.window.errorMessage,
  errorInfo: state.window.errorInfo
})

export default connect(mapStateToProps, { setHasError, setView })(CrashMessage)