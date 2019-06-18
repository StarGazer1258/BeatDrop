import React, { Component } from 'react'
import '../css/DeviceDetails.scss'

import ProgressBar from './ProgressBar'

import deleteIcon from '../assets/delete-filled.png'
import syncIcon from '../assets/sync-f.png'
import { syncDevice } from '../actions/adbActions'
//import moreIcon from '../assets/more-filled.png'

import { connect } from 'react-redux'

import { setView } from '../actions/viewActions'
import Toggle from './Toggle';

import * as DEVICE from '../constants/devices'
//import * as STATUS from '../constants/device_statuses'

const { remote } = window.require('electron')
const path = remote.require('path')

class DeviceDetails extends Component {
  render() {
      return (
        <div id="device-details">
          <div className="close-icon" title="Close" onClick={ () => {this.props.setView(this.props.previousView)} }></div>
          <img className="device-image" src={ `file://${path.resolve(this.props.device.type.image)}` } alt=""/>
          <div>
            <h1>{ `${this.props.device.type.vendorName} ${this.props.device.type.deviceName}` }</h1>
            <h3><span className={ `status-indicator STATUS-${this.props.device.status}` }></span>{ this.props.device.status }</h3>
            <div className="action-buttons">
            { this.props.device.type.identifier === DEVICE.OCULUS.QUEST.identifier ? <span className="action-button" title="Add Songs" onClick={ () => { this.props.syncDevice(this.props.device.deviceId) } }><img src={ syncIcon } alt='' />SYNC SONGS</span> : null }
              <span className="action-button" onClick={ () => {} }><img src={ deleteIcon } alt='' />REMOVE DEVICE</span>
            </div>
            <h5>Last sync: { this.props.device.lastSync } </h5>
            <h4>Storage</h4>
            { this.props.device.capacity ? <ProgressBar progress={ this.props.device.storageUsed / this.props.device.capacity * 100 } /> : null }
            <div>{ this.props.device.capacity ? `${Math.trunc(this.props.device.storageUsed / this.props.device.capacity * 100)}% (${this.props.device.storageUsed / 1000}GB / ${this.props.device.capacity / 1000}GB)` : 'N/A' }</div>
            <h4>Settings</h4>
            <Toggle toggled={ true } />Show in Devices<br />
            { this.props.device.type.identifier === DEVICE.OCULUS.QUEST.identifier ? <><Toggle />Sync Songs Automatically</> : null }
          </div>
        </div>
      )
  }
}

const mapStateToProps = state => ({
  deviceId: state.devices.selectedDevice,
  device: state.devices.list[state.devices.selectedDevice],
  previousView: state.view.previousView
})

export default connect(mapStateToProps, { setView, syncDevice })(DeviceDetails)