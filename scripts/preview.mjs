import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('.preview',{recursive:true});
const browser = await chromium.launch({channel:'msedge',headless:true});
for(const [name,width,height,path] of [['home-desktop',1440,1000,'/'],['home-mobile',390,844,'/'],['gallery-mobile',390,844,'/projects.html'],['contact-desktop',1440,1000,'/contact.html'],['service-mobile',390,844,'/services/renovation.html']]) {
  const page = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4173'+path);
  for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=height) { await page.evaluate(y=>scrollTo(0,y),y); await page.waitForTimeout(80); }
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
  await page.screenshot({path:`.preview/${name}.png`,fullPage:true});
  if(name==='home-desktop') await page.screenshot({path:'.preview/hero-desktop.png'});
  console.log(`${name}: ${await page.evaluate(()=>[...document.images].filter(i=>i.hasAttribute('src') && !i.naturalWidth).length)} broken images`);
  await page.close();
}
await browser.close();
