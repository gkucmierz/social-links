
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: pinterest', () => {
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

  it('should pinterest', () => {
    const profile = 'pinterest';
    const profileId = 'gkucmierz';
    const desktop = `https://pinterest.com/${profileId}`;
    testProfileDesktop(profile, profileId, desktop);
  });

  it('should work with cc subdomain', () => {
    const profile = 'pinterest';
    const profileId = 'gkucmierz';
    const desktop = `https://pl.pinterest.com/${profileId}`;
    expect(sl.isValid(profile, desktop)).toBeTruthy();
  });

  it(`should work with 'www' subdomain`, () => {
    const profile = 'pinterest';
    const profileId = 'gkucmierz';
    const desktop = `https://www.pinterest.com/${profileId}`;
    expect(sl.isValid(profile, desktop)).toBeTruthy();
  });

  it(`should not work with more than 3 characters subdomain`, () => {
    const profile = 'pinterest';
    const profileId = 'gkucmierz';
    const desktop = `https://abcd.pinterest.com/${profileId}`;
    expect(sl.isValid(profile, desktop)).toBeFalsy();
  });
});
