
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

const PROFILE_ID = '[A-Za-z0-9_\\-\\.]+';
const QUERY_PARAM = '(\\?.*)?';

const createRegexp = (match: string, config: Config): RegExp => {
  const str = match.replace('{PROFILE_ID}', `${PROFILE_ID}`);
  const regexp = new RegExp([
    '^', str, ...(config.allowQueryParams ? [QUERY_PARAM] : []), '$'
  ].join(''));
  return regexp;
};

const findIndex = (
  matches: ProfileMatch[] | undefined,
  link: string,
  config: Config
  ): number => {
  return (matches ?? []).findIndex(({ match }) => createRegexp(match, config).test(link));
};

export const TYPE_DESKTOP = 0;
export const TYPE_MOBILE = 1;
const TYPE_DEFAULT = Infinity;

export interface Config {
  usePredefinedProfiles?: boolean;
  trimInput?: boolean;
  allowQueryParams?: boolean;
}

export const DEFAULT_CONFIG: Config = {
  usePredefinedProfiles: true,
  trimInput: true,
  allowQueryParams: false,
};

export class SocialLinks {
  private profiles: Map<any, ProfileMatch[]>;
  private config: Config;

  constructor(config: Config | boolean = DEFAULT_CONFIG) {
    if (typeof config === 'boolean') {
      config = { usePredefinedProfiles: config };
    }
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.profiles = new Map();

    if (this.config.usePredefinedProfiles) {
      PREDEFINED_PROFILES.map(({ name, matches }) => this.addProfile(name, matches));
    }
  }

  private trim(input: string): string {
    return this.config.trimInput ? input.trim() : input;
  }

  addProfile(profileName: string, profileMatches: ProfileMatch[]): boolean {
    if (this.hasProfile(profileName)) return false;
    this.profiles.set(profileName, profileMatches);
    return true;
  }

  cleanProfiles(): void {
    this.profiles.clear();
  }

  isValid(profileName: string, link: string): boolean {
    if (!this.hasProfile(profileName)) return false;
    const matches = this.profiles.get(profileName);
    return findIndex(matches, this.trim(link), this.config) !== -1;
  }

  getProfileId(profileName: string, link: string): string {
    if (!this.hasProfile(profileName)) throw new Error(`There is no profile ${profileName} defined`);
    const matches = this.profiles.get(profileName) ?? [];
    const trimmed = this.trim(link);
    const idx = findIndex(matches, trimmed, this.config);
    if (idx === -1) throw new Error(`Link has not matched with profile ${profileName}`);
    return (trimmed.match(createRegexp(matches[idx].match, this.config)) ?? [])[matches[idx].group];
  }

  getLink(profileName: string, id: string, type = TYPE_DEFAULT): string {
    if (!this.hasProfile(profileName)) throw new Error(`There is no profile ${profileName} defined`);
    const matches = this.profiles.get(profileName) ?? [];
    const weakType = type === TYPE_DEFAULT ? TYPE_DESKTOP : type;
    const idx = matches.findIndex((match: ProfileMatch) => {
      if (type === TYPE_DEFAULT) return true;
      return match.type === weakType;
    });
    if (idx === -1) throw new Error(`There is no pattern for profile ${profileName}`);
    return (matches[idx].pattern ?? '').replace('{PROFILE_ID}', `${this.trim(id)}`);
  }

  sanitize(profileName: string, link: string, type = TYPE_DEFAULT): string {
    const trimmed = this.trim(link);
    const profileId = this.getProfileId(profileName, trimmed);
    const matches = this.profiles.get(profileName) ?? [];
    const idx = findIndex(matches, trimmed, this.config);
    const matchedType = type !== TYPE_DEFAULT ? type : (matches[idx].type ?? TYPE_DEFAULT);
    return this.getLink(profileName, profileId, matchedType);
  }

  hasProfile(profileName: string): boolean {
    return this.profiles.has(profileName);
  }
}

export const PREDEFINED_PROFILES: Profile[] = [
  { name: 'linkedin',
    matches: [
      {
        match: '(https?://)?(www.)?linkedin.com/in/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://linkedin.com/in/{PROFILE_ID}'
      },
      {
        match: '(https?://)?(www.)?linkedin.com/mwlite/in/({PROFILE_ID})/?', group: 3, type: TYPE_MOBILE,
        pattern: 'https://linkedin.com/mwlite/in/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'twitter',
    matches: [
      {
        match: '(https?://)?(www.)?twitter.com/@?({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://twitter.com/{PROFILE_ID}'
      },
      {
        match: '(https?://)?mobile.twitter.com/@?({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
        pattern: 'https://mobile.twitter.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'facebook',
    matches: [
      {
        match: '(https?://)?(www.)?facebook.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://facebook.com/{PROFILE_ID}'
      },
      {
        match: '(https?://)?m.facebook.com/({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
        pattern: 'https://m.facebook.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'youtube',
    matches: [
      {
        match: '(https?://)?(www.)?youtube.com/channel/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://youtube.com/channel/{PROFILE_ID}'

      },
      {
        match: '(https?://)?m.youtube.com/c/({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
        pattern: 'https://m.youtube.com/c/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'twitch',
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
  },
  { name: 'instagram',
    matches: [
      {
        match: '(https?://)?(www.)?instagram.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://instagram.com/{PROFILE_ID}'
      },
      {
        match: '(https?://)?m.instagram.com/({PROFILE_ID})/?', group: 2, type: TYPE_MOBILE,
        pattern: 'https://m.instagram.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'patreon',
    matches: [
      {
        match: '(https?://)?(www.)?patreon.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://patreon.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'github',
    matches: [
      {
        match: '(https?://)?(www.)?github.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://github.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'medium',
    matches: [
      {
        match: '(https?://)?(www.)?medium.com/@({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://medium.com/@{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'dribbble',
    matches: [
      {
        match: '(https?://)?(www.)?dribbble.com/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://dribbble.com/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
  { name: 'behance',
    matches: [
      {
        match: '(https?://)?(www.)?behance.net/({PROFILE_ID})/?', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://behance.net/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
  },
];
