
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const twitter = {
  name: 'twitter',
  matches: [
    {
      match: '(https?://)?(www.)?twitter.com/@?({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://twitter.com/{PROFILE_ID}'
    },
    {
      match: '(https?://)?mobile.twitter.com/@?({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
      pattern: 'https://mobile.twitter.com/{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
