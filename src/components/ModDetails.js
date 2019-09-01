import React, { Component } from 'react'
import '../css/ModDetails.scss'

import { connect } from 'react-redux'

import { installMod, uninstallMod, activateMod, deactivateMod } from '../actions/modActions'
import { setView } from '../actions/viewActions'
import { displayWarning } from '../actions/warningActions'

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'

import Badge from './Badge'
import downloadIcon from '../assets/download-filled.png'
import deleteIcon from '../assets/delete-filled.png'
import activateIcon from '../assets/dark/activate.png'
import moreIcon from '../assets/more-filled.png'

import Remarkable from 'remarkable'
const md = new Remarkable()

const { clipboard } = window.require('electron')

const exitDetailsShortcut = function (e) { if(e.keyCode === 27) { this.props.setView(this.props.previousView) } }

const { ipcRenderer } = window.require('electron')

class ModDetails extends Component {

  constructor(props) {
    super(props)

    ipcRenderer.on('mod-installed', (_, event, message) => {
      this.setState({})
    })

    this.exitDetailsShortcut = exitDetailsShortcut.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keyup', this.exitDetailsShortcut)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.exitDetailsShortcut)
  }

  render() {
    if(this.props.loading) {
      return (
        <div id="mod-details" style={ { whiteSpace: 'pre-wrap' } }>
          Loading Mod Details...
        </div>
        )
    } else {
      if(!this.props.details || this.props.details.notFound) {
        return (
          <div id="mod-details">
            <div className="close-icon" title="Close" onClick={ () => { this.props.setView(this.props.previousView) } }></div>
            <h2>Mod Details Not Found</h2>
          </div>
        )
      }
      return (
        <div id="mod-details" style={ { whiteSpace: 'pre-wrap' } }>
          <div className="close-icon" title="Close" onClick={ () => { this.props.setView(this.props.previousView) } }></div>
          <h1 className="mod-title">{ this.props.details.name }</h1>
          <h3 className="mod-author">by { this.props.details.author.username }</h3>
          <Badge>{ this.props.details.category.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}) }</Badge>
          <Badge>Beat Saber v{ this.props.details.gameVersion }</Badge>
          { this.props.installedMods.some(mod => mod.id === this.props.details._id) ? <div className="mod-in-library">This mod is in your library.</div> : null }
          { this.props.details.name === 'BSIPA' ? <div className="mod-in-library">BSIPA is required to load mods and cannot be uninstalled or deactivated.</div> : null }
          { this.props.installedMods.some(mod => mod.id === this.props.details._id) && (this.props.installedMods.filter(m => m.name === this.props.details.name)[0].dependencyOf.some(dependent => this.props.installedMods.some(installedMod => installedMod.name === dependent))) ? <div className="mod-in-library">{ this.props.details.name } is required by { this.props.installedMods.filter(m => m.name === this.props.details.name)[0].dependencyOf.filter(dependent => this.props.installedMods.some(installedMod => installedMod.name === dependent)).join(', ') } and cannot be uninstalled or deactivated.</div> : null }
          <div className="action-buttons">
            {
              this.props.details.name !== 'BSIPA' ?
                this.props.installedMods.some(mod => mod.name === this.props.details.name) ?
                  (!this.props.installedMods.filter(m => m.name === this.props.details.name)[0].dependencyOf.some(dependent => this.props.installedMods.some(installedMod => installedMod.name === dependent))) ?
                  <span className="action-button uninstall-button" title="Unistall Mod" onClick={ () => { this.props.uninstallMod(this.props.details.name); this.setState({}) } }><img src={ deleteIcon } alt='' />UNINSTALL</span>
                  : null
                  : <span className="action-button install-button" title="Install Mod" onClick={ () => { this.props.installMod(this.props.details.name, this.props.details.version) } } ><span style={ { width: this.props.queueItems[this.props.queueItems.findIndex(mod => mod.hash === this.props.details._id)] === undefined ? '102%' : `${this.props.queueItems[this.props.queueItems.findIndex(mod => mod.hash === this.props.details._id)].progress + 5}%` } }></span><img src={ downloadIcon } alt='' />INSTALL</span>
              : null
            }
            {
              this.props.details.name !== 'BSIPA' ?
                this.props.installedMods.some(mod => mod.name === this.props.details.name) ?
                  (!this.props.installedMods.filter(m => m.name === this.props.details.name)[0].dependencyOf.some(dependent => this.props.installedMods.some(installedMod => installedMod.name === dependent))) ?
                    this.props.installedMods.filter(m => m.name === this.props.details.name)[0].active ?
                    <span className="action-button deactivate-button" title="Deactivate Mod" onClick={ () => { this.props.deactivateMod(this.props.details.name); this.setState({}) } }><img src={ activateIcon } alt='' />DEACTIVATE</span>
                  : <span className="action-button activate-button" title="Activate Mod" onClick={ () => { this.props.activateMod(this.props.details.name); this.setState({}) } } ><img src={ activateIcon } alt='' />ACTIVATE</span>
                  : null
                : null
              : null
            }
            <ContextMenuTrigger id={ this.props.details._id } holdToDisplay={ 0 }><span className="action-button more-button"><img src={ moreIcon } alt='' /></span></ContextMenuTrigger>
            <ContextMenu id={ this.props.details._id }>
              <MenuItem onClick={ (e) => {e.stopPropagation(); clipboard.writeText(`beatdrop://mods/details/${encodeURIComponent(this.props.details.name)}`); this.props.displayWarning({ timeout: 5000, color:'lightgreen', text: `Sharable Link for ${this.props.details.name} copied to clipboard!` })} }>Share</MenuItem>
            </ContextMenu>
          </div>
          <hr />
          <h2>Description: </h2>
          <p dangerouslySetInnerHTML={ { __html: md.render(this.props.details.description) } }></p>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  loading: state.loading,
  details: state.mods.modDetails,
  installedMods: state.mods.installedMods,
  queueItems: state.queue.items,
  previousView: state.view.previousView
})

export default connect(mapStateToProps, { setView, installMod, uninstallMod, activateMod, deactivateMod, displayWarning })(ModDetails)

/*
  { this.props.details.name !== 'BSIPA' ? <span className="action-button modpack-add-button" title="Add Mod to Mod Pack"><img src={ addIcon } alt='' />ADD TO MOD PACK</span> : null }
*/