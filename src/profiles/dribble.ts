
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const dribble = {
  name: 'dribble',
  matches: [
    {
      match: '(https?://)?(www.)?dribble.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://dribble.com/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
