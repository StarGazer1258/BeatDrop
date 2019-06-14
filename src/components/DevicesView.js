import React, { Component } from 'react'
import '../css/DevicesView.scss'

import { connect } from 'react-redux'

import { selectDevice } from '../actions/deviceActions'
import { getDevices } from '../actions/adbActions'
import { setView } from '../actions/viewActions'

import { DEVICE_DETAILS } from '../views'

const { remote } = window.require('electron')
const path = remote.require('path')

class DevicesView extends Component {
    render() {
      getDevices();
        return (
          <div id="quest-view">
            <h1>Devices</h1>
            <table>
              <thead>
                <tr><th></th><th width={ 150 }>Device Name</th><th>Status</th><th>Storage</th></tr>
              </thead>
              <tbody>
                {
                  this.props.devices.map((device, i) => {
                    return (
                      <tr onClick={ () => { this.props.selectDevice(i); this.props.setView(DEVICE_DETAILS) } }>
                        <td><img src= { `file://${path.resolve(device.type.image)}` } alt={ device.type.deviceName }/></td>
                        <td>{ device.type.vendorName } { device.type.deviceName }</td>
                        <td>{ device.status }</td>
                        <td>{ device.capacity ? `${Math.trunc(device.storageUsed / device.capacity * 100)}% (${device.storageUsed / 1000}GB / ${device.capacity / 1000}GB)` : 'N/A' }</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        )
    }
}

const mapStateToProps = state => ({
  devices: state.devices.list
})

export default connect(mapStateToProps, { selectDevice, setView, getDevices })(DevicesView)