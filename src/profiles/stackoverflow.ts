
import { TYPE_DESKTOP } from '../types';

export const stackoverflow = {
  name: 'stackoverflow',
  matches: [
    {
      match: '(https?://)?(www.)?stackoverflow.com/users/({PROFILE_ID})(/[A-Za-z0-9_\\-\\.]+)?/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://stackoverflow.com/users/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
