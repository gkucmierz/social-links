
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const substack = {
  name: 'substack',
  matches: [
    {
      match: '(https?://)?({PROFILE_ID}).substack.com/?', group: 2, type: TYPE_DESKTOP,
      pattern: 'https://{PROFILE_ID}.substack.com'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
