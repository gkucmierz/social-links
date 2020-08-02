
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const patreon = {
  name: 'patreon',
  matches: [
    {
      match: '(https?://)?(www.)?patreon.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://patreon.com/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
