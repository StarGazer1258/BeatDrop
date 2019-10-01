import React, { Component } from 'react'
import '../css/DownloadsView.scss'

import { connect } from 'react-redux'

import Button from './Button'
import ProgressBar from './ProgressBar'
import { updateMod, ignoreModUpdate } from '../actions/modActions'
import { clearQueue } from '../actions/queueActions'

class DownloadsView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      updates: []
    }
  }

  componentDidMount() {
    let updates = []
    for(let i = 0; i < this.props.installedMods.length; i++) {
      if(this.props.installedMods[i].updateAvailable) updates.push(this.props.installedMods[i])
    }
    this.setState({ updates })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.updates !== this.props.updates) {
      let updates = []
      for(let i = 0; i < this.props.installedMods.length; i++) {
        if(this.props.installedMods[i].updateAvailable) updates.push(this.props.installedMods[i])
      }
      this.setState({ updates })
    }
  }

  render() {
      return (
        <div id="downloads-view" className="view">
          { 
            this.props.updates > 0 ? 
              <>
                <div className="updates-title"><h1>{ this.props.updates } New Updates</h1><Button type="primary" onClick={ () => { for(let i = 0; i < this.state.updates.length; i++) { this.props.updateMod(this.state.updates[i].name) } } }>Update All</Button></div>
                <ul className="updates-list">
                  {
                    this.state.updates.map((mod, i) => {
                      if(mod.ignoreUpdate) return null
                      return <li key={ i }>{ mod.name } { mod.version } ➜ { mod.latestVersion } <div className="right"><Button type="primary" onClick={ () => { this.props.updateMod(mod.name) } }>Update</Button><Button onClick={ () => { this.props.ignoreModUpdate(mod.name) } }>Ignore</Button></div></li>
                    })
                  }
                </ul>
              </>
              : null
            }
            <div className="updates-title"><h1>Downloads</h1><Button type="destructive" onClick={ () => { this.props.clearQueue() } }>Clear</Button></div>
            <ul className="downloads-list">
              {
                this.props.items.length > 0 ?
                  this.props.items.map((item, i) => {
                    return <li key={ i }><img src={ item.image } alt={ item.title } /><div className="download-info"><div className="title">{ item.title }</div><div className="author">{ item.author }</div><span className="download-progress"><ProgressBar progress={ item.progress } /></span><span>{ item.progress < 100 ? item.progress + '%' : 'Done' }</span></div></li>
                  })
                : <li className="no-downloads">No Recent Downloads</li>
              }
            </ul>
        </div>
      )
  }
}

const mapStateToProps = state => ({
  installedMods: state.mods.installedMods,
  updates: state.mods.updates,
  items: state.queue.items
})

export default connect(mapStateToProps, { updateMod, ignoreModUpdate, clearQueue })(DownloadsView)