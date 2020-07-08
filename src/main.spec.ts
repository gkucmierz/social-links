
import { SocialLinks } from './main';

describe('SocialLinks', () => {
  let socialLinks: SocialLinks;

  beforeEach(() => {
    socialLinks = new SocialLinks();
  });

  it('should hello', () => {
    expect(socialLinks.hello()).toEqual('world');
  });
});
