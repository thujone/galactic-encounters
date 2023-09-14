import React from 'react';
import Select from 'react-select';

export interface CharacterOption {
  label: string;
  value: string | undefined;
}

type CharacterSelectorProps = {
  characters: CharacterOption[];
  selectedCharacter?: string;
  onDropdownChange: (selectedCharacter: string) => void;
  onDropdownFocus: () => void;
};

const CharacterSelector = ({characters, selectedCharacter, onDropdownChange, onDropdownFocus }: CharacterSelectorProps) => {
  const defaultCharacterOption = { label: "Select", value: undefined } as CharacterOption;
  const characterOptions = [
    defaultCharacterOption,
    ...characters
  ];

  return (
    <Select
      defaultValue={characterOptions[0]}
      classNamePrefix="character-dropdown"
      options={characterOptions}
      value={characterOptions.find(option => option.value === selectedCharacter)}
      onChange={(option: any) => onDropdownChange(option.value)}
      onFocus={onDropdownFocus}
      blurInputOnSelect={true}
    />
  );
};

export default CharacterSelector;
