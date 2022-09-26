
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE, Profile } from './main';

describe('SocialLinks', () => {
  let sl: SocialLinks;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  describe('constants', () => {
    it('should be defined TYPE_DESKTOP', () => {
      expect(TYPE_DESKTOP).toBeDefined();
    });

    it('should be defined TYPE_MOBILE', () => {
      expect(TYPE_MOBILE).toBeDefined();
    });

    it('should be distnict', () => {
      expect(TYPE_MOBILE).not.toEqual(TYPE_DESKTOP);
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
      expect(sl.getLink('linkedin', 'gkucmierz', TYPE_DESKTOP)).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should create TYPE_MOBILE link', () => {
      expect(sl.getLink('linkedin', 'gkucmierz', TYPE_MOBILE)).toBe('https://linkedin.com/mwlite/in/gkucmierz');
    });
  });

  describe('sanitize', () => {
    it('should sanitize link https, www', () => {
      const sanitized = sl.sanitize('linkedin', 'https://www.linkedin.com/in/gkucmierz');
      expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should sanitize link https', () => {
      const sanitized = sl.sanitize('linkedin', 'https://linkedin.com/in/gkucmierz');
      expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should sanitize link http', () => {
      const sanitized = sl.sanitize('linkedin', 'http://linkedin.com/in/gkucmierz');
      expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should sanitize link www', () => {
      const sanitized = sl.sanitize('linkedin', 'www.linkedin.com/in/gkucmierz');
      expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should sanitize link', () => {
      const sanitized = sl.sanitize('linkedin', 'linkedin.com/in/gkucmierz');
      expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should sanitize link as mobile', () => {
      const sanitized = sl.sanitize('linkedin', 'linkedin.com/in/gkucmierz', TYPE_MOBILE);
      expect(sanitized).toBe('https://linkedin.com/mwlite/in/gkucmierz');
    });

    it('should sanitize mobile link as mobile', () => {
      const sanitized = sl.sanitize('linkedin', 'linkedin.com/mwlite/in/gkucmierz');
      expect(sanitized).toBe('https://linkedin.com/mwlite/in/gkucmierz');
    });

    it('should sanitize mobile link as desktop', () => {
      const sanitized = sl.sanitize('linkedin', 'linkedin.com/mwlite/in/gkucmierz', TYPE_DESKTOP);
      expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should sanitize link with slash at end', () => {
      const sanitized = sl.sanitize('linkedin', 'linkedin.com/in/gkucmierz/');
      expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should sanitize only profile id', () => {
      const sanitized = sl.sanitize('linkedin', 'gkucmierz');
      expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
    });

    it('should sanitize only profile id as mobile', () => {
      const sanitized = sl.sanitize('linkedin', 'gkucmierz', TYPE_MOBILE);
      expect(sanitized).toBe('https://linkedin.com/mwlite/in/gkucmierz');
    });
  });

  describe('getProfileNames', () => {
    it('should correctly return profiles names', () => {
      sl = new SocialLinks({ usePredefinedProfiles: false });
      const testProfile = 'test_profile';
      expect(sl.getProfileNames()).toStrictEqual([]);
      sl.addProfile(testProfile, []);
      expect(sl.getProfileNames()).toStrictEqual([testProfile]);
    });
  });

  describe('config', () => {
    describe('usePredefinedProfiles', () => {
      it('should set usePredefinedProfiles = true', () => {
        sl = new SocialLinks({ usePredefinedProfiles: true });
        expect(sl.getLink('linkedin', 'gkucmierz')).toBe('https://linkedin.com/in/gkucmierz');
      });

      it('should set usePredefinedProfiles = false', () => {
        sl = new SocialLinks({ usePredefinedProfiles: false });
        expect(() => sl.getLink('linkedin', 'gkucmierz')).toThrowError();
      });
    });

    describe('trimInput', () => {
      it('should set trimInput as default', () => {
        sl = new SocialLinks();
        const whitespace = [' ', '\t', '\n'].join('');
        expect(sl.isValid('linkedin', `${whitespace}http://www.linkedin.com/in/gkucmierz${whitespace}`)).toBeTruthy();
      });

      it('should trim isValid', () => {
        sl = new SocialLinks({ trimInput: true });
        const whitespace = [' ', '\t', '\n'].join('');
        expect(sl.isValid('linkedin', `${whitespace}http://www.linkedin.com/in/gkucmierz${whitespace}`)).toBeTruthy();
      });

      it('should not trim isValid', () => {
        sl = new SocialLinks({ trimInput: false });
        const whitespace = [' ', '\t', '\n'].join('');
        expect(sl.isValid('linkedin', `${whitespace}http://www.linkedin.com/in/gkucmierz${whitespace}`)).toBeFalsy();
      });
    });

    describe('allowQueryParams', () => {
      it('should not allowQueryParams as default', () => {
        const params = '?param=123&param2=abc';
        expect(sl.isValid('linkedin', `http://www.linkedin.com/in/gkucmierz${params}`)).toBeFalsy();
      });

      it('should allowQueryParams in link', () => {
        sl = new SocialLinks({ allowQueryParams: true });
        const params = '?param=123&param2=abc';
        expect(sl.isValid('linkedin', `http://www.linkedin.com/in/gkucmierz${params}`)).toBeTruthy();
      });

      it('should not allowQueryParams in link', () => {
        sl = new SocialLinks({ allowQueryParams: false });
        const params = '?param=123&param2=abc';
        expect(sl.isValid('linkedin', `http://www.linkedin.com/in/gkucmierz${params}`)).toBeFalsy();
      });

      it('should sanitize query params with allowQueryParams = true', () => {
        sl = new SocialLinks({ allowQueryParams: true });
        const params = '?param=123&param2=abc';
        const sanitized = sl.sanitize('linkedin', `http://www.linkedin.com/in/gkucmierz${params}`);
        expect(sanitized).toBe('https://linkedin.com/in/gkucmierz');
      });

      it('should not sanitize query params with allowQueryParams = false', () => {
        sl = new SocialLinks({ allowQueryParams: false });
        const params = '?param=123&param2=abc';
        expect(() => sl.sanitize('linkedin', `http://www.linkedin.com/in/gkucmierz${params}`)).toThrowError();
      });

      it('should not use allowQueryParams when only profileId is provided', () => {
        sl = new SocialLinks({ allowQueryParams: true });
        const params = '?param=123&param2=abc';
        expect(() => sl.sanitize('linkedin', `gkucmierz${params}`)).toThrowError();
      });
    });
  });

  describe('profiles', () => {
    it('should clean profiles', () => {
      sl = new SocialLinks({ usePredefinedProfiles: false });
      expect(() => sl.getLink('linkedin', 'gkucmierz')).toThrowError();
    });

    it('should add profile', () => {
      const name = 'test';
      sl.addProfile(name, [{ match: '(.{3})', group: 1, pattern: '-{PROFILE_ID}-' }]);
      expect(sl.isValid(name, '123')).toBeTruthy();
      expect(sl.sanitize(name, '123')).toBe('-123-');
    });
  });

  describe('detectProfile', () => {
    it('should detect github profiles', () => {
      expect(sl.detectProfile('https://github.com/gkucmierz')).toEqual('github');
      expect(sl.detectProfile('http://github.com/abc')).toEqual('github');
      expect(sl.detectProfile('github.com/abc')).toEqual('github');
      expect(sl.detectProfile('www.github.com/gkucmierz')).toEqual('github');
    });

    it('should detect different profiles', () => {
      expect(sl.detectProfile('https://exercism.io/profiles/gkucmierz')).toEqual('exercism');
      expect(sl.detectProfile('https://dev.to/gkucmierz')).toEqual('dev_to');
      expect(sl.detectProfile('https://youtube.com/channel/gkucmierz')).toEqual('youtube');
      expect(sl.detectProfile('https://linkedin.com/in/gkucmierz')).toEqual('linkedin');
      expect(sl.detectProfile('https://medium.com/@gkucmierz')).toEqual('medium');
    });

    it('should return empty string if no match', () => {
      expect(sl.detectProfile('https://www.codewars.com/kata/my-languages')).toEqual('');
      expect(sl.detectProfile('')).toEqual('');
    });
  });

});
