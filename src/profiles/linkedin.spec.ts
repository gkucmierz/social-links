
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: linkedin', () => {
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

  it('should linkedin', () => {
    const profile = 'linkedin';
    const profileId = 'gkucmierz';
    const desktop = `https://linkedin.com/in/${profileId}`;
    const mobile = `https://linkedin.com/mwlite/in/${profileId}`;
    testProfile(profile, profileId, desktop, mobile);
  });

  it('should accept localized urls', () => {
    const profile = 'linkedin';
    expect(sl.isValid(profile, 'https://de.linkedin.com/in/anton-begehr/')).toBeTruthy();
    expect(sl.isValid(profile, 'https://de.linkedin.com/mwlite/in/anton-begehr/')).toBeTruthy();
    expect(sl.sanitize(profile, 'https://de.linkedin.com/in/anton-begehr/')).toBe('https://linkedin.com/in/anton-begehr');
    expect(sl.sanitize(profile, 'https://de.linkedin.com/mwlite/in/anton-begehr/', TYPE_MOBILE)).toBe('https://linkedin.com/mwlite/in/anton-begehr');
  });

  it('should support company profiles', () => {
    const profile = 'linkedin';
    const profileId = 'gkucmierz';
    const company = `https://linkedin.com/company/${profileId}`;
    expect(sl.isValid(profile, company)).toBeTruthy();
    expect(sl.isValid(profile, `https://www.linkedin.com/company/${profileId}/`)).toBeTruthy();
    expect(sl.getProfileId(profile, company)).toBe(profileId);
    expect(sl.sanitize(profile, company)).toBe(company);
    expect(sl.sanitize(profile, company, TYPE_DESKTOP)).toBe(`https://linkedin.com/in/${profileId}`);
  });

  it('should capture a profile id that contains percent encoded characters', () => {
    const profile = 'linkedin';
    const profileId = 'gk%5Fucmierz';
    const company = `https://linkedin.com/company/${profileId}`;
    expect(sl.isValid(profile, company)).toBeTruthy();
    expect(sl.getProfileId(profile, company)).toBe(profileId);

    const encodedUser = 'hugo-ben%C3%ADcio-11666815';
    const encodedUrl = `https://www.linkedin.com/in/${encodedUser}`;
    expect(sl.isValid(profile, encodedUrl)).toBeTruthy();
    expect(sl.getProfileId(profile, encodedUrl)).toBe(encodedUser);
  });

  it('should support special characters, diacritics and cyrillic', () => {
    const profile = 'linkedin';

    const latinId = 'hugo-benício-11666815';
    const latinUrl = `https://www.linkedin.com/in/${latinId}`;
    expect(sl.isValid(profile, latinUrl)).toBeTruthy();
    expect(sl.getProfileId(profile, latinUrl)).toBe(latinId);
    expect(sl.sanitize(profile, latinUrl)).toBe(`https://linkedin.com/in/${latinId}`);

    const cyrillicId = 'альмир-давлетов-21b3a5180';
    const cyrillicUrl = `https://www.linkedin.com/in/${cyrillicId}`;
    expect(sl.isValid(profile, cyrillicUrl)).toBeTruthy();
    expect(sl.getProfileId(profile, cyrillicUrl)).toBe(cyrillicId);
    expect(sl.sanitize(profile, cyrillicUrl)).toBe(`https://linkedin.com/in/${cyrillicId}`);

    expect(sl.isValid(profile, 'https://www.linkedin.com/in/jösé-test')).toBeTruthy();
  });
});
