import React, { Component, Fragment } from 'react'
import '../css/ModsListView.scss'

import Checkbox from './Checkbox'

import { installMod, uninstallMod, loadModDetails } from '../actions/modActions'

import { connect } from 'react-redux'

class ModsListView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectAll: false,
      select: new Array(this.props.mods.length).fill(false),
      sortBy: 'name',
      sortDirection: 0
    }
  }

  render() {
      return (
        <div id="mod-list">
          <h1>Mods</h1>
          <table>
            <thead>
              <tr>
                <th><span></span></th>
                <th onClick={ () => { this.setState({ sortBy: 'name', sortDirection: this.state.sortBy === 'name' ? !this.state.sortDirection : 0 }) } }><span>Mod Name{ this.state.sortBy === 'name' ? this.state.sortDirection ? '▼' : '▲' : null }</span></th>
                <th width={ 80 } onClick={ () => { this.setState({ sortBy: 'version', sortDirection: this.state.sortBy === 'version' ? !this.state.sortDirection : 0 }) } }><span>Version{ this.state.sortBy === 'version' ? this.state.sortDirection ? '▼' : '▲' : null }</span></th>
                <th onClick={ () => { this.setState({ sortBy: 'author', sortDirection: this.state.sortBy === 'author' ? !this.state.sortDirection : 0 }) } }><span>Author{ this.state.sortBy === 'author' ? this.state.sortDirection ? '▼' : '▲' : null }</span></th>
                <th onClick={ () => { this.setState({ sortBy: 'category', sortDirection: this.state.sortBy === 'category' ? !this.state.sortDirection : 0 }) } }><span>Category{ this.state.sortBy === 'category' ? this.state.sortDirection ? '▼' : '▲' : null }</span></th>
                <th onClick={ () => { this.setState({ sortBy: 'uploadDate', sortDirection: this.state.sortBy === 'uploadDate' ? !this.state.sortDirection : 0 }) } }><span>Upload Date{ this.state.sortBy === 'uploadDate' ? this.state.sortDirection ? '▼' : '▲' : null }</span></th>
              </tr>
            </thead>
            <tbody>
              
              { 
                this.props.mods.mods
                  .sort((a, b) => {
                    switch(this.state.sortBy) {
                      case 'name':
                        if(a.name < b.name) return this.state.sortDirection * 2 - 1
                        if(a.name > b.name) return -(this.state.sortDirection * 2 - 1)
                        return 0
                      case 'version':
                        if(a.version < b.version) return this.state.sortDirection * 2 - 1
                        if(a.version > b.version) return -(this.state.sortDirection * 2 - 1)
                      case 'author':
                        if(a.author.username < b.author.username) return this.state.sortDirection * 2 - 1
                        if(a.author.username > b.author.username) return -(this.state.sortDirection * 2 - 1)
                        return 0
                      case 'category':
                        if(a.category < b.category) return this.state.sortDirection * 2 - 1
                        if(a.category > b.category) return -(this.state.sortDirection * 2 - 1)
                        return 0
                      case 'uploadDate':
                        if(a.uploadDate < b.uploadDate) return this.state.sortDirection * 2 - 1
                        if(a.uploadDate > b.uploadDate) return -(this.state.sortDirection * 2 - 1)
                        return 0
                      default:
                        return 0
                    }
                  })
                  .map((mod, i) => {
                    return (
                      <tr key={ `${mod.name}@${mod.version}${this.props.mods.pendingInstall.some(m => m.name === mod.name) ? '.installed' : ''}` }>
                        <td width={ 20 }>
                          {
                            this.props.mods.pendingInstall.some(m => m === mod.name) ?
                              <img src={ require('../assets/loading.svg') } alt="Installing..." style={ { height: "22px" } }/>
                            :
                          <Checkbox
                            checked={ this.props.mods.installedMods.some(m => m.name === mod.name) }
                            onChange={ () => {
                              if(this.props.mods.installedMods.some(m => m.name === mod.name)) { 
                                this.props.uninstallMod(mod.name)
                              } else {
                                this.props.installMod(mod.name, mod.version)
                              }
                            } }
                            disabled={
                              this.props.mods.installedMods.some(m => m.name === mod.name) ?
                                this.props.mods.installedMods.filter(m => m.name === mod.name)[0].dependencyOf.some(dependent => this.props.mods.installedMods.some(installedMod => installedMod.name === dependent))
                              : false
                            }
                          />
                        }
                        </td>
                        <td onClick={ () => { this.props.loadModDetails(mod._id) } }>{ mod.name }</td>
                        <td>{ mod.version }</td>
                        <td>{ mod.author.username }</td>
                        <td>{ mod.category }</td>
                        <td>{ `${new Date(mod.uploadDate).toLocaleDateString() }, ${ new Date(mod.uploadDate).toLocaleTimeString() }` }</td>
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
  mods: state.mods
})

export default connect(mapStateToProps, { installMod, uninstallMod, loadModDetails })(ModsListView)