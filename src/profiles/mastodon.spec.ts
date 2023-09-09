
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: mastodon', () => {
  let sl: SocialLinks;
  const profile = 'mastodon';
  const profileId = 'gkucmierz';
  const desktop = `https://mastodon.social/@${profileId}`;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  it('should mastodon basics', () => {
    expect(sl.hasProfile(profile)).toBeTruthy();
    expect(sl.isValid(profile, desktop)).toBeTruthy();
    expect(sl.getProfileId(profile, desktop)).toBe(profileId);
    expect(sl.getLink(profile, profileId)).toBe(desktop);
    expect(sl.getLink(profile, profileId, TYPE_DESKTOP)).toBe(desktop);
  });

  const checkMastodonMatches = (domain: string, profileId: string) => {
    expect(sl.isValid(profile, `https://${domain}/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `http://${domain}/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `${domain}/@${profileId}/`)).toBeTruthy();
    expect(sl.isValid(profile, `http://${domain}/@${profileId}/`)).toBeTruthy();
    expect(sl.isValid(profile, `www.${domain}/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `http://www.${domain}/@${profileId}`)).toBeTruthy();
  };

  it('should mastodon.social valid wariations', () => {
    checkMastodonMatches('mastodon.social', profileId);
  });

  it('should mstdn.social valid wariations', () => {
    checkMastodonMatches('mstdn.social', profileId);
  });
  
  it('should mastodon.world valid wariations', () => {
    checkMastodonMatches('mastodon.world', profileId);
  });
});
