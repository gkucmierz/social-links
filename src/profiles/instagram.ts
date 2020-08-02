
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const instagram = {
  name: 'instagram',
  matches: [
    {
      match: '(https?://)?(www.)?instagram.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://instagram.com/{PROFILE_ID}'
    },
    {
      match: '(https?://)?m.instagram.com/({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
      pattern: 'https://m.instagram.com/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
