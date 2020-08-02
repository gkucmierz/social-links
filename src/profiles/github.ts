
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const github = {
  name: 'github',
  matches: [
    {
      match: '(https?://)?(www.)?github.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://github.com/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
