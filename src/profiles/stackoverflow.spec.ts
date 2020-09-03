
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: stackoverflow', () => {
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

  it('should stackoverflow', () => {
    const profile = 'stackoverflow';
    const profileId = '3573210';
    const desktop = `https://stackoverflow.com/users/${profileId}`;
    testProfileDesktop(profile, profileId, desktop);
  });

  it('should recognize full link', () => {
    const profile = 'stackoverflow';
    const profileId = '3573210';
    const desktop = `https://stackoverflow.com/users/${profileId}`;
    const fullLink = `https://stackoverflow.com/users/${profileId}/gkucmierz`;

    expect(sl.isValid(profile, fullLink)).toBeTruthy();
    expect(sl.getProfileId(profile, fullLink)).toBe(profileId);
    expect(sl.sanitize(profile, fullLink)).toBe(desktop);
  });
});
