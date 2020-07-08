
interface Profile {
  pattern: string;
}

const socialsMobile = {
  linkedin: 'linkedin.com/mwlite/in/{PROFILE_ID}',
  facebook: 'm.facebook.com/{PROFILE_ID}',
  youtube: 'm.youtube/c/{PROFILE_ID}',
  twitch: 'm.twitch.tv/{PROFILE_ID}',
};

const socialsDesktop = {
  linkedin: '(www.)?linkedin.com/in/{PROFILE_ID}',
  twitter: '(www.)?twitter.com/{PROFILE_ID}',
  facebook: '(www.)?facebook.com/{PROFILE_ID}',
  youtube: '(www.)youtube.com/channel/{PROFILE_ID}',
  twitch: '(www.)?twitch.tv/{PROFILE_ID}',
  discord: 'link',
  instagram: '(www.)?instagram.com/{PROFILE_ID}',
  patreon: '(www.)?patreon.com/{PROFILE_ID}',
};

const escapeRegex = (string: string): string => {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export class SocialLinks {
  static DESKTOP = 0;
  static MOBILE = 1;

  constructor(usePredefinedProfiles = true) {

  }

  addProfile(profile: Profile): void {

  }

  isValid(profileName: string, link: string): boolean {
    return true;
  }

  sanitize(profileName: string, link: string): string {
    return 'gkucmierz';
  }

  getLink(profileName: string, id: string): string {
    return '';
  }
}
