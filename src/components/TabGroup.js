import React, { Component } from 'react';
import '../css/TabGroup.scss'

class TabGroup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      key: props.k
    }
  }

  componentWillReceiveProps(props) {
    if(props.k !== this.state.k) {
      this.setState({
        k: props.k
      })
    }
  }

  render() {
    return <div className='tab-group'>{this.props.label && <span>{this.props.label}</span>}{this.props.children}</div>
  }
}

export default TabGroup