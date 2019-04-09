import React, { Component } from 'react'
import '../css/DonateView.scss'

import Heart from '../assets/heart-100.png'
import PatreonButton from '../assets/become-a-patron-button.png'
import BeatModsButton from '../assets/beatmods-button.png'
import BSMGButton from '../assets/bsmg-button.png'
import BeastSaberButton from '../assets/beastsaber-button.png'

class DonateView extends Component {

  render() {
    return (
      <div id="donate-view">
        <img className="heart" src={ Heart } alt="Heart"/>
        <h1>Share the love!</h1>
        <p>I work hard to make BeatDrop the best it can be, but I don't always have the time and money to do so.
          If you could chip in just a little bit, it's makes working on BeatDrop all that more worthwhile!</p>
          <img className="patreon-button"  src={ PatreonButton } alt="Become a Patron" onClick={ () => { window.require('electron').shell.openExternal('https://www.patreon.com/bePatron?u=18487054') } }/>
        <p><h3>Help keep servers alive and support modders and other community members by donating at the links below:</h3></p>
        <img className="patreon-button"  src={ BeatModsButton } alt="Donate to BeatMods" onClick={ () => { window.require('electron').shell.openExternal('https://bs.assistant.moe/Donate/') } }/>
        <img className="patreon-button"  src={ BSMGButton } alt="Donate to BSMG" onClick={ () => { window.require('electron').shell.openExternal('https://wiki.assistant.moe/about') } }/>
        <img className="patreon-button"  src={ BeastSaberButton } alt="Donate to BeastSaber" onClick={ () => { window.require('electron').shell.openExternal('https://www.patreon.com/beastsaber') } }/>
        
      </div>
    )
  }

}

export default DonateView