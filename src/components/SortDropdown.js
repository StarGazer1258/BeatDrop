import React, { Component } from 'react';
import '../css/SortDropdown.css'

class SortDropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      seletedItem: {
        value: this.props.options[0].value,
        label: this.props.options[0].label
      }
    }

    this.openDropdown = this.openDropdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
  }

  componentDidMount() {
    document.body.addEventListener('click', this.closeDropdown)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.closeDropdown)
  }

  openDropdown(e) {
    this.setState({isOpen: true})
  }

  closeDropdown(e) {
    this.setState({isOpen: false})
  }

  render() {
    return (
      <div className="select sort-dropdown">
        <div className={"select-styled" + (this.state.isOpen ? ' active' : '')} onClick={this.openDropdown}>{this.state.seletedItem.label}</div>
        <ul className={"select-options" + (this.state.isOpen ? ' active' : '')} selected={this.state.seletedItem.value}>
          {this.props.options.map((option) => {
            return <li key={option.value} rel={option.value} onClick={() => {this.setState({seletedItem: option}); this.props.onChange(this.state.seletedItem); this.closeDropdown}}>{option.label}</li>
          })}
        </ul>
      </div>
    )
  }
}

export default SortDropdown