import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: spotify', () => {
  let sl: SocialLinks;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  const testProfile = (profile: string, profileId: string, desktop: string, mobile: string) => {
    expect(sl.hasProfile(profile)).toBeTruthy();

    expect(sl.isValid(profile, desktop)).toBeTruthy();
    expect(sl.isValid(profile, mobile)).toBeTruthy();

    expect(sl.getProfileId(profile, desktop)).toBe(profileId);
    expect(sl.getProfileId(profile, mobile)).toBe(profileId);

    expect(sl.getLink(profile, profileId)).toBe(desktop);
    expect(sl.getLink(profile, profileId, TYPE_DESKTOP)).toBe(desktop);
    expect(sl.getLink(profile, profileId, TYPE_MOBILE)).toBe(mobile);

    expect(sl.sanitize(profile, desktop)).toBe(desktop);
    expect(sl.sanitize(profile, desktop, TYPE_DESKTOP)).toBe(desktop);
    expect(sl.sanitize(profile, mobile, TYPE_MOBILE)).toBe(mobile);
  };

  const testProfileDesktop = (profile: string, profileId: string, desktop: string) => {
    expect(sl.hasProfile(profile)).toBeTruthy();

    expect(sl.isValid(profile, desktop)).toBeTruthy();

    expect(sl.getProfileId(profile, desktop)).toBe(profileId);

    expect(sl.getLink(profile, profileId)).toBe(desktop);
    expect(sl.getLink(profile, profileId, TYPE_DESKTOP)).toBe(desktop);

    expect(sl.sanitize(profile, desktop)).toBe(desktop);
    expect(sl.sanitize(profile, desktop, TYPE_DESKTOP)).toBe(desktop);
  };

  it('should spotify', () => {
    const profile = 'spotify';
    const profileId = '06HL4z0CvFAxyc27GXpf02';
    const desktop = `https://open.spotify.com/artist/${profileId}`;
    testProfileDesktop(profile, profileId, desktop);
  });
});
