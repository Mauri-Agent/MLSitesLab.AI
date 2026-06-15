const { execSync } = require('child_process');
try {
  execSync('npx playwright test e2e/test-skip-beforeall2.spec.ts');
} catch (e) {
  console.log('tests failed');
}
const fs = require('fs');
if (fs.existsSync('test-skip-beforeall2.log')) {
  console.log('LOG:', fs.readFileSync('test-skip-beforeall2.log', 'utf8'));
} else {
  console.log('No log');
}
