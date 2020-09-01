
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const dribbble = {
  name: 'dribbble',
  matches: [
    {
      match: '(https?://)?(www.)?dribbble.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://dribbble.com/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
