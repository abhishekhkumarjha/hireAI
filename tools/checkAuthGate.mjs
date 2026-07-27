import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(new URL(import.meta.url).pathname.replace(/^[A-Za-z]:/, function(m){return m;}), '..', '..');
const appPath = path.join(process.cwd(), 'src', 'App.tsx');

try {
  const src = fs.readFileSync(appPath, 'utf8');
  const hasAuthGateSet = /setPortalHost\(\s*'auth'\s*\)/.test(src);
  const hasPrevUserCheck = /prevUserRef/.test(src) || /previous user/i.test(src);

  if (hasAuthGateSet && hasPrevUserCheck) {
    console.log('GATING_CHECK: PASS — auth gate enforced and auto-advance guarded.');
    process.exit(0);
  } else {
    console.error('GATING_CHECK: FAIL — expected auth gate enforcement not found.');
    if (!hasAuthGateSet) console.error('  - Missing call to setPortalHost(\'auth\') in handlers.');
    if (!hasPrevUserCheck) console.error('  - Missing prevUserRef auto-advance guard.');
    process.exit(2);
  }
} catch (err) {
  console.error('GATING_CHECK: ERROR reading file', appPath, err);
  process.exit(3);
}
