import React, { Component } from 'react'
import '../css/DonateView.scss'

import Heart from '../assets/heart-100.png'
import Button from './Button';

class DonateView extends Component {

  render() {
    return (
      <div id="donate-view">
        <img src={ Heart } alt="Heart"/>
        <h1>Donate to BeatDrop!</h1>
        <p>We work hard to make BeatDrop the best it can be, but we don't always have the time and money to do so.
          If you could chip in just a little bit, it's makes working on BeatDrop all that more worthwhile!</p>
        <b>Recommended Amounts:</b>
        <Button type="primary" onClick={ () => { window.require('electron').shell.openExternal('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Y346GFENN5WUC') } }>Donate $10 Once</Button><div className="flex-br"></div>
        <Button type="destructive" onClick={ () => { window.require('electron').shell.openExternal('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Z2UUWMFZXLYXN') } }>Donate $5 Monthly</Button><div className="flex-br"></div>
        <Button onClick={ () => { window.require('electron').shell.openExternal('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=U2JJM42HAF7PN') } }>Custom Donation</Button><div className="flex-br"></div>
      </div>
    )
  }

}

export default DonateView