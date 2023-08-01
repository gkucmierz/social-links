
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const linktree = {
  name: 'linktree',
  matches: [
    {
      match: '(https?://)?(www.)?linktr.ee/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://linktr.ee/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
