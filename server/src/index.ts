import express from 'express';
import got from 'got';

// I didn't bother setting up routes, hence querystring params instead
// of forward slashes.
const app = express();
const PORT = 3300;
const BASE_URL = 'https://swapi.dev/api';

// I had to add these to get Docker running. I think only the top one is actually necessary. But to remove
// any of them and make sure it hasn't broken the Docker build and run processes would take me an hour or more.
app.use(express.static('/app/client/public'));
app.use(express.static('public'));
app.use(express.static('/app/server/public'));

enum StarWarsResource {
    PEOPLE = 'people',
    PLANETS = 'planets',
    FILMS = 'films',
    VEHICLES = 'vehicles',
    STARSHIPS = 'starships'
}

interface StarWarsResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

const starWarsData: Record<StarWarsResource, any[]> = {
    [StarWarsResource.PEOPLE]: [],
    [StarWarsResource.PLANETS]: [],
    [StarWarsResource.FILMS]: [],
    [StarWarsResource.VEHICLES]: [],
    [StarWarsResource.STARSHIPS]: []
};

type Film = {
    url: string;
    title: string;
}

type Planet = {
    url: string;
    name: string;
}

type Vehicle = {
    url: string;
    name: string;
}

type Starship = {
    url: string;
    name: string;
}

// Fetch all the items for a particular resource (e.g., fetch all planets, or fetch all vehicles)
async function fetchAll(resourceType: StarWarsResource) {
    let results: any[] = [];
    let nextPageUrl: string | null = `${BASE_URL}/${resourceType}/`;

    while (nextPageUrl) {
        try {
            const response: got.Response<string> = await got(nextPageUrl);
            const responseData: StarWarsResponse<any> = JSON.parse(response.body);

            results = [...results, ...responseData.results];
            nextPageUrl = responseData.next;
        } catch (error: any) {
            throw new Error(`Failed to fetch ${resourceType} data: ${error.message}`);
        }
    }

    console.log(`Fetched ${results.length} '${resourceType}'...`);
    return results;
}

// I decided it would be best and easiest to just get all the data upon server startup.
// It's not a lot of data, so I think it's OK just to grab it all.
// Running live requests through the proxy, with its 10 items per page, seems painful
// and slow and probably error-prone. Another factor is the data doesn't change often,
// or at all.
async function initializeStarWarsData() {
    // It actually takes some time to fetch the entire SWAPI. At least a minute or two.
    // Not because it's so much data, but because they have a rate limiter.
    console.log("Fetching data from `swapi.dev`. Please be patient...")
    try {
        for (const resourceType of Object.values(StarWarsResource)) {
            starWarsData[resourceType] = await fetchAll(resourceType);
        }
        console.log("Fetching complete! `starWarsData` populated successfully!");
    } catch (error) {
        console.error("Failed to populate `starWarsData`:", error);
        process.exit(1);
    }
}

// This is good for dev purposes.
app.get('/api/all-data', (req, res) => {
    res.json(starWarsData);
});

app.get('/api/character-options', (req, res) => {
    const characterOptions = starWarsData.people.map(person => {
        // SWAPI doesn't even have an id field, so it must be gleaned from the url. Pretty annoying.
        const id: string = `${person.url.match(/\d+/)}`;
        return {
            label: person.name,
            value: id
        }
    })
    res.json(characterOptions);
});

// Determine what encounters are shared between the two characters.
app.get('/api/encounters', (req, res) => {
    const { id1, id2 } = req.query;

    // Find the characters by id
    const person1 = starWarsData[StarWarsResource.PEOPLE].find(person => person.url.endsWith(`/${id1}/`));
    const person2 = starWarsData[StarWarsResource.PEOPLE].find(person => person.url.endsWith(`/${id2}/`));

    if (!person1 || !person2) {
        return res.status(404).json({ error: "One or both characters not found." });
    }

    // Determine the common resource items for the two characters
    const allFilms = starWarsData[StarWarsResource.FILMS] as Film[];
    const allPlanets = starWarsData[StarWarsResource.PLANETS] as Planet[];
    const allStarships = starWarsData[StarWarsResource.STARSHIPS] as Starship[];
    const allVehicles = starWarsData[StarWarsResource.VEHICLES] as Vehicle[];

    // Filter for the overlapping urls for each resource type
    const sharedFilmUrls: string[] = person1.films && person2.films
        ? person1.films.filter((filmUrl: any) => person2.films.includes(filmUrl))
        : [];
    const sharedStarshipUrls: string[] = person1.starships && person2.starships
        ? person1.starships.filter((starshipUrl: any) => person2.starships.includes(starshipUrl))
        : [];
    const sharedVehicleUrls: string[] = person1.vehicles && person2.vehicles
        ? person1.vehicles.filter((vehicleUrl: any) => person2.vehicles.includes(vehicleUrl))
        : [];

    // Gather the complete data for each overlapping url
    const sharedFilms = allFilms.filter((film: any) => sharedFilmUrls.includes(film.url));
    const sharedStarships = allStarships.filter((starship: any) => sharedStarshipUrls.includes(starship.url));
    const sharedVehicles = allVehicles.filter((vehicle: any) => sharedVehicleUrls.includes(vehicle.url));

    // Shared planets is somewhat different from the other resource types.
    // In this case, we have to look at the planet's `residents` array and see if both
    // characters exist. (The person's `homeworld` is always contained in this array.)
    const sharedPlanets = allPlanets.filter((planet: any) => (
        planet.residents.includes(`https://swapi.dev/api/people/${id1}/`)
        && planet.residents.includes((`https://swapi.dev/api/people/${id2}/`))
    ));

    // Send back a response containing the common resources for the two characters
    res.json({
        encounters: {
            films: sharedFilms,
            planets: sharedPlanets,
            starships: sharedStarships,
            vehicles: sharedVehicles
        }
    });
});

// This is just for the prod environment, so that
// http://localhost:3300 in the browser will bring up the app index page.
// Obviously, this isn't the best way to set things up between environments,
// but it works for now.
app.get('*', (req, res) => {
    res.sendFile('/app/client/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    initializeStarWarsData();
});

