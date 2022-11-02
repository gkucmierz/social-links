
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: youtube', () => {
  let sl: SocialLinks;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  const testProfile = (profile: string, profileId: string, given: string, expected: string) => {
    expect(sl.hasProfile(profile)).toBeTruthy();

    expect(sl.isValid(profile, given)).toBeTruthy();

    expect(sl.getProfileId(profile, given)).toBe(profileId);

    expect(sl.getLink(profile, profileId)).toBe(expected);
    expect(sl.getLink(profile, profileId, TYPE_DESKTOP)).toBe(expected);

    expect(sl.sanitize(profile, given)).toBe(expected);
    expect(sl.sanitize(profile, given, TYPE_DESKTOP)).toBe(expected);
  };

  it('should work with /@user', () => {
    const profile = 'youtube';
    const profileId = 'gkucmierz';

    const curr = `https://youtube.com/@${profileId}`;
    const old = [
      `https://youtube.com/channel/${profileId}`,
      `https://youtube.com/user/${profileId}`,
      curr,
    ];

    old.map(url => testProfile(profile, profileId, url, curr));
  });
});
