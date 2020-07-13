
import { SocialLinks } from './main';

describe('SocialLinks', () => {
  let sl: SocialLinks;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  describe('constants', () => {
    it('should be defined DESKTOP', () => {
      expect(SocialLinks.TYPE_DESKTOP).toBeDefined();
    });

    it('should be defined MOBILE', () => {
      expect(SocialLinks.TYPE_MOBILE).toBeDefined();
    });

    it('should be distnict', () => {
      expect(SocialLinks.TYPE_MOBILE).not.toEqual(SocialLinks.TYPE_DESKTOP);
    });
  });

  describe('isValid', () => {
    it('should be valid http', () => {
      expect(sl.isValid('linkedin', 'http://www.linkedin.com/in/gkucmierz')).toBe(true);
    });

    it('should be valid https', () => {
      expect(sl.isValid('linkedin', 'https://www.linkedin.com/in/gkucmierz')).toBe(true);
    });

    it('should be valid http, no-www', () => {
      expect(sl.isValid('linkedin', 'http://linkedin.com/in/gkucmierz')).toBe(true);
    });

    it('should be valid https, no-www', () => {
      expect(sl.isValid('linkedin', 'https://linkedin.com/in/gkucmierz')).toBe(true);
    });

    it('should be valid no-protocol', () => {
      expect(sl.isValid('linkedin', 'www.linkedin.com/in/gkucmierz')).toBe(true);
    });

    it('should be valid no-protocol, no-www', () => {
      expect(sl.isValid('linkedin', 'linkedin.com/in/gkucmierz')).toBe(true);
    });

    it('should be valid only id', () => {
      expect(sl.isValid('linkedin', 'gkucmierz')).toBe(true);
    });
  });

  describe('getProfileId', () => {
    it('should work with http', () => {
      expect(sl.getProfileId('linkedin', 'http://www.linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with https', () => {
      expect(sl.getProfileId('linkedin', 'https://www.linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with http, no-www', () => {
      expect(sl.getProfileId('linkedin', 'http://linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with https, no-www', () => {
      expect(sl.getProfileId('linkedin', 'https://linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with no-protocol', () => {
      expect(sl.getProfileId('linkedin', 'www.linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with only id', () => {
      expect(sl.getProfileId('linkedin', 'gkucmierz')).toBe('gkucmierz');
    });
  });

  describe('getLink', () => {
    it('should create default TYPE_DESKTOP link', () => {
      expect(sl.getLink('linkedin', 'gkucmierz')).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should create TYPE_DESKTOP link', () => {
      expect(sl.getLink('linkedin', 'gkucmierz', SocialLinks.TYPE_DESKTOP)).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should create TYPE_MOBILE link', () => {
      expect(sl.getLink('linkedin', 'gkucmierz', SocialLinks.TYPE_MOBILE)).toBe('https://linkedin.com/mwlite/in/gkucmierz');
    });
  });

});
