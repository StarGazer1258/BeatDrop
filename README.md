# BeatDrop
![GitHub package.json version](https://img.shields.io/github/package-json/v/StarGazer1258/BeatDrop.svg) ![GitHub All Releases](https://img.shields.io/github/downloads/StarGazer1258/BeatDrop/total.svg) ![GitHub Releases](https://img.shields.io/github/downloads/StarGazer1258/BeatDrop/latest/total.svg) [![Build Status](https://travis-ci.org/StarGazer1258/BeatDrop.svg?branch=master)](https://travis-ci.org/StarGazer1258/BeatDrop)

![BeatSaver Songs](https://img.shields.io/badge/dynamic/json.svg?color=brightgreen&label=BeatSaver&query=totalDocs&suffix=%20songs&url=https%3A%2F%2Fbeatsaver.com%2Fapi%2Fmaps%2Flatest) ![BeatMods Mods](https://img.shields.io/badge/dynamic/json.svg?color=success&label=BeatMods&query=length&suffix=%20Mods&url=https%3A%2F%2Fbeatmods.com%2Fapi%2Fv1%2Fmod%3Fstatus%3Dapproved) 

The ultimate content-manager for Beat Saber. The best way to download and manage mods, songs, and more for the VR game Beat Saber.

## How to get BeatDrop
1. Go to [Releases](https://github.com/StarGazer1258/BeatDrop/releases)
2. Download the latest Release
3. Run ``beatdrop-setup-x.x.x.exe``

### For more instructions visit:
https://bsaber.com/bdrop-tutorial/

### Linux Installation (Early Alpha)
- Clean install of beatsaber through steam
- Run BS once
- Run beatdrop, install mods as usual

TODO: Update wine registry to load IPA winhttp.dll before built-in
- Edit SteamLibrary/steamapps/compatdata/620980/pfx/user.reg and add at the end

	[Software\\Wine\\DllOverrides]
	"winhttp"="native,builtin"
	
TODO: Run IPA.exe to patch the game
* This requires a wine installation with .net 4.6.2
  * https://appdb.winehq.org/objectManager.php?sClass=version&iId=34702
  * Recommend installation through winetricks, download the latest version (i.e don't use the outdated version from your package manager)
  
	wine IPA.exe
	
Assuming it worked you should have 'winhttp.dll' in the beatsaber directory.

From then on just run beatdrop when needed to download new stuff and enjoy