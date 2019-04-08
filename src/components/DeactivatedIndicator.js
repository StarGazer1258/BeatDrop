import React, { Component } from 'react'
import '../css/DeactivatedIndicator.scss'

import DeactivatedIcon from '../assets/deactivated.png'

class DeactivatedIndicator extends Component {
    render() {
        return <span className="deactivated-indicator"><img src={ DeactivatedIcon } alt=""/>Deactivated</span>
    }
}

export default DeactivatedIndicator