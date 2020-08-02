
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const twitch = {
  name: 'twitch',
  matches: [
    {
      match: '(https?://)?(www.)?twitch.tv/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://twitch.tv/{PROFILE_ID}'
    },
    {
      match: '(https?://)?m.twitch.tv/({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
      pattern: 'https://m.twitch.tv/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
