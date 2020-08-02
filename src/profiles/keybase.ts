
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const keybase = {
  name: 'keybase',
  matches: [
    {
      match: '(https?://)?(www.)?keybase.io/?({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://keybase.io/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
