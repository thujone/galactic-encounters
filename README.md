# Galactic Encounters
## A Star Wars App

![Galactic Encounters](./screenshot.png?raw=true "Galactic Encounters")

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
* To build for production: `yarn build-prod`

### Production Mode

* Build: `docker build -t galactic-encounters .`
* Run: `docker run -p 3030:3030 galactic-encounters`
* Wait for the fetching to finish. The console will keep you up to date.
* Navigate to [http://localhost:3300](http://localhost:3300)

### Notes, Excuses, and Disclaimers!

This exercise was fun and also quite challenging in a variety of areas. I've actually learned some things, too. I tried to cover as much ground as possible and not get too hung up on issues that occasionally popped up for me. There are several spots where I had a bit of trouble, and I've added inline comments to try to explain the various choices I've made. Overall, I would say the TypeScript and the Docker stuff were the most challenging parts. I'm happy to report that I finished all the parts of the exercise.

One issue worth noting is that the quality of the Star Wars API is not as high as one would hope. There are typos and flagrant omissions of data, and the relationship between the films and the other resources can be quite vague, depending on the particular character.

Because of this, it's not really possible to show the exact films in which two characters were, say, passengers on a starship together -- at least not in a consistent way. In certain cases, you might be able to make an educated guess or even know for sure. But I'd say it's not often the case.

For example, a lot of characters appear in 3 or more movies yet have just a few or zero planets, vehicles, and starships associated with them. So the films are ultimately just another resource type, and I chose to display them in a very similar way to the other resources.

Please contact me with any issues / questions!

rich@comfypants.org
619-957-2700