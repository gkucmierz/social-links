
import { TYPE_DESKTOP } from '../types';

export const telegram = {
  name: 'telegram',
  matches: [
    {
      match: '(https?://)?(www.)?(t.me|telegram.me)/({PROFILE_ID})/?', group: 4, type: TYPE_DESKTOP,
      pattern: 'https://t.me/{PROFILE_ID}'
      // profileId: ([a-z0-9_]{5,32})
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
