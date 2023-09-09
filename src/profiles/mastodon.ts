
import { TYPE_DESKTOP, TYPE_MOBILE } from '../types';

export const mastodon = {
  name: 'mastodon',
  matches: [
    {
      // https://mastodon.social/@gkucmierz
      match: '(https?://)?(www.)?mastodon.social/@({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://mastodon.social/@{PROFILE_ID}'
    },
    {
      // https://mstdn.social/@gkucmierz
      match: '(https?://)?(www.)?mstdn.social/@({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
      pattern: 'https://mstdn.social/@{PROFILE_ID}'
    },
    { match: '@?({PROFILE_ID})(@mastodon.social)?', group: 1 },
    { match: '@?({PROFILE_ID})(@mstdn.social)?', group: 1 },
  ]
};
