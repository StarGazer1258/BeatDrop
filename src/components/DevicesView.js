import React, { Component } from 'react'
import '../css/DevicesView.scss'

import { connect } from 'react-redux'

import { selectDevice } from '../actions/deviceActions'
import { getDevices } from '../actions/deviceActions'
import { setView } from '../actions/viewActions'

import { DEVICE_DETAILS } from '../views'

import * as DEVICE from '../constants/devices'
import * as STATUS from '../constants/device_statuses'

const { remote } = window.require('electron')
const path = remote.require('path')

let devices = [
  {
    type: DEVICE.OCULUS.QUEST,
    status: STATUS.CONNECTED,
    storageUsed: 15400,
    capacity: 32000
  },
  {
    type:  DEVICE.HTC.VIVE,
    status: STATUS.CONNECTED,
  },
  {
    type: DEVICE.HTC.VIVE_PRO,
    status: STATUS.OFFLINE
  },
  {
    type: DEVICE.OCULUS.RIFT,
    status: STATUS.OFFLINE
  },
  {
    type: DEVICE.OCULUS.RIFT_S,
    status: STATUS.OFFLINE
  },
  {
    type: DEVICE.PIMAX.EIGHT_K,
    status: STATUS.OFFLINE
  }
]

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
                  devices.map((device, i) => {
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

})

export default connect(mapStateToProps, { selectDevice, setView, getDevices })(DevicesView)