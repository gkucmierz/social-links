
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const dev_to = {
  name: 'dev_to',
  matches: [
    {
      match: '(https?://)?(www.)?dev.to/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://dev.to/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
