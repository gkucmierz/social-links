
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const facebook = {
name: 'facebook',
  matches: [
    {
      match: '(https?://)?(www.)?facebook.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://facebook.com/{PROFILE_ID}'
    },
    {
      match: '(https?://)?m.facebook.com/({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
      pattern: 'https://m.facebook.com/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
