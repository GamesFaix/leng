# Leng



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
