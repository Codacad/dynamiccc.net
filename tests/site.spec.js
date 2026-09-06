const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const files = ['index.html','about.html','services.html','projects.html','contact.html','privacy.html', ...fs.readdirSync('services').map(f => `services/${f}`)];
test('all public pages render with valid assets, navigation and accessible structure', async ({ page, request }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const checked = new Set();
  for(const file of files) {
    await page.goto('/'+file);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('body').innerText(), `${file}: text encoding`).not.toMatch(/Ã|â€|â†|�/);
    for(const ref of await page.locator('a[href],img[src],link[rel="stylesheet"],script[src]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href') || n.getAttribute('src')))) {
      if(!ref.startsWith('/') || checked.has(ref)) continue;
      checked.add(ref);
      const response = await request.get(ref);
      expect(response.ok(), `${file}: ${ref}`).toBeTruthy();
    }
    const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(result.violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})), file).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test('mobile pages fit the viewport and navigation supports keyboard dismissal', async ({page}) => {
  for(const width of [320,375,768]) {
    await page.setViewportSize({width,height:812});
    for(const file of files) {
      await page.goto('/'+file);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${file} at ${width}px`).toBeTruthy();
    }
  }
  await page.goto('/');
  const toggle = page.getByRole('button',{name:'Open navigation'});
  await toggle.click();
  await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await toggle.click();
  await page.getByRole('navigation').getByRole('link',{name:'Our work',exact:true}).click();
  await expect(page).toHaveURL(/projects.html/);
});
test('gallery filters and modal navigation work together', async ({page}) => {
  await page.goto('/projects.html');
  await page.getByRole('button',{name:'Civil works',exact:true}).click();
  await expect(page.locator('.gallery-grid .work-card:visible')).toHaveCount(2);
  await expect(page.locator('#gallery-count')).toHaveText('2 photographs');
  const first = page.getByRole('button',{name:'Enlarge: The foundations of every build'});
  await first.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#lightbox-count')).toHaveText('1 / 2');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#lightbox-title')).toHaveText('Preparation at ground level');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(first).toBeFocused();
  await page.getByRole('button',{name:'All work'}).click();
  await expect(page.locator('.gallery-grid .work-card:visible')).toHaveCount(7);
});
test('enquiry requires valid details and prepares an accurate unsent draft', async ({page}) => {
  await page.goto('/contact.html?service=electrical#enquiry');
  await expect(page.getByLabel('Service of interest')).toHaveValue('electrical');
  await page.getByRole('button',{name:'Prepare enquiry email'}).click();
  await expect(page.locator('#email-preview')).toBeHidden();
  await page.getByLabel('Full name').fill('Test Client');
  await page.getByLabel('Email address').fill('client@example.com');
  await page.getByLabel('Tell us about your project').fill('We need electrical upgrades at our Riyadh facility.');
  await page.getByRole('button',{name:'Prepare enquiry email'}).click();
  await expect(page.locator('#draft-text')).toHaveValue(/Test Client/);
  await expect(page.locator('#form-status')).toContainText('Nothing has been sent yet');
  const href = await page.locator('#send-email').getAttribute('href');
  expect(decodeURIComponent(href)).toContain('We need electrical upgrades at our Riyadh facility.');
  await page.getByLabel('Full name').fill('Updated Client');
  await expect(page.locator('#email-preview')).toBeHidden();
});
test('content remains available without JavaScript', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled:false});
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('.service-card')).toHaveCount(6);
  await expect(page.locator('.service-card').first()).toBeVisible();
  await page.setViewportSize({width:375,height:812});
  await expect(page.getByRole('navigation').getByRole('link',{name:'Company',exact:true})).toBeVisible();
  await page.goto('http://127.0.0.1:4173/contact.html');
  await expect(page.locator('#enquiry-form')).toBeHidden();
  await context.close();
});
