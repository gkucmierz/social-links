
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const youtube =  {
  name: 'youtube',
  matches: [
    {
      match: '(https?://)?(www.)?youtube.com/channel/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://youtube.com/user/{PROFILE_ID}'
    },
    {
      match: '(https?://)?(www.)?youtube.com/user/({PROFILE_ID})/?', group: 3,
      pattern: 'https://youtube.com/channel/{PROFILE_ID}'
    },
    {
      match: '(https?://)?m.youtube.com/c/({PROFILE_ID})/?', group: 2,
      pattern: 'https://m.youtube.com/c/{PROFILE_ID}'
    },
    { match: '({PROFILE_ID})', group: 1 },
  ]
};
