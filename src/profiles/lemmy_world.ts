
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const lemmy_world = {
  name: 'lemmy_world',
  matches: [
    {
      match: '(https?://)?lemmy.world/u/({PROFILE_ID})/?', group: 2, type: TYPE_DESKTOP,
      pattern: 'https://lemmy.world/u/{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
