# Leng

Leng is a desktop app for keeping track of your Magic: the Gathering collection.

Leng has a card-entry form that uses auto-complete fields to only allow valid selections, and rot require you to type full card or set names in most cases. If you can type reasonably well, this can be a lot faster and less error prone than other alternatives.

Compared to a basic spreadsheet or file, it can autocomplete card names, and prevent errors like entering a set that a card wasn't printed in.

It also avoids the pitfalls of most mobile scanning apps:

* Holding your phone for a long time
* Killing your phone battery
* Slow image-recognition algorithms
* Glare/lighting problems
* Misidentification of set symbols, which requires lots of manual fiddling
* No shortcuts for entering multiple similar cards, like alternate arts

## Tech stack

* TypeScript
* React
* Redux
* Electron
* Material UI
* Sass

## Local dev setup

1. Install dependencies with

    `npm ci`

2. Build and start app
    * `npm start` will build and start the app
    * `npm run watch` will build the app and rebuild when any changes are made, but will not start the Electron host. This is useful when developing any changes that are not part of the Electron configuration.
    * `npm run serve` will start the Electron host, but requires that it has already been built.
    * For most development, running `watch` and `serve` in different terminal windows is ideal for fast feedback.

3. Adjust settings
    * When the app starts, click the settings (gear) button.
    * Set the data path to something like `C:\users\your.name\leng`.
    * This is where any data files are saved, including your collection and cached data from Scryfall.
