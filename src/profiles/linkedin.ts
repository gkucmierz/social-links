
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const linkedin = {
  name: 'linkedin',
  matches: [
    {
      match: '(https?://)?([a-z]{2,3}.)?linkedin.com/in/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://linkedin.com/in/{PROFILE_ID}'
    },
    {
      match: '(https?://)?([a-z]{2,3}.)?linkedin.com/mwlite/in/({PROFILE_ID})/?', group: 3, type: TYPE_MOBILE,
      pattern: 'https://linkedin.com/mwlite/in/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
