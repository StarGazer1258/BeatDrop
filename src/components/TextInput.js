import React, { Component } from 'react';
import '../css/SearchBox.css'

class SearchBox extends Component {
  render() {
    return (
      <input type="text" name="search" className="search-box" placeholder="Search" />
    )
  }
}

export default SearchBox