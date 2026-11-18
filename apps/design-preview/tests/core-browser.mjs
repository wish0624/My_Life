import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const url = base + '/design-preview/core';
const browser = await chromium.launch({ executablePath: process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const results = [], errors = [];
const output = '.qa/core';
await fs.mkdir(output, { recursive: true });
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
async function check(name, callback) {
  await callback(); results.push(name); console.log('PASS', name);
}
async function screen(name, target = page) {
  await target.getByRole('heading', { level: 1, name, exact: true }).waitFor();
  assert.equal(await target.locator('main section').count(), 1);
}
async function fits(target = page) {
  const layout = await target.evaluate(() => {
    const pane = document.querySelector('.hud-page');
    return { route: location.hash, w: innerWidth, h: innerHeight, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight,
      paneW: pane.scrollWidth, clientW: pane.clientWidth, paneH: pane.scrollHeight, clientH: pane.clientHeight, y: scrollY,
      clipped: [...document.querySelectorAll('.hud-header a, .hud-header button, .hud-page a, .hud-page button, .hud-footer a')].filter(el => {
        const r = el.getBoundingClientRect(); return r.top < -1 || r.bottom > innerHeight + 1 || r.left < -1 || r.right > innerWidth + 1;
      }).map(el => el.textContent || el.getAttribute('aria-label')) };
  });
  assert.ok(layout.docW <= layout.w + 1 && layout.docH <= layout.h + 1 && layout.paneW <= layout.clientW + 1 && layout.paneH <= layout.clientH + 1 && layout.y === 0 && !layout.clipped.length, JSON.stringify(layout));
}
const screens = [['arrival','光启核心'], ['space','模块总览'], ['wardrobe','数字衣橱'], ['avatar','虚拟形象'], ['outfit','穿搭工作台']];
async function visit(hash, name) {
  await page.goto(url + '#' + hash); await screen(name); await page.locator('.hud-page').evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
}
try {
  await check('All default preview entrances open the single ignition screen', async () => {
    for (const route of ['/', '/design-preview', '/design-preview/core']) {
      assert.equal((await page.goto(base + route)).status(), 200); await screen('光启核心');
    }
    await page.locator('.reactor-assembly img').evaluate(img => img.decode()); await fits();
  });
  await check('Wheel and PageDown keep the current screen and leave the document stationary', async () => {
    for (const [id, name] of screens) {
      await visit(id, name); await page.mouse.move(500, 350); await page.mouse.wheel(0, 850);
      await page.keyboard.press('PageDown'); await page.waitForTimeout(80); await fits(); await screen(name);
      assert.equal(await page.locator('.hud-page').evaluate(el => el.scrollTop), 0);
    }
  });
  await check('Pointer tilts the reactor and resets on leave; keyboard ignition changes screen and focus', async () => {
    await visit('arrival', '光启核心');
    const button = page.locator('.reactor-control'); const rect = await button.boundingBox();
    await page.mouse.move(rect.x + rect.width * .65, rect.y + rect.height * .5);
    await page.waitForFunction(() => document.querySelector('.reactor-assembly').style.transform.includes('rotateY'));
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => !document.querySelector('.reactor-assembly').style.transform);
    await button.focus(); await page.keyboard.press('Enter'); await screen('模块总览');
    assert.equal(await page.locator('h1').evaluate(el => el === document.activeElement), true);
    await page.goBack(); await screen('光启核心'); await page.goForward(); await screen('模块总览');
  });
  await check('Ignition hover wakes the lens and traces, then releases them on pointer exit', async () => {
    await visit('arrival', '光启核心');
    const orbit = page.locator('.reactor-orbit');
    assert.equal(await orbit.evaluate(el => el.getAnimations()[0]?.playState), 'running');
    await page.getByRole('button', { name: '启动核心', exact: true }).hover();
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.reactor-leaders')).opacity) > .95);
    assert.ok(await page.locator('.reactor-assembly i').evaluate(el => Number(getComputedStyle(el).opacity) > .4));
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.reactor-leaders')).opacity) < .05);
  });
  await check('Module-specific instrument cues respond to hover and keyboard focus without opening a screen', async () => {
    await visit('space', '模块总览');
    const cards = page.locator('.module-card');
    for (const card of await cards.all()) {
      await card.hover();
      await page.waitForFunction(el => Number(getComputedStyle(el.querySelector('.module-window'), '::before').opacity) > .9, await card.elementHandle());
      assert.ok(await card.locator('.module-hologram').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42 < -1));
      assert.match(page.url(), /#space$/);
    }
    await page.mouse.move(0,0);
    await page.locator('#space-title').focus(); await page.keyboard.press('Tab');
    assert.ok(await cards.first().evaluate(el => el.matches(':focus-visible')));
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.card-wardrobe .module-window'), '::before').opacity) > .9);
    await page.keyboard.press('Tab');
    await page.waitForFunction(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.card-avatar .module-window'), '::before').transform).m42 > 30);
    await page.keyboard.press('Enter'); await screen('虚拟形象');
    await visit('space', '模块总览');
  });
  await check('Directory opens each module and returns, including direct links and refresh', async () => {
    for (const [id, name] of screens.slice(2)) {
      await page.locator('.module-deck a[href="#' + id + '"]').click(); await screen(name);
      await page.reload(); await screen(name); await page.locator('.hud-back').click(); await screen('模块总览');
    }
  });
  await check('Wardrobe filtering, detail dialog, empty recovery and in-session favorites', async () => {
    await visit('wardrobe', '数字衣橱'); await page.getByRole('button', { name: '收藏', exact: true }).click();
    await page.getByRole('button', { name: '查看全部衣物' }).click();
    const opener = page.getByRole('button', { name: '查看赤陶色夹克详情' });
    await opener.click(); await page.getByRole('dialog').getByRole('button', { name:'收藏衣物' }).click();
    await page.keyboard.press('Escape'); assert.ok(await opener.evaluate(el => el === document.activeElement));
    await page.getByRole('button', { name: '收藏', exact: true }).click();
    await page.getByRole('button', { name: '已收藏' }).click();
    await page.getByRole('heading', { name: '还没有收藏的衣物' }).waitFor();
  });
  await check('Reference view switches crop; outfit board adds and removes the sample garment', async () => {
    await visit('avatar','虚拟形象'); await page.getByRole('button',{name:'局部'}).click();
    assert.equal(await page.locator('.portrait-media.crop-active img').count(),1);
    await page.getByRole('button',{name:'全身'}).click(); assert.equal(await page.locator('.crop-active').count(),0);
    await visit('outfit','穿搭工作台'); await page.getByRole('button',{name:'加入夹克'}).click();
    assert.equal(await page.locator('.outfit-board img').count(),2);
    await page.getByRole('button',{name:'移除夹克'}).click(); assert.equal(await page.locator('.outfit-board img').count(),1);
  });
  await check('Closing settings restores focus; system and manual reduced motion are respected', async () => {
    await visit('arrival','光启核心'); const opener = page.getByRole('button',{name:'浏览设置'});
    await opener.click(); await page.getByLabel('减少动态效果').check(); await page.keyboard.press('Escape');
    assert.ok(await opener.evaluate(el => el === document.activeElement));
    assert.equal(await page.locator('.core-preview').getAttribute('data-reduced-motion'),'true');
    assert.equal(await page.locator('.reactor-orbit').evaluate(el => el.getAnimations().length), 0);
    await page.emulateMedia({ reducedMotion:'reduce' }); await opener.click(); await page.getByLabel('减少动态效果').uncheck();
    await page.getByText('系统已要求减少动态效果。').waitFor(); await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'启动核心',exact:true}).click(); await screen('模块总览');
    await page.emulateMedia({ reducedMotion:'no-preference' });
  });
  await check('Each screen fits desktop, tablet, phone and landscape without scrolling', async () => {
    await page.goto(url); await screen('光启核心');
    await page.mouse.move(0, 0);
    for (const [width,height] of [[320,568],[390,844],[667,375],[844,390],[720,720],[768,1024],[1024,600],[1440,900],[1920,1080]]) {
      await page.setViewportSize({width,height});
      for (const [id,name] of screens) {
        await visit(id,name); await fits();
        if (width === 390 || width === 1440 || width === 768 || width === 667) {
          for (const img of await page.locator('.hud-page img').all()) await img.evaluate(el => el.decode());
          const size = width === 390 ? 'mobile' : width === 768 ? 'tablet' : width === 667 ? 'landscape' : 'desktop';
          await page.screenshot({path: output + '/' + id + '-' + size + '.png', animations: 'disabled'});
        }
      }
    }
  });
  await check('Touch ignition, module selection, and detail dismissal', async () => {
    const mobile = await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    const tab = await mobile.newPage(); await tab.goto(url); await tab.getByRole('button',{name:'启动核心',exact:true}).tap();
    await screen('模块总览',tab); await tab.locator('.card-wardrobe').tap();
    await tab.getByRole('button',{name:'查看赤陶色夹克详情'}).tap(); await tab.getByRole('button',{name:'关闭弹窗'}).tap();
    await fits(tab); await mobile.close();
  });
  await check('Missing photo leaves an accessible detail entry and text', async () => {
    const failed = await context.newPage(); await failed.route('**/assets/jacket.webp',route => route.abort());
    await failed.goto(url + '#wardrobe'); await failed.locator('.media-button[data-image-error]').waitFor();
    await failed.getByRole('button',{name:'查看赤陶色夹克详情'}).click(); await failed.getByRole('dialog').waitFor(); await failed.close();
  });
  assert.deepEqual(errors, []);
} finally {
  await fs.writeFile(output + '/browser-report.json', JSON.stringify({ date:new Date().toISOString(), browser:browser.version(), results, errors }, null, 2));
  await browser.close();
}
console.log('Passed ' + results.length + ' core-preview checks.');
