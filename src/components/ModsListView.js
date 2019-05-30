import React, { Component } from 'react'
import '../css/ModsListView.scss'

import Checkbox from './Checkbox'

import { installMod, uninstallMod, loadModDetails } from '../actions/modActions'

import { BEATMODS, LIBRARY } from '../constants/resources';

import Loader from '../assets/loading-dots2.png'

import { connect } from 'react-redux'
import SortBar from './SortBar';

const { shell } = window.require('electron')

class ModsListView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectAll: false,
      select: new Array(this.props.mods.length).fill(false),
      sortBy: 'name',
      sortDirection: 0
    }

    this.SubCategory = this.SubCategory.bind(this)
  }

  SubCategory() {
    switch(this.props.resource) {
      case BEATMODS.NEW_MODS:
        return <h1>Approved Mods</h1>
      case BEATMODS.RECOMMENDED_MODS:
        return <h1>Recommended Mods</h1>
      case BEATMODS.MOD_CATEGORIES:
        return <h1>{ this.state.category }</h1>
      case BEATMODS.MOD_CATEGORY_SELECT:
        return <h1>Categories</h1>
      case LIBRARY.MODS.ALL:
        return <h1>Library Mods</h1>
      case LIBRARY.MODS.ACTIVATED:
        return <h1>Activated Mods</h1>
      default:
        return null
    }
  }

  render() {
      return (
        <div id="mod-list">
          <SortBar />
          <this.SubCategory />
          {this.props.loading ?
            <img style={ { width: '200px', marginLeft: 'calc(50% - 100px)' } } src={ Loader } alt="Loading..."/>
          :
          <table>
            <thead>
              <tr>
                <th><span>&nbsp;</span></th>
                <th onClick={ () => { this.setState({ sortBy: 'name', sortDirection: this.state.sortBy === 'name' ? !this.state.sortDirection : 0 }) } }><span>Mod Name{ this.state.sortBy === 'name' ? this.state.sortDirection ? '▼' : '▲' : null }</span></th>
                <th width={ 80 } onClick={ () => { this.setState({ sortBy: 'version', sortDirection: this.state.sortBy === 'version' ? !this.state.sortDirection : 0 }) } }><span>Version{ this.state.sortBy === 'version' ? this.state.sortDirection ? '▼' : '▲' : null }</span></th>
                <th width={ 80 } onClick={ () => { this.setState({ sortBy: 'gameVersion', sortDirection: this.state.sortBy === 'gameVersion' ? !this.state.sortDirection : 0 }) } }><span>Game V.{ this.state.sortBy === 'gameVersion' ? this.state.sortDirection ? '▼' : '▲' : null }</span></th>
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
                        return 0
                      case 'gameVersion':
                        if(a.gameVersion < b.gameVersion) return this.state.sortDirection * 2 - 1
                        if(a.gameVersion > b.gameVersion) return -(this.state.sortDirection * 2 - 1)
                        return 0
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
                  .map(mod => {
                    return (
                      <tr key={ `${mod.name}@${mod.version}${this.props.mods.pendingInstall.some(m => m.name === mod.name) ? '.installed' : ''}` }  onClick={ () => { this.props.loadModDetails(mod._id) } }>
                        <td
                          width={ 20 }
                          title={
                            this.props.mods.installedMods.some(m => m.name === mod.name) ?
                              this.props.mods.installedMods.filter(m => m.name === mod.name)[0].dependencyOf.some(dependent => this.props.mods.installedMods.some(installedMod => installedMod.name === dependent)) ? `${mod.name} cannot be uninstalled: mod is a dependency of another installed mod.` : `Uninstall ${mod.name}`
                            : `Install ${mod.name}` }
                        >
                          {
                            this.props.mods.pendingInstall.some(m => m === mod.name) ?
                              <div className="installing-mod" />
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
                        <td>{ mod.name }</td>
                        <td>{ mod.version }</td>
                        <td>{ mod.gameVersion }</td>
                        <td>{ mod.name === 'YUR Fit Calorie Tracker' ? <a href='https://yur.chat' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); shell.openExternal('https://yur.chat') } }>https://yur.chat</a> : (mod.author.username || 'Unknown') }</td>
                        <td>{ mod.category }</td>
                        <td>{ `${new Date(mod.uploadDate).toLocaleDateString() }, ${ new Date(mod.uploadDate).toLocaleTimeString() }` }</td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>}
        </div>
        
      )
  }
}

const mapStateToProps = state => ({
  mods: state.mods,
  resource: state.resource,
  loading: state.loading
})

export default connect(mapStateToProps, { installMod, uninstallMod, loadModDetails })(ModsListView)