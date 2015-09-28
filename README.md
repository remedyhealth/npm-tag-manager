# npm-tag-server
This module encapsulates a container tag solution, allowing for the remote administration of ad tags. It is implemented via the TS tag, a small block of markup trafficked as 3rd-party creative in DFP (or other ad server), which calls out to the Tag Service via a script tag, identifying a specific ad tag via an id parameter in the query string of the script tag's src attribute. 

## Requirements
* Node.js
* MongoDB

## Installation
**Recommended**
* Include the module as a dependency in your package.json file: 

    `"npm-contextualizer": "git+https://github.com/HoraceShmorace/npm-tag-manager.git#[insert version here]"`.

**Manual**
* `git clone` the repo wherever you want it to live.
* `npm install`.

## Configuration
* Copy the example config in the `app/config/config.example.js` directory into your app. You'll need to require this file in your app, and pass it to the npm-contextualizer module ([see Configuration Options below](#configuration-options)).

## Running the Service
* At the command line, run `node server.js`.
* In the browser, go to `http://localhost:9091`. 

## TODO:
* Flesh out this README to include implementation, architectural, API, and database documentation.
* Add install script for required MongoDB database.
* Add JSDoc support.
* Add tests.
* Add GruntFile.
