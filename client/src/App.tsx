import React, { useState, useEffect } from 'react';
import ky from 'ky';
import CharacterSelector, { CharacterOption } from './components/CharacterSelector';
import EncountersPanel from './components/EncountersPanel';
import './styles/main.css';

const CHARACTER_OPTIONS_URL = '/api/character-options';

const App = () => {
  const [characters, setCharacters] = useState<CharacterOption[]>([]);
  const [encounters, setEncounters] = useState<any>(null);

  // This would have been better if both the character's name and id were stored as a tuple.
  // Here, I'm only storing the id (and as a string).
  const [selectedCharacters, setSelectedCharacters] = useState<[string?, string?]>([undefined, undefined]);

  // Fetch the character names and ids to populate the two dropdowns. One issue
  // is that this data should be fetched only once and cached locally so it could
  // be used for both dropdowns. I didn't bother with this here, but I would definitely
  // mark it as a TODO to do soon.
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data: CharacterOption[] = await ky.get(CHARACTER_OPTIONS_URL).json();
        setCharacters(data);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchCharacters();
  }, []);

  // Make the API call for getting the shared encounters. Most of the heavy-lifting
  // is done on the server. Still sending down a lot of data, in anticipation we
  // would use a variety of it eventually. Ultimately, it's NOT a lot of data
  // in all, so it's no big deal if we're wasting some bandwidth here, IMO. Of course,
  // if this were being used at high scale, this inefficiency would have to be
  // corrected.
  useEffect(() => {
    const fetchEncounters = async (id1: string, id2: string) => {
      try {
        const fetchedEncounters: any = await ky.get('/api/encounters', {
          searchParams: { id1, id2 }
        }).json();

        setEncounters(fetchedEncounters.encounters);

      } catch (error) {
        console.error('Error fetching encounters:', error);
      }
    };

    const char1IsValid = characters.map(char => char.value).includes(selectedCharacters[0]!);
    const char2IsValid = characters.map(char => char.value).includes(selectedCharacters[1]!);

    if (char1IsValid && char2IsValid && selectedCharacters[0] !== selectedCharacters[1]) {
      fetchEncounters(selectedCharacters[0]!, selectedCharacters[1]!);
    }
  }, [characters, selectedCharacters]);

  // When a user changes the dropdown, we need to do some error-checking and
  // update various state.
  const handleCharacterChange = (index: number, selectedCharacter: string) => {
    const otherDropdownIndex = index === 0 ? 1 : 0;

    if (selectedCharacter !== undefined && selectedCharacter === selectedCharacters[otherDropdownIndex]) {
        alert("Please select different characters for the dropdowns.");
        return;
    }

    // Probably not the best way to use typescript, in hindsight!
    const updatedSelections: [string?, string?] = [...selectedCharacters] as [string?, string?];
    updatedSelections[index] = selectedCharacter;
    setSelectedCharacters(updatedSelections);
  };


  const resetEncounters = () => {
    setSelectedCharacters([undefined, undefined]);
    setEncounters(null);
  };

  const getCharacterNameById = (id?: string) => {
    const character = characters.find(character => character.value === id);
    return character ? character.label : 'Unknown';
  }

  console.log('encounters', encounters);
  console.log('selectedCharacters', selectedCharacters);

  return (
    <>
      <h1>Galactic Encounters</h1>

      <h2>
        {/* In honor of my favorite html4 tag from the late 90's, I present the wonderful <marquee/>! */}
        <marquee>
          A long, long time ago...
          In a galaxy far, far away...
        </marquee>
      </h2>

      <h3>
        Choose your favorite Star Wars characters from the nine "Skywalker Saga" movies to see where they intersect!
      </h3>

      <div className="character-dropdowns">
        <CharacterSelector
          characters={characters}
          selectedCharacter={selectedCharacters[0]}
          onDropdownChange={selected => handleCharacterChange(0, selected)}
          onDropdownFocus={() => setEncounters(null)}
        />
        <CharacterSelector
          characters={characters}
          selectedCharacter={selectedCharacters[1]}
          onDropdownChange={selected => handleCharacterChange(1, selected)}
          onDropdownFocus={() => setEncounters(null)}
        />
      </div>

      {encounters && (
        <EncountersPanel
          encounters={encounters}
          onReset={resetEncounters}
          firstCharacterName={getCharacterNameById(selectedCharacters[0])}
          secondCharacterName={getCharacterNameById(selectedCharacters[1])}
        />
      )}

    </>
  );
};

export default App;
