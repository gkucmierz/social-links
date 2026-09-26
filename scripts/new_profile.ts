import fs from 'fs';
import path from 'path';

const DIR = __dirname;
const EXAMPLE_PROFILE = path.join(DIR, 'example_profile.ts.template');
const EXAMPLE_SPEC_PROFILE = path.join(DIR, 'example_profile.spec.ts.template');
const DESTINATION_DIR = path.join(DIR, '..', 'src', 'profiles');
const PACKAGE_JSON = path.join(DIR, '..', 'package.json');
const PROFILES_DIR = path.join(DIR, '..', 'src', 'profiles');
const INDEX_FILE_NAME = 'index.ts';
const IMPORT_PROFILES_FILE = path.join(PROFILES_DIR, INDEX_FILE_NAME);
const SPEC_FILE_EXTENSION = '.spec.ts';
const PROFILE_NAME_REGEX = /^[a-z0-9_]{1,49}$/;

const createFileFromTpl = (profile: string, source: string, dest: string) => {
  const tpl = fs.readFileSync(source, 'utf8');
  const tsFile = tpl.replace(/%%profile%%/g, profile);
  fs.writeFileSync(path.join(DESTINATION_DIR, dest), tsFile);
};

const createImportProfilesFile = () => {
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
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
  const keywords = Array.from(new Set([...(pkg.keywords || []), profile])).sort();
  pkg.keywords = keywords;
  fs.writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2) + '\n');
};

const addProfile = (profile: string) => {
  if (!PROFILE_NAME_REGEX.test(profile)) {
    throw new Error(`Profile name should be lowercased string matching ${PROFILE_NAME_REGEX} (1-50 characters)`);
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
  console.log('\nAdd new Profile:\n  $ npm run new <profile>\n');
};

const args = process.argv.slice(2);
const profiles = args.filter((a) => !a.startsWith('-'));

if (profiles.length > 0 && !args.includes('-h') && !args.includes('--help')) {
  profiles.forEach((profile: string) => addProfile(profile));
} else {
  showHelp();
}
