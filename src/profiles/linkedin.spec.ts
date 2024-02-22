
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: linkedin', () => {
  let sl: SocialLinks;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  const testProfile = (profile: string, profileId: string, desktop: string, mobile: string, company: string) => {
    expect(sl.hasProfile(profile)).toBeTruthy();

    expect(sl.isValid(profile, desktop)).toBeTruthy();
    expect(sl.isValid(profile, mobile)).toBeTruthy();
    expect(sl.isValid(profile, company)).toBeTruthy();

    expect(sl.getProfileId(profile, desktop)).toBe(profileId);
    expect(sl.getProfileId(profile, mobile)).toBe(profileId);
    expect(sl.getProfileId(profile, company)).toBe(profileId);

    expect(sl.getLink(profile, profileId)).toBe(desktop);
    expect(sl.getLink(profile, profileId, TYPE_DESKTOP)).toBe(desktop);
    expect(sl.getLink(profile, profileId, TYPE_MOBILE)).toBe(mobile);

    expect(sl.sanitize(profile, desktop)).toBe(desktop);
    expect(sl.sanitize(profile, desktop, TYPE_DESKTOP)).toBe(desktop);
    expect(sl.sanitize(profile, mobile, TYPE_MOBILE)).toBe(mobile);
    expect(sl.sanitize(profile, company, TYPE_DESKTOP)).toBe(desktop);
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

  it('should linkedin', () => {
    const profile = 'linkedin';
    const profileId = 'gkucmierz';
    const desktop = `https://linkedin.com/in/${profileId}`;
    const mobile = `https://linkedin.com/mwlite/in/${profileId}`;
    const company = `https://linkedin.com/company/${profileId}`;
    testProfile(profile, profileId, desktop, mobile, company);
  });

  it('should accept localized urls', () => {
    const profile = 'linkedin';
    expect(sl.isValid(profile, 'https://de.linkedin.com/in/anton-begehr/')).toBeTruthy();
    expect(sl.isValid(profile, 'https://de.linkedin.com/mwlite/in/anton-begehr/')).toBeTruthy();
    expect(sl.sanitize(profile, 'https://de.linkedin.com/in/anton-begehr/')).toBe('https://linkedin.com/in/anton-begehr');
    expect(sl.sanitize(profile, 'https://de.linkedin.com/mwlite/in/anton-begehr/', TYPE_MOBILE)).toBe('https://linkedin.com/mwlite/in/anton-begehr');
  });

  it('should capture a profile id that contains percent encoded characters', () => {
    const profile = 'linkedin';
    const profileId = 'gk%5Fucmierz';
    const companyUrlBase = `https://linkedin.com/company/${profileId}`;
    expect(sl.isValid(profile, companyUrlBase)).toBeTruthy()
    expect(sl.getProfileId(profile, companyUrlBase)).toBe(profileId)
   })
});
