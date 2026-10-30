import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { Badge, Button, Icon, Modal, Photo } from './components';
import type { Theme } from './components';
import { HeroScene } from './HeroScene';

type Direction = 'a' | 'b';
type ModalState = { kind: 'wardrobe' | 'menu' | 'review' | 'sample'; theme: Theme } | null;
const readDirection = (): Direction => new URLSearchParams(location.search).get('direction') === 'b' ? 'b' : 'a';
const decisions = [
  ['D-01', '字体与字标', 'A / Inter：清晰、开放，适合长期使用。B / Geist：紧凑、鲜明，更有编辑感。中文保持同一系统回退字族。'],
  ['D-02', '主题与材质', '两案保留深色 Hero + 暖白内容。共享色彩 Token；金色只用于引导与细节点缀。'],
  ['D-03', 'Hero 与构图', 'A：原创 CSS 建筑门廊，图片是空间中的藏品。B：真实摄影与物件式叠层，主角回到衣物。移动端分别重新构图。'],
  ['D-04', '文案与模块', '主操作明确指向衣橱。筹备中模块默认隐藏，可在此实验室打开对照，不承诺已可用。'],
  ['D-05', '动效与图标', '同一线性图标、克制微交互、有限媒体视差。可比较减少动态效果；所有关键操作即时响应。'],
  ['D-06', '形象与工作台', '下方样张可切换中性 Avatar 舞台和 Dark Outfit 舞台；控制区始终清晰。照片保持原色。'],
];
function ComponentSample({ theme, open, notify }: { theme: Theme; open: (theme: Theme) => void; notify: (message: string) => void }) {
  const [name, setName] = useState('周末的日常');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selected, setSelected] = useState('日常');
  const [checked, setChecked] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function save(e: FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    if (!name.trim()) { setError('请为这份穿搭填写名称。'); document.getElementById('name-' + theme)?.focus(); return; }
    setError(''); setStatus('loading');
    timer.current = setTimeout(() => { setStatus('success'); notify('保存演示已完成 · 数据仅存在于本页'); }, 1200);
  }
  return <article className="component-sample" data-theme={theme}>
    <div className="sample-heading"><span className="eyebrow">{theme.toUpperCase()} / SHARED COMPONENTS</span><Icon name={theme === 'light' ? 'sun' : 'moon'} /></div>
    <h3>让每次操作，都有回应。</h3>
    <form onSubmit={save} noValidate>
      <label className="field-label" htmlFor={'name-' + theme}>穿搭名称 <span>必填</span></label>
      <input id={'name-' + theme} value={name} onChange={e => { setName(e.target.value); if (error && e.target.value.trim()) setError(''); setStatus('idle'); clearTimeout(timer.current); }}
        onBlur={() => { if (!name.trim()) setError('请为这份穿搭填写名称。'); }}
        aria-invalid={!!error} aria-describedby={'help-' + theme} placeholder="给这一天起个名字" maxLength={60} />
      <p className={`field-help ${error ? 'field-error' : ''}`} id={'help-' + theme}>{error || '清空名称后保存，可检查错误与焦点状态。'}</p>
      <div className="chip-row" aria-label="风格标签">{['日常', '通勤', '轻户外'].map(chip => <button key={chip} type="button" className="filter-chip" aria-pressed={selected === chip} onClick={() => setSelected(chip)}>{selected === chip && <Icon name="check" size={16} />}{chip}</button>)}</div>
      <label className="check-label"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />加入我的收藏 <span className="quiet">样张</span></label>
      <div className="button-row"><Button type="submit" loading={status === 'loading'}>{status === 'loading' ? '正在保存…' : status === 'success' ? '再次演示保存' : '演示保存'}{status !== 'loading' && <Icon name="arrow" />}</Button>
        <Button variant="secondary" onClick={() => open(theme)}>打开弹窗</Button></div>
    </form>
    <div className="sample-footer"><Badge kind={status === 'success' ? 'success' : 'info'}>{status === 'success' ? '演示成功' : '仅本地交互'}</Badge>
      <Button variant="ghost" size="sm" disabled>开始 AI 生成</Button></div>
    <p className="caption quiet">未接入 AI，禁用状态保留可读说明。</p>
  </article>;
}
function WardrobeDemo() {
  const [filter, setFilter] = useState('全部');
  const [chosen, setChosen] = useState('jacket');
  return <><p className="quiet">这是可交互的衣橱入口样张。点击筛选与衣物卡，预览选中状态。</p>
    <div className="chip-row" aria-label="衣物筛选">{['全部', '外套', '收藏'].map(f => <button className="filter-chip" aria-pressed={filter === f} key={f} onClick={() => setFilter(f)}>{f}</button>)}</div>
    {filter === '收藏' ? <div className="empty-state"><Icon name="hanger" size={32} /><h3>把喜欢的日常，慢慢收进来。</h3><p>这是空状态样张，你还没有收藏。</p><Button variant="secondary" onClick={() => setFilter('全部')}>查看全部样张</Button></div> :
      <div className="demo-items" role="radiogroup" aria-label="选择衣物样张">{(['jacket', ...(filter === '全部' ? ['wardrobe'] : [])] as const).map((item, i) => <label key={item} className={`choice-card ${chosen === item ? 'is-selected' : ''}`}>
        <input type="radio" name="clothing" checked={chosen === item} onChange={() => setChosen(item)} value={item} />
        <div className="choice-image"><Photo name={item as 'jacket' | 'wardrobe'} alt={i === 0 ? '赤陶色夹克摄影样张' : '衣架上的彩色服装摄影样张'} eager /></div><strong>{i === 0 ? '赤陶色夹克' : '衣橱一角'}</strong><span className="quiet">公开摄影 · 示例素材</span>
      </label>)}</div>}
    <p className="caption quiet">选择不会触发生成、上传、支付或服务器请求。</p></>;
}
export function App() {
  const [direction, setDirection] = useState<Direction>(readDirection);
  const [manualReduce, setManualReduce] = useState(false);
  const [systemReduce, setSystemReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const reduced = !!systemReduce || manualReduce;
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState('');
  const [coming, setComing] = useState(false);
  const [studio, setStudio] = useState<'avatar' | 'outfit'>('outfit');
  const [look, setLook] = useState('日常');
  const [favorite, setFavorite] = useState<Direction | null>(null);
  const lab = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduce(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const back = () => setDirection(readDirection());
    addEventListener('popstate', back);
    return () => removeEventListener('popstate', back);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.reduced = String(reduced);
  }, [reduced]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 6000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!lab.current) return;
    const observer = new ResizeObserver(([entry]) => document.documentElement.style.setProperty('--lab-height', `${entry.target.getBoundingClientRect().height}px`));
    observer.observe(lab.current);
    return () => observer.disconnect();
  }, []);
  function choose(value: Direction) {
    if (value === direction) return;
    setDirection(value);
    const url = new URL(location.href); url.searchParams.set('direction', value);
    history.pushState({}, '', url);
  }
  if (!/^\/design-preview\/?$/.test(location.pathname)) return <div className="launch-page" data-theme="light"><span className="wordmark">MyLife.</span><Badge>独立设计实验室</Badge><h1>留一点空间，<br />给下一种可能。</h1><p>正式首页尚未实现。进入两套可交互的 P0 设计样张。</p><a className="button button--primary button--lg" href="/design-preview">打开 Design Preview <Icon name="arrow" /></a></div>;
  return <MotionConfig reducedMotion={reduced ? 'always' : 'user'} transition={{ duration: .24, ease: [.2, 0, 0, 1] }}>
    <div className={`app direction-${direction}`} data-theme="light">
      <a className="skip-link" href="#preview-main">跳到设计内容</a>
      <div className="lab-bar" ref={lab}>
        <a className="lab-brand" href="/design-preview"><span className="lab-symbol">m.</span><span>DESIGN LAB <small>P0 / 视觉探索</small></span></a>
        <div className="direction-switch" role="group" aria-label="设计方案">
          <button aria-pressed={direction === 'a'} onClick={() => choose('a')}><span>A</span> 空间门廊</button>
          <button aria-pressed={direction === 'b'} onClick={() => choose('b')}><span>B</span> 生活藏品</button>
        </div>
        <div className="lab-actions"><label className="reduce-toggle"><input type="checkbox" checked={reduced} disabled={!!systemReduce} onChange={e => setManualReduce(e.target.checked)} /><span>减少动态</span></label>
          <Button variant="ghost" size="sm" className="review-trigger" onClick={() => setModal({ kind: 'review', theme: 'light' })}>评审说明 <Icon name="plus" size={16} /></Button></div>
      </div>
      <header className="site-header" data-theme="dark"><div className="container header-inner">
        <a className="wordmark" href="#preview-main" aria-label="MyLife 回到样张顶部">MyLife<span>.</span></a>
        <nav aria-label="样张导航" className="desktop-nav"><a href="#spaces" aria-current="page">我的空间</a><button onClick={() => setModal({ kind: 'wardrobe', theme: 'dark' })}>衣橱</button><a href="#studio">形象与穿搭</a></nav>
        <div className="header-meta"><span className="edition">PRIVATE SPACE / 01</span><button className="account-button" aria-label="打开个人菜单" aria-haspopup="dialog" onClick={() => setModal({ kind: 'menu', theme: 'dark' })}>M</button>
          <button className="mobile-menu icon-button" aria-label="打开移动菜单" aria-haspopup="dialog" onClick={() => setModal({ kind: 'menu', theme: 'dark' })}><Icon name="menu" /></button></div>
      </div></header>
      <main id="preview-main" tabIndex={-1}>
        <section className={`hero hero--${direction}`} data-theme="dark" aria-labelledby="hero-heading">
          <div className="container hero-inner">
            <div className="hero-copy"><div className="eyebrow hero-eyebrow"><span className="tiny-line" />{direction === 'a' ? 'A PLACE TO CALL YOUR OWN' : 'THE ART OF EVERYDAY LIVING'}</div>
              <h1 id="hero-heading">{direction === 'a' ? <>Your life,<br />beautifully<br /><span>organized.</span></> : <>Good things.<br /><span>In their<br />place.</span></>}</h1>
              <p className="hero-description">{direction === 'a' ? '让重要的事物，各就其位。\n从一件衣物开始，慢慢构建属于你的生活空间。' : '收藏你喜欢的，留下真正需要的。\n在日常的物件之间，看见更清晰的自己。'}</p>
              <div className="hero-action"><Button size="lg" onClick={() => setModal({ kind: 'wardrobe', theme: 'dark' })}>进入衣橱 <Icon name="arrow" /></Button><span className="caption quiet">衣橱入口交互样张</span></div>
              <div className="hero-footnote"><span>YOUR LIFE. YOUR SPACE.</span><span>{direction === 'a' ? '01 — SPATIAL' : '02 — EDITORIAL'}</span></div>
            </div>
            <motion.div className="scene-shell" key={direction} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? .12 : .6, ease: [.16, 1, .3, 1] }}><HeroScene direction={direction} reduced={reduced} /></motion.div>
          </div>
          <div className="hero-bottom container"><a href="#spaces">发现你的空间 <span>↓</span></a><span>DESIGNED AROUND YOU</span><span className="hero-direction-note">{direction === 'a' ? 'Inter / 建筑秩序 / 留白' : 'Geist / 摄影陈列 / 物件叙事'}</span></div>
        </section>
        <section className="space-section container section" id="spaces" aria-labelledby="space-title">
          <div className="section-heading"><div><span className="eyebrow">01 / PERSONAL SPACE</span><h2 id="space-title">生活，从这里展开。</h2></div><p>一个空间，装下每一面的你。<br />先把每天相伴的衣物，认真整理好。</p></div>
          <div className="wardrobe-feature">
            <div className="wardrobe-visual"><Photo name={direction === 'a' ? 'wardrobe' : 'jacket'} alt={direction === 'a' ? '有序陈列的服装摄影' : '赤陶色夹克摄影'} /><span className="image-label">THE WARDROBE COLLECTION</span></div>
            <div className="wardrobe-copy"><div className="module-number"><span>01</span><Icon name="hanger" size={28} /></div><Badge>第一阶段 · 衣橱</Badge><h3>Your wardrobe.<br />A little more you.</h3><p>看见已有的，发现新的组合。<br />衣物、形象与穿搭，在一个地方井然相遇。</p>
              <Button variant="secondary" onClick={() => setModal({ kind: 'wardrobe', theme: 'light' })}>探索衣橱样张 <Icon name="arrow" /></Button><div className="module-links"><a href="#studio">形象与穿搭 <Icon name="chevron" size={16} /></a><a href="#components">查看交互细节 <Icon name="chevron" size={16} /></a></div>
            </div>
          </div>
          <label className="check-label preview-option"><input type="checkbox" checked={coming} onChange={e => setComing(e.target.checked)} />对照未开放模块的展示方式 <span className="caption quiet">D-04</span></label>
          {coming && <div className="coming-grid">{['阅读与灵感', '生活记录'].map((name, i) => <div className="coming-card" key={name}><span className="eyebrow">0{i + 2} / IN THE MAKING</span><h3>{name}</h3><Badge kind="warning">筹备中 · 不可进入</Badge></div>)}</div>}
        </section>
        <section className="studio-section section" id="studio" aria-labelledby="studio-title"><div className="container">
          <div className="section-heading"><div><span className="eyebrow">02 / YOUR IMAGE, YOUR STYLE</span><h2 id="studio-title">把想象，放进真实的光里。</h2></div><p>中性预览，清晰控制。<br />让照片保留本来的颜色。</p></div>
          <div className="studio-workbench"><div className="portrait-stage" data-theme={studio === 'outfit' ? 'dark' : 'light'}>
            <div className="stage-top"><span className="eyebrow">{studio === 'outfit' ? 'OUTFIT STUDIO' : 'AVATAR STUDIO'}</span><Badge>摄影参考</Badge></div>
            <div className="portrait-frame"><Photo name="portrait" alt="公开摄影样张：身穿黄色套装的全身人物，保留原图色彩" /></div>
            <div className="stage-bottom"><span>01 / Reference image</span><span>原色 · 完整构图</span></div>
          </div><div className="studio-controls" data-theme="light"><span className="eyebrow">D-06 / MIXED THEME</span><h3>每一面的你，<br />都值得好好看见。</h3><p className="quiet">切换舞台，比较浅色形象预览与深色穿搭场景。当前展示公开摄影参考，并非 AI 生成结果。</p>
            <div className="studio-tabs" role="group" aria-label="舞台类型"><button aria-pressed={studio === 'avatar'} onClick={() => setStudio('avatar')}><Icon name="user" />形象预览</button><button aria-pressed={studio === 'outfit'} onClick={() => setStudio('outfit')}><Icon name="layers" />穿搭舞台</button></div>
            <span className="field-label">风格标签 · 选择演示</span><div className="chip-row">{['日常', '通勤', '轻户外'].map(item => <button key={item} className="filter-chip" aria-pressed={look === item} onClick={() => setLook(item)}>{look === item && <Icon name="check" size={16} />}{item}</button>)}</div>
            <div className="selection-summary"><Icon name="check" /><div><strong>已选择「{look}」</strong><p>仅改变选择状态，照片不会被替换或生成。</p></div></div>
            <Button onClick={() => setModal({ kind: 'sample', theme: 'light' })}>查看预览弹窗 <Icon name="arrow" /></Button><p className="caption quiet">素材不代表真实用户，也不用于训练或身份创建。</p>
          </div></div>
        </div></section>
        <section className="container section" id="components" aria-labelledby="component-title"><div className="section-heading"><div><span className="eyebrow">03 / THE QUIET DETAILS</span><h2 id="component-title">好的体验，藏在细节里。</h2></div><p>同一套规则，两种光线。<br />试试输入、选择、保存与键盘焦点。</p></div><div className="component-grid"><ComponentSample theme="light" open={theme => setModal({ kind: 'sample', theme })} notify={setToast} /><ComponentSample theme="dark" open={theme => setModal({ kind: 'sample', theme })} notify={setToast} /></div></section>
        <section className="review-section section" id="review"><div className="container">
          <div className="section-heading"><div><span className="eyebrow">04 / A DIRECTION, NOT A DECISION</span><h2>让选择，有据可依。</h2></div><Button variant="secondary" onClick={() => { setFavorite(direction); setToast('已在本页记录偏好，尚未确认或替换正式设计。'); }}>{favorite === direction ? <Icon name="check" /> : <Icon name="plus" />}{favorite === direction ? '已记录此方案偏好' : '更喜欢这个方向'}</Button></div>
          <div className="direction-review"><div><span className="review-letter">{direction.toUpperCase()}</span><h3>{direction === 'a' ? '空间门廊 / Spatial Threshold' : '生活藏品 / Everyday Archive'}</h3><p>{direction === 'a' ? '以门廊、光线与材质建立一个属于你的数字空间。推荐作为主方向：品牌辨识度更强，也为未来生活模块留出想象。' : '以衣物摄影与编辑式陈列把功能变成生活内容。衣橱定位更直观，适合强调首期能力；长远扩展时需调整物件叙事。'}</p><span className="caption quiet">{direction === 'a' ? '取舍：需细致维护移动端门廊比例，衣橱功能要靠文案明确。' : '取舍：更依赖高质量摄影与裁切，容易被理解为时尚内容站。'}</span></div>
            <div className="decision-list">{decisions.map(([id, title, description]) => <details key={id}><summary><span>{id}</span>{title}<Icon name="plus" size={16} /></summary><p>{description}</p></details>)}</div></div>
        </div></section>
      </main>
      <footer className="container footer"><a className="wordmark" href="#preview-main">MyLife<span>.</span></a><p>Your life. Your space.</p><button className="text-link" onClick={() => setModal({ kind: 'review', theme: 'light' })}>样张说明与素材来源</button><span className="caption">P0 DESIGN EXPLORATION / 2026</span></footer>
      <div className="toast-host" aria-live="polite" aria-atomic="true">{toast && <div className="toast" data-theme="light"><Icon name="check" /><span>{toast}</span><button className="icon-button" aria-label="关闭提示" onClick={() => setToast('')}><Icon name="close" size={16} /></button></div>}</div>
      {modal && <Modal theme={modal.theme} title={modal.kind === 'wardrobe' ? '衣橱入口样张' : modal.kind === 'menu' ? '你的空间' : modal.kind === 'review' ? '关于这次视觉探索' : '把喜欢的日常，留下来'} wide={modal.kind === 'wardrobe' || modal.kind === 'review'} sheet={modal.kind === 'menu'} onClose={() => setModal(null)}>
        {modal.kind === 'wardrobe' ? <WardrobeDemo /> : modal.kind === 'menu' ? <><p className="quiet">M / 演示身份 · 没有真实账号数据</p><nav className="sheet-nav" aria-label="弹窗导航">{[['#spaces', '我的空间'], ['#studio', '形象与穿搭'], ['#components', '组件与状态'], ['#review', '设计决策']].map(([href, label]) => <a key={href} href={href} onClick={() => setModal(null)}>{label}<Icon name="arrow" /></a>)}</nav><p className="caption quiet">此菜单只在设计样张内导航。</p></> :
        modal.kind === 'review' ? <><Badge kind="info">探索样张 · 尚未定稿</Badge><p>两个方向共用现有 Design System v1.1，探索的是字体、Hero 主体与构图。所有输入、筛选与保存均为浏览器内演示。</p><div className="review-dialog-grid">{decisions.map(([id, title, desc]) => <div key={id}><span className="eyebrow">{id}</span><h3>{title}</h3><p className="quiet">{desc}</p></div>)}</div><h3>素材与字体</h3><p className="quiet">门廊与材质陈列为原创 CSS。摄影来自 Unsplash，已下载本地，保留原色；未调用 AI 图像接口。</p><ul className="source-links"><li><a href="https://unsplash.com/photos/Fg15LdqpWrs" target="_blank" rel="noreferrer">Tobias Tullius / 夹克摄影 ↗</a></li><li><a href="https://unsplash.com/photos/xXJ6utyoSw0" target="_blank" rel="noreferrer">Marcus Loke / 衣橱摄影 ↗</a></li><li><a href="https://unsplash.com/photos/nimElTcTNyY" target="_blank" rel="noreferrer">Dom Hill / 人物摄影 ↗</a></li><li><a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash License ↗</a></li></ul><p className="caption quiet">Inter / Geist 使用本地 WOFF2 字体（SIL OFL）；中文使用设备字体回退。样张不表示摄影人物为 MyLife 用户或代言人。</p></> :
        <><div className="modal-preview"><Photo name="jacket" alt="赤陶色夹克公开摄影样张" eager /><div><Badge kind="success">已选择 · 示例</Badge><h3>一件好衣物，<br />很多种日常。</h3><p className="quiet">这个弹窗跟随打开它的区域主题。试试 Tab、Shift+Tab、Escape，或关闭后返回原来的按钮。</p></div></div><div className="button-row"><Button onClick={() => { setModal(null); setToast('已完成确认演示 · 未保存业务数据'); }}>确认样张 <Icon name="check" /></Button><Button variant="secondary" onClick={() => setModal(null)}>返回继续浏览</Button></div></>}
      </Modal>}
    </div>
  </MotionConfig>;
}
