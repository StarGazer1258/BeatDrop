import React, { Component } from "react"
import '../css/SearchView.css'

import { submitSearch } from '../actions/searchActions'
import { loadDetails } from '../actions/detailsActions'
import { connect } from 'react-redux'
import SearchLoading from '../assets/search-loading.svg'
import PropTypes from 'prop-types'
import Button from "./Button";

class SearchView extends Component {

  render() {
    return (
      <div id='search-view'>
        <h1>Search</h1>
        <form onSubmit={(e) => { e.preventDefault(); this.props.submitSearch(document.getElementById('search-box').value) }}><input className="text-box" type="text" name="search-box" id="search-box" placeholder="Search for keywords in titles, artists, descriptions, IDs..." /></form><Button type="primary" id="search-submit" onClick={() => { this.props.submitSearch(document.getElementById('search-box').value) }}>{(this.props.loading ? <img style={{width: '40px', height: '40px', display: 'block', marginTop: '-10px'}} src={SearchLoading} alt="" /> : 'Search')}</Button>
        <h2>Results for: <span style={{fontWeight: 400}}>"{this.props.results.keywords}"</span></h2>
        <h2 style={{display: 'inline-block', marginRight: '5px'}}>Library</h2><span>{this.props.results.library.length} result{(this.props.results.library.length !== 1 ? 's' : '')}</span>
        <div>{this.props.results.library.map((song, i) => {
          return (
            <div className="search-result" onClick={() => { this.props.loadDetails(song.file) }} key={i}>
              <img src={song.coverUrl} alt=""/>
              <div className="search-result-info">
                <b>{song.songName}</b><br/>
                {song.authorName}
              </div>
            </div>
          )
        })}</div>
        <h2 style={{display: 'inline-block', marginRight: '5px'}}>BeatSaver</h2><span>{this.props.results.beatSaver.total} result{(this.props.results.beatSaver.total !== 1 ? 's' : '')}</span>
        <div>{this.props.results.beatSaver.songs.map((song, i) => {
          return (
            <div className="search-result" onClick={() => { this.props.loadDetails(song.key) }} key={i}>
              <img src={song.coverUrl} alt="" />
              <div className="search-result-info">
                <b>{song.songName}</b><br/>
                {song.authorName}
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
  loadDetails: PropTypes.func.isRequired
}

let mapStateToProps = state => ({
  results: state.search.searchResults,
  loading: state.loading
})

export default connect(mapStateToProps, { submitSearch, loadDetails })(SearchView)

//<div id="search-sources"><input type="checkbox" name="library-source-checkbox" id="library-source-checkbox" onChange={() => {}} defaultChecked/><label htmlFor="library-source-checkbox">Library</label><input type="checkbox" name="beatsaver-source-checkbox" id="beatsaver-source-checkbox" defaultChecked/><label htmlFor="beatsaver-source-checkbox">BeatSaver</label></div>