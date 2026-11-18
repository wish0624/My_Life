import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon, Modal, Photo } from './components';
import { CoreEnergy, CoreMark } from './CoreEnergy';
import './core-preview.css';

type ModuleId = 'wardrobe' | 'avatar' | 'outfit';
type Screen = 'arrival' | 'space' | ModuleId;
type Filter = '全部' | '外套' | '收藏';
const modules: { id: ModuleId; name: string }[] = [
  { id: 'wardrobe', name: '数字衣橱' },
  { id: 'avatar', name: '虚拟形象' },
  { id: 'outfit', name: '穿搭工作台' },
];

function readScreen(): Screen {
  const id = location.hash.slice(1);
  if (id === 'space' || id === 'wardrobe' || id === 'avatar' || id === 'outfit') return id;
  return 'arrival';
}

export default function CorePreview() {
  const [screen, setScreen] = useState(readScreen);
  const [lastModule, setLastModule] = useState<ModuleId | null>(null);
  const [igniting, setIgniting] = useState(false);
  const [settings, setSettings] = useState(false);
  const [detail, setDetail] = useState(false);
  const [manualReduce, setManualReduce] = useState(false);
  const [systemReduce, setSystemReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const reduced = systemReduce || manualReduce;
  const [favorite, setFavorite] = useState(false);
  const [filter, setFilter] = useState<Filter>('全部');
  const [portraitCrop, setPortraitCrop] = useState(false);
  const [paired, setPaired] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const previous = useRef(screen);
  const recoverFocus = useRef<HTMLButtonElement>(null);
  const module = modules.find(item => item.id === screen);
  const step = screen === 'arrival' ? 1 : screen === 'space' ? 2 : 3;

  useEffect(() => {
    const html = document.documentElement;
    const oldTitle = document.title;
    html.dataset.preview = 'core';
    document.title = 'MyLife · 光启控制台';
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setSystemReduce(preference.matches);
    function readLocation() {
      setIgniting(false);
      setScreen(readScreen());
      setSettings(false);
      setDetail(false);
    }
    window.addEventListener('hashchange', readLocation);
    preference.addEventListener('change', syncMotion);
    return () => {
      delete html.dataset.preview;
      document.title = oldTitle;
      window.removeEventListener('hashchange', readLocation);
      preference.removeEventListener('change', syncMotion);
    };
  }, []);

  useLayoutEffect(() => {
    if (previous.current !== screen) title.current?.focus({ preventScroll: true });
    previous.current = screen;
    if (screen !== 'arrival' && screen !== 'space') setLastModule(screen);
  }, [screen]);
  useEffect(() => {
    if (!igniting) return;
    const timer = window.setTimeout(() => { location.hash = 'space'; }, reduced ? 0 : 780);
    return () => window.clearTimeout(timer);
  }, [igniting, reduced]);
  useEffect(() => {
    if (!detail && !favorite && filter === '收藏' && document.activeElement === document.body) {
      recoverFocus.current?.focus({ preventScroll: true });
    }
  }, [filter, favorite, detail]);

  const ignite = () => setIgniting(true);
  const status = igniting ? '点火中' : screen === 'arrival' ? '核心待机' : '核心已启动';
  const favoriteLabel = favorite ? '已收藏' : '收藏衣物';
  const favoriteButton = <button type="button" className="hud-tool favorite" aria-pressed={favorite} aria-label={favoriteLabel} title={favoriteLabel} onClick={() => setFavorite(!favorite)}>
    <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" /></svg>
  </button>;

  return <div className="core-preview" data-theme="dark" data-reduced-motion={reduced} data-igniting={igniting} data-step={step}>
    <header className="hud-header">
      <a href="#arrival" className="hud-brand" aria-label="MyLife，返回核心启动"><CoreMark /><span>MyLife</span></a>
      <div className="hud-header-tools">
        <span className="hud-status" role="status" title={status}><span className="core-sr">{status}</span><i /><i /><i /></span>
        <button type="button" className="hud-settings" aria-label="浏览设置" title="浏览设置" aria-haspopup="dialog" onClick={() => setSettings(true)}><Icon name="menu" size={18} /></button>
      </div>
    </header>

    <main className="hud-main">
      {screen === 'arrival' && <section className="hud-page ignition-page" key="arrival" aria-labelledby="arrival-title">
        <div className="ignition-copy">
          <h1 ref={title} id="arrival-title" tabIndex={-1}>光启核心</h1>
          <button className="hud-action ignite-action" type="button" aria-label="启动核心" aria-disabled={igniting} onClick={ignite}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2v10M7 5.5a8 8 0 1 0 10 0" /></svg>
            启动
          </button>
        </div>
        <CoreEnergy onActivate={ignite} igniting={igniting} reduced={reduced} />
      </section>}

      {screen === 'space' && <section className="hud-page overview-page" key="space" aria-labelledby="space-title">
        <div className="hud-section-head"><h1 ref={title} id="space-title" tabIndex={-1}>模块总览</h1></div>
        <div className="module-deck">{modules.map(item => <a href={'#' + item.id} key={item.id} className={'module-card card-' + item.id}>
          <div className="module-window" aria-hidden="true"><span className="module-hologram" /></div>
          <div className="module-caption"><h2>{item.name}</h2><span className="module-arrow"><Icon name="arrow" size={20} /></span></div>
        </a>)}</div>
      </section>}

      {module && <section className="hud-page work-page" key={module.id} aria-labelledby="work-title">
        <div className="hud-section-head"><h1 ref={title} id="work-title" tabIndex={-1}>{module.name}</h1>
          <a className="hud-back hud-tool" href="#space" aria-label="返回模块总览" title="返回模块总览"><Icon name="arrow" size={20} /></a></div>
        <div className={'work-panel panel-' + module.id}>
          {screen === 'wardrobe' && <>
            <div className="work-toolbar" role="group" aria-label="筛选衣物">{(['全部', '外套', '收藏'] as const).map(value => <button type="button" aria-pressed={value === filter} key={value} onClick={() => setFilter(value)}>{value}</button>)}</div>
            {filter === '收藏' && !favorite ? <div className="work-empty"><Icon name="hanger" size={42} /><h2>还没有收藏的衣物</h2><button ref={recoverFocus} type="button" className="hud-action secondary-action" onClick={() => setFilter('全部')}>查看全部衣物 <Icon name="arrow" size={16} /></button></div> :
              <div className="work-content">
                <button type="button" className="work-media media-button" aria-label="查看赤陶色夹克详情" aria-haspopup="dialog" onClick={() => setDetail(true)}>
                  <Photo name="jacket" alt="赤陶色夹克正面" eager /><span className="media-tool"><Icon name="plus" size={18} /></span>
                </button>
                <div className="work-dock"><h2>赤陶色夹克</h2>{favoriteButton}</div>
              </div>}
          </>}
          {screen === 'avatar' && <>
            <div className="work-toolbar" role="group" aria-label="参考图视图">{['全身', '局部'].map((name, i) => <button type="button" aria-pressed={portraitCrop === Boolean(i)} key={name} onClick={() => setPortraitCrop(Boolean(i))}>{name}</button>)}<span className="sample-label">参考照</span></div>
            <div className={'work-media portrait-media' + (portraitCrop ? ' crop-active' : '')}><Photo name="portrait" alt={portraitCrop ? '人物参考照局部裁切' : '黄色运动服人物全身参考照'} eager /></div>
          </>}
          {screen === 'outfit' && <div className="work-content">
            <div className={'outfit-board' + (paired ? ' is-paired' : '')}><div className="work-media"><Photo name="portrait" alt="搭配参考人物" eager /></div>{paired && <div className="work-media paired-garment"><Photo name="jacket" alt="搭配中的赤陶色夹克" eager /></div>}</div>
            <div className="work-dock"><h2>搭配预览</h2><button type="button" className="hud-action secondary-action pair-action" aria-pressed={paired} onClick={() => setPaired(!paired)}>
              <Icon name={paired ? 'close' : 'plus'} size={17} />{paired ? '移除夹克' : '加入夹克'}</button></div>
          </div>}
        </div>
      </section>}
    </main>

    <footer className="hud-footer"><nav aria-label="页面导航">
      <a href="#arrival" aria-label="核心启动" title="核心启动" aria-current={step === 1 ? 'step' : undefined}><Icon name="spark" size={18} /></a><i />
      <a href="#space" aria-label="模块总览" title="模块总览" aria-current={step === 2 ? 'step' : undefined}><Icon name="grid" size={18} /></a><i />
      {lastModule ? <a href={'#' + lastModule} aria-label="模块工作区" title="模块工作区" aria-current={step === 3 ? 'step' : undefined}><Icon name="layers" size={19} /></a> :
        <span role="img" aria-label="模块工作区，尚未选择模块" title="尚未选择模块"><Icon name="layers" size={19} /></span>}
    </nav></footer>

    {settings && <Modal title="浏览设置" theme="dark" onClose={() => setSettings(false)}><div className="core-review"><label className="check-label"><input type="checkbox" checked={manualReduce} onChange={event => setManualReduce(event.target.checked)} />减少动态效果</label>
      {systemReduce && <p>系统已要求减少动态效果。</p>}
      <p>当前使用摄影样片，收藏和搭配仅在本次浏览保留。</p>
      <div className="archive-links"><a href="/design-preview?direction=a">A · 空间门廊</a><a href="/design-preview?direction=b">B · 生活藏品</a></div></div></Modal>}
    {detail && <Modal title="赤陶色夹克" theme="dark" onClose={() => setDetail(false)}><div className="garment-detail"><div className="work-media"><Photo name="jacket" alt="完整的赤陶色夹克摄影" eager /></div><div className="work-dock"><p>外套 · 摄影样张</p>{favoriteButton}</div></div></Modal>}
  </div>;
}
