const { test } = require('@playwright/test');
test.beforeAll(async ({ browserName }) => {
  console.log(browserName);
});
