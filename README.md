# Galactic Encounters
## A Star Wars App

### Server Setup

* `brew install yarn`
* `cd server`
* `yarn install`
* Start the server in watch mode: `yarn start`
* Watch the terminal to make sure the SWAPI data is fetched properly. This will actually take a little time (maybe 90 seconds or so). The terminal will let you know when the fetching is complete.
* To transpile the typescript files once using 'tsc': `yarn build`
* To transpile the typescript files once using 'ts-node': `yarn dev`


### Client Setup

* In a new terminal: `cd client`
* `yarn install`
* Start 'webpack-dev-server': `yarn start`
* New browser window will point to [http://localhost:8080](http://localhost:8080)
* Enjoy!


### Useful proxy API calls

* all data: [http://localhost:3300/api/all-data]()
* character list: [http://localhost:3300/api/character-options](http://localhost:3300/api/character-options)
* films example: [http://localhost:3300/api/encounters?id1=2&id2=3](http://localhost:3300/api/encounters?id1=2&id2=3)
* planet example: [http://localhost:3300/api/encounters?id1=8&id2=9](http://localhost:3300/api/encounters?id1=8&id2=9)
* starship example: [http://localhost:3300/api/encounters?id1=13&id2=14](http://localhost:3300/api/encounters?id1=13&id2=14)
* vehicle example: [http://localhost:3300/api/encounters?id1=10&id2=32](http://localhost:3300/api/encounters?id1=10&id2=3)
