
const path = (...args: string[]) => args.join('/');
const DIR = __dirname;
const EXAMPLE_PROFILE = path(DIR, 'example_profile.ts.template');
const EXAMPLE_SPEC_PROFILE = path(DIR, 'example_profile.spec.ts.template');
const DESTINATION_DIR = path(DIR, '..', 'src', 'profiles');
const PACKAGE_JSON = path(DIR, '..', 'package.json');

const createFileFromTpl = (profile: string, source: string, dest: string) => {
  const fs = require('fs');
  const tpl = fs.readFileSync(source).toString();
  const tsFile = tpl.replace(/%%profile%%/g, profile);
  fs.writeFileSync(path(DESTINATION_DIR, `${dest}`), tsFile);
};

const addPackageKeyword = (profile: string) => {
  const fs = require('fs');
  const editJsonFile = require('edit-json-file');
  const file = editJsonFile(PACKAGE_JSON);
  const keywords: Set<string> = new Set([...file.get('keywords') as string[], profile].sort());
  [...keywords].map((keyword, i) => file.set('keywords.' + i, keyword));
  file.save();
};

const addProfile = (profile: string) => {
  if (!profile.match(/^[a-z][a-z0-9]{2,49}$/)) throw new Error('Profile name should be lowercased string matching /^[a-z][a-z0-9]{2,49}$/')
  createFileFromTpl(profile, EXAMPLE_PROFILE, `${profile}.ts`);
  createFileFromTpl(profile, EXAMPLE_SPEC_PROFILE, `${profile}.spec.ts`);
  addPackageKeyword(profile);
  console.log(`modified: package.json`);
  console.log(`   added: src/profiles/${profile}.ts`);
  console.log(`   added: src/profiles/${profile}.spec.ts`);
};

const showHelp = () => {
  const commandLineUsage = require('command-line-usage');

  const optionDefinitions = [
    {
      name: 'help',
      description: 'Display this usage guide.',
      alias: 'h',
      type: Boolean
    },
  ];

  const sections = [
    {
      header: 'Add new Profile',
      content: '$ npm run new <profile>',
    },
    // {
    //   header: 'Options',
    //   optionList: optionDefinitions
    // },
  ];

  const usage = commandLineUsage(sections);
  console.log(usage);
};

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'profiles', type: String, multiple: true, defaultOption: true },
];

const options = commandLineArgs(optionDefinitions);

const { profiles } = options;
if (profiles) {
  profiles.map((profile: string) => addProfile(profile));
} else {
  showHelp();
}
