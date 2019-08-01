import React, { Component } from "react"
import '../css/SearchView.scss'

import { submitSearch } from '../actions/searchActions'
import { loadDetailsFromFile, loadDetailsFromKey } from '../actions/detailsActions'
import { connect } from 'react-redux'
import SearchLoading from '../assets/search-loading.svg'
import PropTypes from 'prop-types'
import Button from "./Button";

class SearchView extends Component {

  render() {
    return (
      <div id='search-view'>
        <h1>Search</h1>
        <form onSubmit={ (e) => { e.preventDefault(); this.props.submitSearch(document.getElementById('search-box').value) } }><input className="text-box" type="text" name="search-box" id="search-box" placeholder="Search for keywords in titles, artists, descriptions, IDs..." /></form><Button type="primary" id="search-submit" onClick={ () => { this.props.submitSearch(document.getElementById('search-box').value) } }>{(this.props.loading ? <img style={ { width: '40px', height: '40px', display: 'block', marginTop: '-10px' } } src={ SearchLoading } alt="" /> : 'Search')}</Button>
        <h2>Results for: <span style={ { fontWeight: 400 } }>"{this.props.results.keywords}"</span></h2>
        <h2 style={ { display: 'inline-block', marginRight: '5px' } }>Library</h2><span>{this.props.results.library.length} result{(this.props.results.library.length !== 1 ? 's' : '')}</span>
        <div>{this.props.results.library.map((song, i) => {
            console.log(song)
          return (
            <div className="search-result" onClick={ () => { this.props.loadDetailsFromFile(song.file) } } key={ i }>
              <img src={ song.coverUrl } alt=""/>
              <div className="search-result-info">
                <b>{song._songName}</b><br/>
                {song._songAuthorName}
              </div>
            </div>
          )
        })}</div>
        <h2 style={ { display: 'inline-block', marginRight: '5px' } }>BeatSaver</h2><span>{this.props.results.beatSaver.length} result{(this.props.results.beatSaver.length !== 1 ? 's' : '')}</span>
        <div>{this.props.results.beatSaver.map((song, i) => {
          return (
            <div className="search-result" onClick={ () => { this.props.loadDetailsFromKey(song.key) } } key={ i }>
              <img src={ `https://beatsaver.com/${ song.coverURL }` } alt="" />
              <div className="search-result-info">
                <b>{song.metadata.songName}</b><br/>
                {song.metadata.songAuthorName}
              </div>
            </div>
          )
        })}</div>
      </div>
    )
  }
}

SearchView.propTypes = {
  results: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  submitSearch: PropTypes.func.isRequired,
  loadDetailsFromFile: PropTypes.func.isRequired,
  loadDetailsFromKey: PropTypes.func.isRequired
}

let mapStateToProps = state => ({
  results: state.search.searchResults,
  loading: state.loading
})

export default connect(mapStateToProps, { submitSearch, loadDetailsFromFile, loadDetailsFromKey })(SearchView)

//<div id="search-sources"><input type="checkbox" name="library-source-checkbox" id="library-source-checkbox" onChange={() => {}} defaultChecked/><label htmlFor="library-source-checkbox">Library</label><input type="checkbox" name="beatsaver-source-checkbox" id="beatsaver-source-checkbox" defaultChecked/><label htmlFor="beatsaver-source-checkbox">BeatSaver</label></div>