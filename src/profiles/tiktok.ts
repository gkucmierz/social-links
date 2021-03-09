
import { TYPE_DESKTOP } from '../types';

export const tiktok = {
  name: 'tiktok',
  matches: [
    {
      match: '(https?://)?(www.)?tiktok.com/@({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://tiktok.com/@{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
