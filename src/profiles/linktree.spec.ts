
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: linktree', () => {
  let sl: SocialLinks;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  const testProfileDesktop = (profile: string, profileId: string, desktop: string) => {
    expect(sl.hasProfile(profile)).toBeTruthy();

    expect(sl.isValid(profile, desktop)).toBeTruthy();

    expect(sl.getProfileId(profile, desktop)).toBe(profileId);

    expect(sl.getLink(profile, profileId)).toBe(desktop);
    expect(sl.getLink(profile, profileId, TYPE_DESKTOP)).toBe(desktop);

    expect(sl.sanitize(profile, desktop)).toBe(desktop);
    expect(sl.sanitize(profile, desktop, TYPE_DESKTOP)).toBe(desktop);
  };

  it('should linktree', () => {
    const profile = 'linktree';
    const profileId = 'gkucmierz';
    const desktop = `https://linktr.ee/${profileId}`;
    testProfileDesktop(profile, profileId, desktop);
  });
});
