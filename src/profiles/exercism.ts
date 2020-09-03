
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const exercism = {
  name: 'exercism',
  matches: [
    {
      match: '(https?://)?(www.)?exercism.io/profiles/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://exercism.io/profiles/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
