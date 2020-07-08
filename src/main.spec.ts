
import { SocialLinks } from './main';

describe('SocialLinks', () => {
  let sl: SocialLinks;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  describe('constants', () => {
    it('should be defined DESKTOP', () => {
      expect(SocialLinks.DESKTOP).toBeDefined();
    });

    it('should be defined MOBILE', () => {
      expect(SocialLinks.MOBILE).toBeDefined();
    });

    it('should be distnict', () => {
      expect(SocialLinks.MOBILE).not.toEqual(SocialLinks.DESKTOP);
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

  describe('sanitize', () => {
    it('should work with http', () => {
      expect(sl.sanitize('linkedin', 'http://www.linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with https', () => {
      expect(sl.sanitize('linkedin', 'https://www.linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with http, no-www', () => {
      expect(sl.sanitize('linkedin', 'http://linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with https, no-www', () => {
      expect(sl.sanitize('linkedin', 'https://linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with no-protocol', () => {
      expect(sl.sanitize('linkedin', 'www.linkedin.com/in/gkucmierz')).toBe('gkucmierz');
    });

    it('should work with only id', () => {
      expect(sl.sanitize('linkedin', 'gkucmierz')).toBe('gkucmierz');
    });
  });

  xdescribe('getLink', () => {
    it('should create default DESKTOP link', () => {
      expect(sl.getLink('linkedin', 'gkucmierz')).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should create DESKTOP link', () => {
      expect(sl.getLink('linkedin', 'gkucmierz')).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should create MOBILE link', () => {
      expect(sl.getLink('linkedin', 'gkucmierz')).toBe('https://linkedin.com/mwlite/in/gkucmierz');
    });
  });

});
