
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const x = {
  name: 'x',
  matches: [
    {
      match: '(https?://)?(www.)?x.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://x.com/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
