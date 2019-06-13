import { CharacterGender } from './../../store/characters/types';
import { classNames, AVATAR_PATH, DEFAULT_AVATAR } from './constants';
import { join } from 'path';
import { Character } from '@/store/characters/types';

export function getAvatarFilename(gender: string, className: string): string {
  return `${className}_${gender}.png`;
}

export function getAvatar(gender: string, className: string): string {
  return join(AVATAR_PATH, getAvatarFilename(gender, className));
}

export function getCharacterAvatarPath(character: Character): string {
  if (!character.className || !character.gender
    || !Object.values(CharacterGender).includes(character.gender)
    || !classNames.includes(character.className)) {
    return join(AVATAR_PATH, DEFAULT_AVATAR);
  } else {
    return join(AVATAR_PATH, getAvatarFilename(character.gender, character.className));
  }
}
