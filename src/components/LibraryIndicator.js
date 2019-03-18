import React, { Component } from 'react'
import '../css/LibraryIndicator.scss'

import LibraryBlue from '../assets/library-blue.png'

class LibraryIndicator extends Component {
    render() {
        return <span className="library-indicator"><img src={ LibraryBlue } alt=""/>In Library</span>
    }
}

export default LibraryIndicator