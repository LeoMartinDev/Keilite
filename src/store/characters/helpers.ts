import { DOFUS_WINDOW_TITLE_DELIMITER } from './constants';

export function windowTitleToCharacterName(value: string): string {
  if (!value) {
    return 'N/A';
  }
  if (!value.includes(DOFUS_WINDOW_TITLE_DELIMITER)) {
    return value;
  } else {
    return value.split(DOFUS_WINDOW_TITLE_DELIMITER).shift() as string;
  }
}
