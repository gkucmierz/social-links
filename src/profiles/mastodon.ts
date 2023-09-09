
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const mastodon = {
  name: 'mastodon',
  matches: [
    {
      // https://mastodon.social/@gkucmierz
      match: '(https?://)?(www.)?mastodon.social/@({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://mastodon.social/@{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})', group: 1 },
  ]
};
