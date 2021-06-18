
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const aa = {
  name: 'aa',
  matches: [
    {
      match: '(https?://)?(www.)?aa.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://aa.com/{PROFILE_ID}'
    },
    {
      match: '(https?://)?mobile.aa.com/@?({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
      pattern: 'https://mobile.aa.com/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
