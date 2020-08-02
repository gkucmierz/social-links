
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const medium = {
  name: 'medium',
  matches: [
    {
      match: '(https?://)?(www.)?medium.com/@({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://medium.com/@{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
