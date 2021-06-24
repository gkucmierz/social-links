
import { TYPE_DESKTOP } from '../types';

export const pinterest = {
  name: 'pinterest',
  matches: [
    {
      match: '(https?://)?(www.)?pinterest.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://pinterest.com/{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
