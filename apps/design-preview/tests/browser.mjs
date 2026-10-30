import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const executablePath = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath, headless: true });
const results = [], errors = [];
await fs.mkdir('.qa', {recursive:true});
const context = await browser.newContext({viewport:{width:1440,height:1000}});
const page = await context.newPage();
page.on('pageerror', e => errors.push(e.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push(r.status()+' '+r.url()); });
async function check(name, fn) { await fn(); results.push(name); console.log('PASS', name); }
async function noOverflow() { const d = await page.evaluate(() => ({v:innerWidth,s:document.documentElement.scrollWidth})); assert.ok(d.s <= d.v+1,JSON.stringify(d)); }
async function closeDialog() { await page.keyboard.press('Escape'); await page.locator('dialog').waitFor({state:'detached'}); }
try {
  await check('Dedicated route and formal-home boundary', async () => {
    assert.equal((await page.goto(base+'/'))?.status(),200);
    assert.equal(await page.getByRole('heading',{name:/留一点空间/}).count(),1);
    assert.equal((await page.goto(base+'/design-preview?direction=a',{waitUntil:'networkidle'}))?.status(),200);
    assert.equal(await page.locator('h1').count(),1);
  });
  await check('Two direction URLs, real content/font differences and browser back', async () => {
    const a=await page.locator('h1').textContent();
    const fa=await page.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily);
    await page.getByRole('button',{name:'B 生活藏品'}).click();
    assert.match(page.url(),/direction=b/);
    assert.notEqual(await page.locator('h1').textContent(),a);
    assert.notEqual(await page.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily),fa);
    await page.goBack(); await page.waitForFunction(()=>document.querySelector('.direction-a'));
  });
  await check('Both directions: representative, intermediate and breakpoint widths without horizontal overflow', async () => {
    for(const direction of ['a','b']) {
      await page.goto(base+'/design-preview?direction='+direction);
      for(const width of [320,390,479,480,600,767,768,900,1023,1024,1279,1280,1440]) {
        await page.setViewportSize({width,height:900}); await noOverflow();
      }
    }
  });
  await page.goto(base+'/design-preview?direction=a');
  await page.setViewportSize({width:1440,height:1000});
  await check('Pointer hover and pressed states are visually distinct', async () => {
    const button = page.getByRole('button',{name:'进入衣橱',exact:true});
    const initial = await button.evaluate(e=>getComputedStyle(e).backgroundColor);
    await button.hover(); await page.waitForTimeout(250);
    const hover = await button.evaluate(e=>getComputedStyle(e).backgroundColor);
    assert.notEqual(initial,hover);
    await page.mouse.down(); await page.waitForTimeout(180);
    const active = await button.evaluate(e=>getComputedStyle(e).backgroundColor);
    assert.notEqual(active,hover); await page.mouse.up(); await closeDialog();
  });
  await check('Dark dialog, focus trap, Escape close and focus restoration', async () => {
    const trigger=page.getByRole('button',{name:'进入衣橱',exact:true});
    await trigger.click(); const dialog=page.locator('dialog');
    assert.equal(await dialog.getAttribute('data-theme'),'dark');
    for(let i=0;i<18;i++){ await page.keyboard.press('Tab'); assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement))); }
    await page.keyboard.press('Shift+Tab'); assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement)));
    await closeDialog(); assert.ok(await trigger.evaluate(e=>e===document.activeElement));
    assert.equal(await page.locator('body').evaluate(e=>e.style.overflow),'');
  });
  await check('Wardrobe selection, filtering and empty-state recovery', async () => {
    await page.getByRole('button',{name:'进入衣橱',exact:true}).click();
    await page.locator('dialog').getByRole('button',{name:'外套',exact:true}).click();
    assert.equal(await page.locator('dialog input[type=radio]').count(),1);
    await page.locator('dialog').getByRole('button',{name:'收藏',exact:true}).click();
    assert.ok(await page.getByText('这是空状态样张，你还没有收藏。').isVisible());
    await page.getByRole('button',{name:'查看全部样张'}).click();
    assert.equal(await page.locator('dialog input[type=radio]').count(),2);
    await page.locator('dialog input[type=radio]').nth(1).check();
    assert.ok(await page.locator('dialog input[type=radio]').nth(1).isChecked()); await closeDialog();
  });
  await check('Form error, loading, repeated submit guard and success', async () => {
    const field=page.locator('#name-light');
    await field.fill(''); await page.locator('.component-sample').first().getByRole('button',{name:'演示保存',exact:true}).click();
    assert.equal(await field.getAttribute('aria-invalid'),'true');
    assert.ok(await field.evaluate(e=>e===document.activeElement));
    await field.fill('回到日常');
    const save=page.locator('.component-sample').first().locator('button[type=submit]');
    await save.click(); assert.equal(await save.getAttribute('aria-busy'),'true');
    await save.click({force:true}); await page.getByText('演示成功',{exact:true}).waitFor();
    assert.equal(await page.locator('.toast').count(),1);
  });
  await check('Light and Dark component portals carry the originating theme', async () => {
    for(const theme of ['light','dark']) {
      await page.locator('.component-sample[data-theme='+theme+']').getByRole('button',{name:'打开弹窗'}).click();
      assert.equal(await page.locator('dialog').getAttribute('data-theme'),theme);
      await page.getByRole('button',{name:'关闭弹窗',exact:true}).click();
      await page.locator('dialog').waitFor({state:'detached'});
    }
  });
  await check('D04 coming modules remain non-interactive; D06 neutral/dark stage switches', async () => {
    await page.getByLabel('对照未开放模块的展示方式').check();
    assert.equal(await page.locator('.coming-card').count(),2);
    assert.equal(await page.locator('.coming-card button, .coming-card a').count(),0);
    await page.getByRole('button',{name:'形象预览',exact:true}).click();
    assert.equal(await page.locator('.portrait-stage').getAttribute('data-theme'),'light');
    await page.getByRole('button',{name:'穿搭舞台',exact:true}).click();
    assert.equal(await page.locator('.portrait-stage').getAttribute('data-theme'),'dark');
  });
  await check('Rapid direction/menu changes leave no orphan dialog or scroll lock', async () => {
    for(let i=0;i<4;i++){ await page.getByRole('button',{name:i%2?'A 空间门廊':'B 生活藏品'}).click(); }
    for(let i=0;i<3;i++){ await page.getByRole('button',{name:'打开个人菜单'}).click(); await closeDialog(); }
    assert.equal(await page.locator('body').evaluate(e=>e.style.overflow),'');
  });
  await check('Manual reduced motion and system preference disable active animation', async () => {
    await page.getByLabel('减少动态').check();
    assert.equal(await page.locator('html').getAttribute('data-reduced'),'true');
    await page.getByRole('button',{name:'进入衣橱',exact:true}).click();
    assert.equal(await page.locator('dialog').evaluate(e=>getComputedStyle(e).animationName),'none');
    await closeDialog();
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>document.querySelector('.reduce-toggle input').disabled);
    assert.ok(await page.getByLabel('减少动态').isDisabled());
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.waitForFunction(()=>!document.querySelector('.reduce-toggle input').disabled);
    await page.getByLabel('减少动态').uncheck();
  });
  await check('Mobile touch, menu, landscape, short viewport and text enlargement', async () => {
    const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    const touch=await touchContext.newPage();
    await touch.goto(base+'/design-preview');
    assert.ok(await touch.evaluate(()=>matchMedia('(pointer:coarse)').matches));
    await touch.getByRole('button',{name:'打开移动菜单'}).tap();
    assert.ok(await touch.locator('dialog').isVisible());
    await touch.getByRole('button',{name:'关闭弹窗',exact:true}).tap();
    assert.equal(await touch.locator('dialog').count(),0); await touchContext.close();
    await page.setViewportSize({width:390,height:844});
    await page.getByRole('button',{name:'打开移动菜单'}).click();
    assert.ok(await page.locator('dialog').isVisible()); await closeDialog(); await noOverflow();
    for(const [width,height] of [[844,390],[1024,600]]){await page.setViewportSize({width,height});await noOverflow();}
    await page.setViewportSize({width:1440,height:1000});
    await page.evaluate(()=>document.documentElement.style.fontSize='200%'); await noOverflow();
    await page.evaluate(()=>document.documentElement.style.fontSize='');
  });
  await check('All displayed local images and the selected font load after scrolling', async () => {
    for(const direction of ['a','b']){
      await page.goto(base+'/design-preview?direction='+direction);
      for(const el of await page.locator('img').all()){await el.scrollIntoViewIfNeeded();}
      await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
      await page.evaluate(()=>document.fonts.ready);
      assert.ok(await page.evaluate(d=>document.fonts.check(d==='a' ? '16px "Inter Variable"' : '16px "Geist Variable"'),direction));
    }
  });
  await check('Representative screenshots saved from functioning pages', async () => {
    for(const direction of ['a','b']) for(const [label,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]) {
      await page.setViewportSize({width,height});
      await page.goto(base+'/design-preview?direction='+direction,{waitUntil:'networkidle'});
      for(const el of await page.locator('img').all()) await el.scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:'.qa/'+direction+'-'+label+'.png',fullPage:label==='mobile'});
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.locator('#components').scrollIntoViewIfNeeded();
    await page.locator('.component-grid').screenshot({path:'.qa/components.png'});
    await page.locator('#studio').scrollIntoViewIfNeeded();
    await page.locator('.studio-workbench').screenshot({path:'.qa/studio.png'});
  });
  assert.deepEqual(errors, []);
  results.push('No browser errors or failed same-origin responses');
  const report={date:new Date().toISOString(),browser:browser.version(),base,checks:results,errors,screenshots:['a-desktop.png','b-desktop.png','a-tablet.png','b-tablet.png','a-mobile.png','b-mobile.png','components.png','studio.png'],limits:['Viewport emulation is not physical-device testing.','No calibrated LCP/CLS/INP or 10-second frame trace was run.']};
  await fs.writeFile('.qa/browser-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
} finally { await browser.close(); }
