import React, { Component } from 'react'
import '../css/Checkbox.scss'

class Checkbox extends Component {
    render() {
        return <div className={ `checkbox${ this.props.checked ? ' checked' : '' }${ this.props.indeterminate ? ' indeterminate' : '' }${ this.props.disabled ? ' disabled' : '' }` } onClick={ (e) => { e.preventDefault(); e.stopPropagation(); if(!this.props.disabled) this.props.onChange() } }></div>
    }
}

export default Checkbox