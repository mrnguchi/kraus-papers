import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=process.env.TEST_URL||'http://localhost:3000';
const browser=await chromium.launch({headless:true});
await mkdir('tests/screenshots',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:375,height:812}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{window.revealAnimations=0;const animate=Element.prototype.animate;Element.prototype.animate=function(...args){if(args[0]?.some?.(frame=>frame.translate))window.revealAnimations++;return animate.apply(this,args);};});
 await page.goto(base+'/');
 await page.locator('.about__copy').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>window.revealAnimations>0);
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'smooth');
 for(const width of [320,375,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const path of ['/','/printing-paper.php','/product-details.php?id=thermal-paper-rolls','/contact.php?product=Clear+Tape','/terms-and-conditions.php','/guides/thermal-paper-roll-size.php']){
   await page.goto(base+path);await page.locator('h1').waitFor();
   const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(size.scroll<=size.viewport+1,`${width} ${path} overflows: ${size.scroll}`);
  }
 }
 await page.setViewportSize({width:375,height:812});
 await page.goto(base+'/terms-and-conditions.php');
 await page.screenshot({path:'tests/screenshots/legal-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Menu',exact:true}).click();
 assert.equal(await page.locator('#primary-navigation').evaluate(e=>e.classList.contains('is-open')),true);
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#primary-navigation').evaluate(e=>e.classList.contains('is-open')),false);
 await page.goto(base+'/printing-paper.php');
 assert.equal(await page.locator('.product-card:visible').count(),8);
 await page.getByRole('button',{name:'View More'}).click();assert.equal(await page.locator('.product-card:visible').count(),11);
 await page.getByLabel('Filter products').selectOption('coloured-paper');
 assert.equal(await page.locator('.product-card:visible').count(),2);
 await page.screenshot({path:'tests/screenshots/products-mobile.png',fullPage:true});
 await page.goto(base+'/contact.php?product=Clear+Tape');
 await page.getByRole('button',{name:'Send',exact:true}).waitFor();
 await page.getByLabel('Name',{exact:true}).fill('Test Buyer');
 await page.getByLabel('Email',{exact:true}).fill('buyer@example.test');
 await page.getByLabel('Message',{exact:true}).fill('Please quote tape.');
 let sends=0;
 await page.route('**/api/contact',async route=>{
  if(route.request().method()!=='POST')return route.continue();
  sends++;await new Promise(resolve=>setTimeout(resolve,150));
  return route.fulfill({status:502,json:{ok:false,message:'Mock delivery failed. Your details are still here.',errors:{}}});
 });
 await page.getByRole('button',{name:'Send',exact:true}).click();
 await page.locator('[role="status"]').filter({hasText:'Mock delivery failed'}).waitFor();
  assert.equal(await page.getByLabel('Message',{exact:true}).inputValue(),'Please quote tape.');assert.equal(sends,1);
 await page.unroute('**/api/contact');
 await page.route('**/api/contact',async route=>route.request().method()==='POST'?route.fulfill({status:200,json:{ok:true,message:'Mock accepted for delivery.',errors:{}}}):route.continue());
 await page.evaluate(()=>{window.leadEvents=[];document.addEventListener('kraus:generate_lead',e=>window.leadEvents.push(e.detail));});
 await page.getByRole('button',{name:'Send',exact:true}).click();
 await page.locator('[role="status"]').filter({hasText:'Mock accepted'}).waitFor();
 assert.equal(await page.getByLabel('Message',{exact:true}).inputValue(),'');
 assert.deepEqual(await page.evaluate(()=>window.leadEvents),[{form:'product_enquiry'}]);
 await page.screenshot({path:'tests/screenshots/contact-mobile.png',fullPage:true});
 assert.deepEqual(errors,[],'Browser runtime errors');
 const nojs=await browser.newPage({javaScriptEnabled:false});
 await nojs.goto(base+'/api/contact?initialize=1');
 await nojs.getByLabel('Name',{exact:true}).fill('No JS Buyer');
 await nojs.getByLabel('Email',{exact:true}).fill('buyer@example.test');
 await nojs.getByLabel('Message',{exact:true}).fill('Please retain this failed form.');
 // Server-side failure without sending: a filled honeypot.
 await nojs.locator('input[name="website"]').evaluate(e=>e.value='spam');
 await nojs.getByRole('button',{name:'Send',exact:true}).click();
 await nojs.waitForURL('**/contact.php#contact');
 assert.equal(await nojs.getByLabel('Message',{exact:true}).inputValue(),'Please retain this failed form.');
 assert.ok((await nojs.locator('[role="status"]').innerText()).includes('could not accept'));
 const reduced=await browser.newPage({reducedMotion:'reduce'});
 await reduced.addInitScript(()=>{window.motionCalls=0;const original=Element.prototype.animate;Element.prototype.animate=function(...args){window.motionCalls++;return original.apply(this,args);};});
 await reduced.goto(base+'/');await reduced.locator('.about__copy').scrollIntoViewIfNeeded();
 assert.equal(await reduced.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 assert.equal(await reduced.evaluate(()=>window.motionCalls),0);
 console.log('PASS: 24 responsive page checks, mobile menu, filters, View More, mock success/failure, measurement and non-JavaScript form preservation. No real email sent.');
} finally {await browser.close();}
