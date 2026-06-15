const { execSync } = require('child_process');
try {
  execSync('npx playwright test e2e/test-skip-beforeall.spec.ts', { stdio: 'inherit' });
} catch (e) {}
