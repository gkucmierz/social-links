
import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from '../main';

describe('PROFILE: lemmy_world', () => {
  let sl: SocialLinks;
  const profile = 'lemmy_world';
  const profileId = 'gkucmierz';
  const desktop = `https://lemmy.world/u/${profileId}`;

  beforeEach(() => {
    sl = new SocialLinks();
  });

  it('should lemmy_world basics', () => {
    expect(sl.hasProfile(profile)).toBeTruthy();
    expect(sl.isValid(profile, desktop)).toBeTruthy();
    expect(sl.getProfileId(profile, desktop)).toBe(profileId);
    expect(sl.getLink(profile, profileId)).toBe(desktop);
    expect(sl.getLink(profile, profileId, TYPE_DESKTOP)).toBe(desktop);
  });

  it('should lemmy_world valid wariations', () => {
    expect(sl.isValid(profile, `https://lemmy.world/u/${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `http://lemmy.world/u/${profileId}`)).toBeTruthy();
    expect(sl.isValid(profile, `lemmy.world/u/${profileId}/`)).toBeTruthy();
    expect(sl.isValid(profile, `http://lemmy.world/u/${profileId}/`)).toBeTruthy();
  });

  it('should not lemmy_world invalid wariations', () => {
    expect(sl.isValid(profile, `www.lemmy.world/u/${profileId}`)).toBeFalsy();
    expect(sl.isValid(profile, `http://www.lemmy.world/u/${profileId}`)).toBeFalsy();
  });
});
