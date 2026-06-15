import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

test.describe.configure({ mode: 'serial' });

test.describe('Build Reliability', () => {
  let buildOutput = '';
  let buildStatus = 0;
  let buildExecuted = false;

  test.beforeEach(({ browserName }, testInfo) => {
    if (browserName !== 'chromium' || testInfo.project.name !== 'Desktop') {
      test.skip();
    }

    if (!buildExecuted) {
      test.setTimeout(60000);
      try {
        buildOutput = execSync('npm run build', { encoding: 'utf-8', stdio: 'pipe' });
        buildStatus = 0;
      } catch (error) {
        const err = error as { stdout?: string; message?: string; status?: number };
        buildOutput = err.stdout?.toString() || err.message || '';
        buildStatus = err.status || 1;
      }
      buildExecuted = true;
    }
  });

  // Test 1: npm run build exits with code 0.
  test('npm run build exits with code 0', () => {
    expect(buildStatus).toBe(0);
  });

  // Test 2: Output contains no TypeScript errors.
  test('Output contains no TypeScript errors', () => {
    expect(buildOutput).not.toMatch(/error TS/);
  });

  // Test 3: dist/ directory is created.
  test('dist/ directory is created', () => {
    const distPath = path.resolve(process.cwd(), 'dist');
    expect(fs.existsSync(distPath)).toBeTruthy();
    expect(fs.statSync(distPath).isDirectory()).toBeTruthy();
  });

  // Test 4: dist/index.html is generated.
  test('dist/index.html is generated', () => {
    const indexPath = path.resolve(process.cwd(), 'dist/index.html');
    expect(fs.existsSync(indexPath)).toBeTruthy();
    expect(fs.statSync(indexPath).isFile()).toBeTruthy();
  });

  // Test 5: dist/assets/ is populated with .js and .css files.
  test('dist/assets/ directory is populated with JS/CSS files', () => {
    const assetsPath = path.resolve(process.cwd(), 'dist/assets');
    expect(fs.existsSync(assetsPath)).toBeTruthy();
    
    const files = fs.readdirSync(assetsPath);
    const hasJS = files.some(file => file.endsWith('.js'));
    const hasCSS = files.some(file => file.endsWith('.css'));
    
    expect(hasJS).toBeTruthy();
    expect(hasCSS).toBeTruthy();
  });
});
