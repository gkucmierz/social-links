
export interface ProfileMatch {
  match: string;
  group: number;
  type?: number;
  pattern?: string;
}

export interface Profile {
  name: string;
  matches: ProfileMatch[];
}

const profiles = new Map();
const PROFILE_ID = '[A-Za-z0-9_\\-\\.]+';

const createRegexp = (match: string): RegExp => {
  const str = match.replace('{PROFILE_ID}', `${PROFILE_ID}`);
  const regexp = new RegExp(['^', str, '$'].join(''));
  return regexp;
};

const findIndex = (matches: ProfileMatch[], link: string): number => {
  return matches.findIndex(({ match }) => createRegexp(match).test(link));
};

export const TYPE_DESKTOP = 0;
export const TYPE_MOBILE = 1;
export class SocialLinks {

  constructor(usePredefinedProfiles = true) {
    if (usePredefinedProfiles) {
      PREDEFINED_PROFILES.map(({ name, matches }) => profiles.set(name, matches));
    }
  }

  addProfile(profileName: string, profileMatches: ProfileMatch[]): boolean {
    if (this.hasProfile(profileName)) return false;
    profiles.set(profileName, profileMatches);
    return true;
  }

  cleanProfiles(): void {
    profiles.clear();
  }

  isValid(profileName: string, link: string): boolean {
    if (!this.hasProfile(profileName)) return false;
    const matches = profiles.get(profileName);
    return findIndex(matches, link) !== -1;
  }

  getProfileId(profileName: string, link: string): string {
    if (!this.hasProfile(profileName)) throw new Error(`There is no profile ${profileName} defined`);
    const matches = profiles.get(profileName);
    const idx = findIndex(matches, link);
    if (idx === -1) throw new Error(`Link has not matched with profile ${profileName}`);
    return (link.match(createRegexp(matches[idx].match)) || [])[matches[idx].group];
  }

  getLink(profileName: string, id: string, type = TYPE_DESKTOP): string {
    if (!this.hasProfile(profileName)) throw new Error(`There is no profile ${profileName} defined`);
    const matches = profiles.get(profileName);
    const idx = matches.findIndex((match: ProfileMatch) => match.type === type);
    if (idx === -1) throw new Error(`There is no pattern for profile ${profileName}`);
    return matches[idx].pattern.replace('{PROFILE_ID}', `${id}`);
  }

  sanitize(profileName: string, link: string, type = Infinity): string {
    const profileId = this.getProfileId(profileName, link);
    const matches = profiles.get(profileName);
    const idx = findIndex(matches, link);
    const matchedType = type !== Infinity ? type : (matches[idx].type ?? TYPE_DESKTOP);
    return this.getLink(profileName, profileId, matchedType);
  }

  hasProfile(profileName: string): boolean {
    return profiles.has(profileName);
  }
}

export const PREDEFINED_PROFILES: Profile[] = [
  { name: 'linkedin',
    matches: [
      {
        match: '(https?://)?(www.)?linkedin.com/in/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://linkedin.com/in/{PROFILE_ID}'
      },
      {
        match: '(https?://)?(www.)?linkedin.com/mwlite/in/({PROFILE_ID})', group: 3, type: TYPE_MOBILE,
        pattern: 'https://linkedin.com/mwlite/in/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'twitter',
    matches: [
      {
        match: '(https?://)?(www.)?twitter.com/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://twitter.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'facebook',
    matches: [
      {
        match: '(https?://)?(www.)?facebook.com/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://facebook.com/{PROFILE_ID}'
      },
      {
        match: '(https?://)?m.facebook.com/({PROFILE_ID})', group: 3, type: TYPE_MOBILE,
        pattern: 'https://m.facebook.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'youtube',
    matches: [
      {
        match: '(https?://)?(www.)youtube.com/channel/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://youtube.com/{PROFILE_ID}'
      },
      {
        match: '(https?://)?m.youtube/c/({PROFILE_ID})', group: 3, type: TYPE_MOBILE,
        pattern: 'https://m.youtube/c/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'twitch',
    matches: [
      {
        match: '(https?://)?(www.)?twitch.tv/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://twitch.tv/{PROFILE_ID}'
      },
      {
        match: '(https?://)?m.twitch.tv/({PROFILE_ID})', group: 3, type: TYPE_MOBILE,
        pattern: 'https://m.twitch.tv/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'discord',
    matches: [
      {
        match: '(https?://)?(www.)?discord.com/channels/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://discord.com/channels/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'instagram',
    matches: [
      {
        match: '(https?://)?(www.)?instagram.com/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://instagram.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'patreon',
    matches: [
      {
        match: '(https?://)?(www.)?patreon.com/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://patreon.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
];
