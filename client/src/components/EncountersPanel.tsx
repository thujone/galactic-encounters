import React from 'react';

// These types could be fleshed out if we wanted to show more details
// from each resource type. For now, just the name seems good enough.
// Also, sharing the type definitions between components would probably
// be better if we wanted to support this app long term.
type Film = {
  title: string;
};

type Planet = {
  name: string;
};

type Vehicle = {
  name: string;
}

type Starship = {
  name: string;
}

type Encounters = {
  films: Film[];
  planets: Planet[];
  vehicles: Vehicle[];
  starships: Starship[];
};

type EncountersPanelProps = {
  encounters: Encounters;
  onReset: () => void;
  firstCharacterName: string;
  secondCharacterName: string;
};

const EncountersPanel = ({
  encounters,
  onReset,
  firstCharacterName,
  secondCharacterName
}: EncountersPanelProps) => {

  return (
    <div className="encounters-panel fadeIn">

      {/* This is quick and dirty checking... not ideal */}

      {!encounters.films.length && !encounters.planets.length && !encounters.starships.length && !encounters.vehicles.length &&
        <h3>No Galactic Encounters!</h3>
      }

      <ul>
        {encounters.films.map((film: Film, index) => (
          <li key={index}>
            <b>{firstCharacterName}</b> and <b>{secondCharacterName}</b> appeared in the movie <em>{film.title}</em>.
          </li>
        ))}

        {encounters.planets.map((planet: Planet, index) => (
          <li key={index}>
            <b>{firstCharacterName}</b> and <b>{secondCharacterName}</b> are inhabitants of <b>{planet.name}</b>.
          </li>
        ))}

        {encounters.starships.map((starship: Starship, index) => (
          <li key={index}>
            <b>{firstCharacterName}</b> and <b>{secondCharacterName}</b> travelled on the starship <b>{starship.name}</b>.
          </li>
        ))}

        {encounters.vehicles.map((vehicle: Vehicle, index) => (
          <li key={index}>
            <b>{firstCharacterName}</b> and <b>{secondCharacterName}</b> drove in a vehicle <b>{vehicle.name}</b>.
          </li>
        ))}
      </ul>

      <button className="reset-btn" onClick={onReset}>
        Cosmic Reset
      </button>
    </div>
  );
};

export default EncountersPanel;
