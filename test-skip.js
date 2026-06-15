const { test } = require('@playwright/test');
test.describe('Test', () => {
  test.skip((args, testInfo) => testInfo.project.name !== 'Desktop', 'Skip');
});
