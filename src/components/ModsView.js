import React, { Component, Fragment } from 'react'
import '../css/ModsView.scss'

import { connect } from 'react-redux'
import { BEATMODS_BASE_URL } from '../constants/urls'
import { BEATMODS, LIBRARY } from '../constants/resources';
import { makeUrl } from '../utilities'

import { loadModDetails, installMod, uninstallMod, fetchModCategory, deactivateMod, activateMod } from '../actions/modActions'
import { displayWarning } from '../actions/warningActions'
import { ContextMenuTrigger, MenuItem, ContextMenu } from 'react-contextmenu';

import LibraryIndicator from './LibraryIndicator';
import DeactivatedIndicator from './DeactivatedIndicator';
import SortBar from './SortBar';

const { clipboard, shell } = window.require('electron')

class ModsView extends Component {
  Catergories(props) {
    return (
      <ul className="categories-list">
        { this.state.categories ?
          this.state.categories.map((category) => {
            return (
              <li className="category" onClick={ () => { props.fetchModCategory(category.toLowerCase()); this.setState({ category }) } }>
                <div className="category-name">{category}</div>
              </li>
            )
          })
        :
         null }
      </ul>
    )
  }

  SubCategory() {
    switch(this.props.resource) {
      case BEATMODS.NEW_MODS:
        return <h2>All Mods</h2>
      case BEATMODS.RECOMMENDED_MODS:
        return <h2>Recommended Mods</h2>
      case BEATMODS.MOD_CATEGORIES:
        return <h2>{ this.state.category }</h2>
      case BEATMODS.MOD_CATEGORY_SELECT:
        return <h2>Categories</h2>
      case LIBRARY.MODS.ALL:
        return <h2>Library</h2>
      default:
        return null
    }
  }

  componentDidMount() {
    let categories = []
    let prevCat = ''
    fetch(makeUrl(BEATMODS_BASE_URL, '/api/v1/mod?status=approved'))
      .then(res => res.json())
      .then(beatModsResponse => {
        for(let i = 0; i < beatModsResponse.length; i++) {
          if(beatModsResponse[i].category !== prevCat) {
            prevCat = beatModsResponse[i].category
            categories.push(beatModsResponse[i].category)
          }
        }
        this.setState({ categories })
      })
  }

  constructor(props) {
    super(props)

    this.state = {
      category: ''
    }

    this.Catergories = this.Catergories.bind(this)
    this.SubCategory = this.SubCategory.bind(this)
  }

  render() {
    if(this.props.loading) {
      return (
        <div id="mod-marketplace">
        <h1>Mods</h1>
        <h2>Loading...</h2>
          <div className="mod-list">
            { Array(50).fill(0).map((v, i) => {
                return (
                  <div className='mod-marketplace-tile loading' key={ i }>
                    <div className="mod-image loading"></div>
                    <div className="mod-info">
                      <span className="first-row"><span className="mod-title"></span> <span className="mod-version"></span></span>
                      <div className="mod-author"></div>
                      <div className="mod-category"></div>
                    </div>
                  </div>
                )
            }) }
          </div>
        </div>
      )
    } else {
      return (
        <>
        <SortBar />
        <div id="mod-marketplace">
          <h1>Mods</h1>
          <this.SubCategory sub={ this.props.resource } category={ this.state.category } />
            { this.props.resource !== BEATMODS.MOD_CATEGORY_SELECT ?
              <div className="mod-list">
                { this.props.mods.mods.map(mod => {
                    let category = (mod.category || 'Uncategorized')
                    return (
                      <Fragment key={ mod._id }>
                        <ContextMenuTrigger id={ mod._id }>
                        <div className='mod-marketplace-tile' onClick={ () => { this.props.loadModDetails(mod._id) } }>
                          { this.props.mods.installedMods.some(m => m.name === mod.name) ? <LibraryIndicator /> : null }
                          { this.props.mods.installedMods.some(m => m.name === mod.name) ? (!this.props.mods.installedMods.filter(m => m.name === mod.name)[0].active ? <DeactivatedIndicator /> : null) : null }
                          <div className={ `mod-image${ category === 'libraries' ? ' library' : '' }${ category === 'tweaks / tools' ? ' tweak' : '' }${ category === 'cosmetic' ? ' cosmetic' : '' }${ category === 'practice / training' ? ' training' : '' }${ category === 'multiplayer' ? ' multiplayer' : '' }${ category === 'gameplay' ? ' gameplay' : '' }${ category === 'streaming tools' ? ' stream' : '' }${ category === 'lighting changes' ? ' lighting' : '' }${ category === 'text changes' ? ' text' : '' }${ category === 'ui enhancements' ? ' text' : '' }` }></div>
                          <div className="mod-info">
                            <span className="first-row"><span className="mod-title">{ mod.name }</span> <span className="mod-version">v{ mod.version } (for v{ mod.gameVersion })</span></span>
                            <div className="mod-author">{ mod.name === 'YUR Fit Calorie Tracker' ? <>Join our discord: <a href='https://yur.chat' onClick={ (e) => { e.preventDefault(); e.stopPropagation(); shell.openExternal('https://yur.chat') } }>https://yur.chat</a></> : `by ${ mod.author.username || 'Unknown' }` }</div>
                            <div className="mod-category">{ category.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}).replace('Ui', 'UI') }</div>
                          </div>
                        </div>
                        </ContextMenuTrigger>
                        <ContextMenu id={ mod._id }>
                          {
                            mod.name !== 'BSIPA' ?
                              this.props.mods.installedMods.some(m => m.name === mod.name) ?
                                ((!this.props.mods.installedMods.filter(m => m.name === mod.name)[0].dependencyOf.some(dependent => this.props.mods.installedMods.some(installedMod => installedMod.name === dependent))) ?
                                  <MenuItem onClick={ (e) => { e.stopPropagation(); this.props.uninstallMod(mod.name) } }>Uninstall { mod.name }</MenuItem>
                                : null)
                                : <MenuItem onClick={ (e) => { e.stopPropagation(); this.props.installMod(mod.name, mod.version) } }>Install { mod.name }</MenuItem>
                            : null
                          }
                          {
                            (this.props.mods.installedMods.some(m => m.id === mod._id) && mod.name !== 'BSIPA') ?
                              (!this.props.mods.installedMods.filter(m => m.name === mod.name)[0].dependencyOf
                                .some(dependent => this.props.mods.installedMods
                                    .some(installedMod => installedMod.name === dependent))) ?
                                (this.props.mods.installedMods.filter(m => m.name === mod.name)[0].active ?
                                  <MenuItem onClick={ (e) => { e.stopPropagation(); this.props.deactivateMod(mod.name) } }>Deactivate</MenuItem>
                                : <MenuItem onClick={ (e) => { e.stopPropagation(); this.props.activateMod(mod.name) } }>Activate</MenuItem> )
                              : null
                            : null
                          }
                           <MenuItem onClick={ (e) => {e.stopPropagation(); clipboard.writeText(`beatdrop://mods/details/${encodeURIComponent(mod.name)}`); this.props.displayWarning({ timeout: 5000, color:'lightgreen', text: `Sharable Link for ${mod.name} copied to clipboard!` })} }>Share</MenuItem>
                        </ContextMenu>
                      </Fragment>
                    )
                }) }
              </div> : <this.Catergories fetchModCategory={ this.props.fetchModCategory } />
            }
        </div>
        </>
      )
    }
  }
}

const mapStateToProps = state => ({
  loading: state.loading,
  mods: state.mods,
  resource: state.resource
})

export default connect(mapStateToProps, { loadModDetails, installMod, uninstallMod, fetchModCategory, deactivateMod, activateMod, displayWarning })(ModsView)

/*
{ mod.name !== 'BSIPA' ? <MenuItem>Add to Mod Pack</MenuItem> : null }
*/