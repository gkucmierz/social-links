
import { TYPE_DESKTOP } from '../types';

export const telegram = {
  name: 'telegram',
  matches: [
    {
      match: '(https?://)?(www.)?(t.me|telegram.org|telegram.me)/([a-z0-9_]{5,32})/?', group: 4, type: TYPE_DESKTOP,
      pattern: 'https://t.me/{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
