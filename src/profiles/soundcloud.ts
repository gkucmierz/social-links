import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const soundcloud = {
  name: 'soundcloud',
  matches: [
    {
      match: '(https?://)?(www.)?soundcloud.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://soundcloud.com/{PROFILE_ID}',
    },
    { match: '({PROFILE_ID})', group: 1 },
  ],
};
