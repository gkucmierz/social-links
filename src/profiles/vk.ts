
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const vk = {
  name: 'vk',
  matches: [
    {
      match: '(https?://)?(www.)?vk.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://vk.com/{PROFILE_ID}'
    },
    {
      match: '(https?://)?m.vk.com/@?({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
      pattern: 'https://m.vk.com/{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
