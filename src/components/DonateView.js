import React, { Component } from 'react'
import '../css/DonateView.scss'

import Heart from '../assets/heart-100.png'
import PatreonButton from '../assets/become-a-patron-button.png'

class DonateView extends Component {

  render() {
    return (
      <div id="donate-view">
        <img className="heart" src={ Heart } alt="Heart"/>
        <h1>Donate to BeatDrop!</h1>
        <p>I work hard to make BeatDrop the best it can be, but I don't always have the time and money to do so.
          If you could chip in just a little bit, it's makes working on BeatDrop all that more worthwhile!</p>
          <img className="patreon-button"  src={ PatreonButton } alt="Become a Patron" onClick={ () => { window.require('electron').shell.openExternal('https://www.patreon.com/bePatron?u=18487054') } }/>
      </div>
    )
  }

}

export default DonateView