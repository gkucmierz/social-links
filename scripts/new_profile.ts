
const path = (...args: string[]) => args.join('/');
const DIR = __dirname;
const EXAMPLE_PROFILE = path(DIR, 'example_profile.ts.template');
const EXAMPLE_SPEC_PROFILE = path(DIR, 'example_profile.spec.ts.template');
const DESTINATION_DIR = path(DIR, '..', 'src', 'profiles');
const PACKAGE_JSON = path(DIR, '..', 'package.json');
const PROFILES_DIR = path(DIR, '..', 'src', 'profiles');
const INDEX_FILE_NAME = 'index.ts';
const IMPORT_PROFILES_FILE = path(PROFILES_DIR, INDEX_FILE_NAME);
const SPEC_FILE_EXTENSION = '.spec.ts';
const PROFILE_NAME_REGEX = /^[a-z][a-z0-9_]{1,49}$/;

const createFileFromTpl = (profile: string, source: string, dest: string) => {
  const fs = require('fs');
  const tpl = fs.readFileSync(source).toString();
  const tsFile = tpl.replace(/%%profile%%/g, profile);
  fs.writeFileSync(path(DESTINATION_DIR, `${dest}`), tsFile);
};

const createImportProfilesFile = () => {
  const fs = require('fs');
  const files = fs.readdirSync(PROFILES_DIR)
    .filter((name: string) => !name.endsWith(SPEC_FILE_EXTENSION))
    .filter((name: string) => name !== INDEX_FILE_NAME)
    .map((file: string) => file.split('.').shift());

  const nl = '\n';
  const outputFile = [
    '',
    `import { Profile } from '../main';`,
    '',
    files.map((name: string) => `import { ${name} } from './${name}';`).join('\n'),
    '',
    `export const PREDEFINED_PROFILES: Profile[] = [`,
    files.map((name: string) => `  ${name},`).join(nl),
    `];`,
    '',
  ].join(nl);

  fs.writeFileSync(IMPORT_PROFILES_FILE, outputFile);
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
  if (!PROFILE_NAME_REGEX.test(profile)) {
    throw new Error(`Profile name should be lowercased string matching ${PROFILE_NAME_REGEX} (2-50 characters)`);
  }
  createFileFromTpl(profile, EXAMPLE_PROFILE, `${profile}.ts`);
  createFileFromTpl(profile, EXAMPLE_SPEC_PROFILE, `${profile}.spec.ts`);
  addPackageKeyword(profile);
  createImportProfilesFile();
  console.log(`modified: package.json`);
  console.log(`modified: src/profiles/index.ts`);
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
