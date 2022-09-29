
import { PREDEFINED_PROFILES } from './profiles/';
export { PREDEFINED_PROFILES };
import { TYPE_DESKTOP, TYPE_MOBILE, TYPE_DEFAULT } from './types';
export * from './types';

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

export interface Score {
  profileName: string;
  score: number;
}

const PROFILE_ID = '[A-Za-z0-9_\\-\\.]+';
const QUERY_PARAM = '(\\?.*)?';

const createRegexp = (profileMatch: ProfileMatch, config: Config): RegExp => {
  const str = profileMatch.match.replace('{PROFILE_ID}', `${PROFILE_ID}`);
  const isTyped = typeof profileMatch.type !== 'undefined';
  const regexp = new RegExp([
    '^', str, ...(config.allowQueryParams && isTyped ? [QUERY_PARAM] : []), '$'
  ].join(''));
  return regexp;
};

const findIndex = (
  matches: ProfileMatch[] | undefined,
  link: string,
  config: Config
  ): number => {
  return (matches ?? []).findIndex(match => createRegexp(match, config).test(link));
};

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
    return (trimmed.match(createRegexp(matches[idx], this.config)) ?? [])[matches[idx].group];
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

  getProfileNames(): Array<string> {
    return [...this.profiles.keys()];
  }

  // list all matching profiles sorted by score
  scoreProfiles(link: string): Array<Score> {
    return this.getProfileNames().map(profileName => {
      const matches = this.profiles.get(profileName);
      const score = (matches || []).reduce((sum, match): number => {
        return sum + (createRegexp(match, this.config).test(link) ? 1 : 0);
      }, 0);
      return { profileName, score };
    })
      .filter(obj => obj.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  // return first matching profile
  detectProfile(link: string): string {
    const scores = this.scoreProfiles(link);
    if (scores.length === 0) return '';
    return scores[0].profileName;
  }
}

export default SocialLinks;
