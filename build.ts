import * as fs from 'fs';
import * as proc from 'child_process';

const runTypeScriptBuild = () => {
  proc.spawnSync('yarn', ['tsc']);
}

// we don't want release package.json to contain dev related stuff
const generatePackageJson = () => {
  const EXCLUDE = new Set(['jestSonar', 'devDependencies', 'scripts', 'files']);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packageJson: Record<string, any> = JSON.parse(
    fs.readFileSync(`${process.cwd()}/package.json`).toString()
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPackageJson: Record<string, any> = {};
  Object.keys(packageJson).forEach((key) => {
    if (!EXCLUDE.has(key)) {
      newPackageJson[key] = packageJson[key];
    }
  });
  fs.writeFileSync(
    `${process.cwd()}/dist/package.json`,
    JSON.stringify(newPackageJson, null, 2)
  );
}

runTypeScriptBuild();
generatePackageJson();
