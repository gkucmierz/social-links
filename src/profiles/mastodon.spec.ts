
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

  it('should mastodon.social valid wariations', () => {
    expect(sl.isValid(profile, `https://mastodon.social/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `http://mastodon.social/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `mastodon.social/@${profileId}/`)).toBeTruthy();
    expect(sl.isValid(profile, `http://mastodon.social/@${profileId}/`)).toBeTruthy();
    expect(sl.isValid(profile, `www.mastodon.social/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `http://www.mastodon.social/@${profileId}`)).toBeTruthy();
  });

  it('should mstdn.social valid wariations', () => {
    expect(sl.isValid(profile, `https://mstdn.social/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `http://mstdn.social/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `mstdn.social/@${profileId}/`)).toBeTruthy();
    expect(sl.isValid(profile, `http://mstdn.social/@${profileId}/`)).toBeTruthy();
    expect(sl.isValid(profile, `www.mstdn.social/@${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `http://www.mstdn.social/@${profileId}`)).toBeTruthy();
  });
});
