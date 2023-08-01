import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const spotify = {
  name: 'spotify',
  matches: [
    {
      match: '(https?://)?(open.)?spotify.com/artist/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://open.spotify.com/artist/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
