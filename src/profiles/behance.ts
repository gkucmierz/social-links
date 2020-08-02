
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const behance = {
  name: 'behance',
  matches: [
    {
      match: '(https?://)?(www.)?behance.net/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://behance.net/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
