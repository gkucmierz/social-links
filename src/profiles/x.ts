
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const twitter = {
  name: 'x',
  matches: [
    {
      match: '(https?://)?(www.)?twitter.com/@?({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://x.com/{PROFILE_ID}'
    },
    {
      match: '(https?://)?(www.)?x.com/@?({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://x.com/{PROFILE_ID}'
    },
    {
      match: '(https?://)?mobile.twitter.com/@?({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
      pattern: 'https://x.com/{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
