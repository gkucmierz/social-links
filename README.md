# Social Links

Social Links is helping to validate and sanitize social (desktop & mobile) links

### Install
```bash
npm i social-links --save
```

### Using
```js
import { SocialLinks, TYPE_MOBILE } from 'social-links';
const socialLinks = new SocialLinks();

const link = 'http://www.linkedin.com/in/gkucmierz';
console.log(socialLinks.isValid('linkedin', link)); // true

console.log(socialLinks.sanitize('linkedin', link)); // 'https://linkedin.com/in/gkucmierz'

console.log(socialLinks.sanitize('linkedin', link, TYPE_MOBILE)); // 'https://linkedin.com/mwlite/in/gkucmierz'
```

Above examples works based on predefined **linkedin** profile:
```js
import { Profile } from 'social-links';
const linkedinProfile: Profile =
{ name: 'linkedin',
    matches: [
      {
        match: '(https?://)?(www.)?linkedin.com/in/({PROFILE_ID})', group: 3, type: TYPE_DESKTOP,
        pattern: 'https://linkedin.com/in/{PROFILE_ID}'
      },
      {
        match: '(https?://)?(www.)?linkedin.com/mwlite/in/({PROFILE_ID})', group: 3, type: TYPE_MOBILE,
        pattern: 'https://linkedin.com/mwlite/in/{PROFILE_ID}'
      },
      { match: '({PROFILE_ID})', group: 1 },
    ]
};
```

### Add new profile
```js
import { SocialLinks, Profile } from 'social-links';

const socialLinks = new SocialLinks();
const profile: Profile = { ... };

socialLinks.addProfile('profileName', profile);
```

### Tests

Watch, *tsc* build & *jest* tests
```bash
npm run start
```

Just *jest* tests
```bash
npm run test
```
or
```bash
npm run test:watch
```
