# Tag Service
The Tag Service (TS) is a container tag solution, allowing for the remote administration of ad tags. It is implemented via the TS tag, a small block of markup trafficked as 3rd-party creative in DFP (or other ad server), which calls out to the Tag Service via a script tag, identifying a specific ad tag via an id parameter in the query string of the script tag's src attribute. 

## Installation
* `git clone` the repo.
* `npm install`.
* Edit the environment settings in the `app/config/env` directory. Once you do, be sure to add `/app/config/env/*` to `.gitignore` if you plan to submit pull requests.

## Requirements
* Node.js
* MongoDB

## Running the Service
* At the command line, run `node server.js`.
* In the browser, go to `http://localhost:9091`. 

## TODO:
* Flesh out this README to include implementation, architectural, API, and database documentation.
* Add install script for required MongoDB database.
* Add JSDoc support.
* Add tests.
* Add GruntFile.
