import React, { Component } from 'react'
import "../css/Toggle.scss"

class Toggle extends Component {

  constructor(props) {
    super(props)

    this.state = {
      toggled: this.props.toggled || false
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      toggled: props.toggled || false
    }
  }

  render() {
    return (
      <div className={ `toggle${this.props.toggled ? (this.props.toggled ? ' toggled' : '') : (this.state.toggled ? ' toggled' : '')}` } onClick={ (e) => { this.setState({ toggled: !this.state.toggled }); this.props.onToggle(e) } } >
        <div className="toggle-inner"></div>
      </div>
    )
  }
}

export default Toggle