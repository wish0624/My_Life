# Motion System

状态：P0 动效执行基线；具体审美节奏仍需高保真原型确认。保留 Rich Motion：首页有层次与空间感，业务页的动画服务状态与操作。本文独占动画 Token、行为与预算，[组件规范](component-spec.md)不再另定动画时长。

## 1. Token

| Token | 值 | 用途 |
| --- | --- | --- |
| `--ml-motion-duration-instant` | 0ms | reduced motion 的位置/尺寸变化 |
| `--ml-motion-duration-fast` | 120ms | 按下、退出、减弱模式淡变 |
| `--ml-motion-duration-micro` | 180ms | 颜色/小控件状态 |
| `--ml-motion-duration-hover` | 240ms | 卡片、图片交叉淡变 |
| `--ml-motion-duration-panel` | 360ms | 面板/Sheet 进入 |
| `--ml-motion-duration-reveal` | 600ms | 内容进入 |
| `--ml-motion-duration-hero` | 900ms | Hero 总演出上限，含 delay/stagger |
| `--ml-motion-stagger` | 60ms | 相邻元素依次进入 |
| `--ml-motion-delay-max` | 240ms | 一组中最大延迟 |
| `--ml-motion-ease-standard` | cubic-bezier(0.2,0,0,1) | 状态变更、hover |
| `--ml-motion-ease-enter` | cubic-bezier(0.16,1,0.3,1) | 进入与抬升 |
| `--ml-motion-ease-exit` | cubic-bezier(0.4,0,1,1) | 退出 |
| `--ml-motion-ease-linear` | linear | 真实进度、必要状态循环 |
| `--ml-motion-distance-micro` | 2px | 业务卡微反馈 |
| `--ml-motion-distance-card` | 4px | 首页卡片抬升 |
| `--ml-motion-distance-enter` | 16px | 区块进入位移 |
| `--ml-motion-distance-hero` | 24px | Hero 装饰进入最大位移 |
| `--ml-motion-parallax-max` | 12px | 视差单向最大位移 |
| `--ml-motion-tilt-max` | 3deg | 首页媒体轻倾斜上限 |
| `--ml-motion-press-scale` | 0.98 | 按钮按下最小缩放 |
| `--ml-motion-perspective` | 1200px | 首页装饰媒体透视 |

时间以 ms 记录；Motion 数字 duration 使用秒时由共享配置统一除以 1000。曲线在 JS 中映射为同一四元数组；不维护另一套“看起来差不多”的数值。P0 默认使用 tween，不默认叠加弹簧与过冲。

## 2. 命名模式与触发

| 模式 | 场景 / 触发 | 动画与退出 | 重播规则 |
| --- | --- | --- | --- |
| motion.state | hover、checked、invalid 等 | micro + standard，只变允许的色彩/边界 | 状态变化即响应 |
| motion.press | Button pointerdown / 键盘按下 | fast + standard，scale 到 press-scale；松开/取消回到 1 | 每次明确激活 |
| motion.card | 首页可交互模块卡 hover/focus | hover + enter，内部媒体 y=-distance-card；离开回 0；最多 tilt-max | hover 可重复，键盘只抬升不倾斜 |
| motion.business-card | 衣物/形象选择 | micro + standard，仅选择环/图标淡变；若抬升不得超过 distance-micro | 随选择状态，不随轮询 |
| motion.panel | Dialog / Sheet 打开 | panel + enter；Dialog y=distance-enter 到 0；Sheet 从自身边缘进入；退出 micro + exit | 每次用户打开 |
| motion.reveal | 区块进入视口 | reveal + enter；y=distance-enter 到 0，opacity 0 到 1 | IntersectionObserver 可见比例 0.2 后，每路由访问一次 |
| motion.hero | 首页首次进入 | 装饰位移 <= distance-hero；子动画用 reveal，延迟不超 delay-max，整体不超 duration-hero | 同一标签页会话一次；返回首页不重演 |
| motion.route | 普通页面导航 | hover + standard，内容淡变；不做全屏滑动 | 路由改变一次；浏览器返回恢复位置 |
| motion.image | 预览图/生成结果就绪 | hover + standard，交叉淡变；容器尺寸固定 | 新结果一次，旧结果重开不重播 |
| motion.progress | 有可验证的新进度 | micro + linear；填充用 scaleX、左侧原点 | 只响应真实值，不自行递增 |

- Hero 标题、主 CTA 从首帧可读可点，最多作微小位移；不得等图片/动画结束才显示入口。无法初始化动画时内容仍可见，不能默认 CSS 全部 opacity:0。
- stagger 只用于最多 5 个装饰/内容组；延迟按 min(index × stagger, delay-max)，更多列表项直接显示。不得对每张衣物卡依次延迟。
- 卡片倾斜仅作用内部媒体层，命中框/标题/操作固定；pointerleave、blur、pointercancel 立刻开始回正。
- reveal 大区块若高度超过视口，观察其标题或前导锚点，避免永远达不到 0.2；快速滚动或回到历史位置时已可见内容直接显示。
- 默认不做共享元素转场；后续确有上下文收益时单独评审，不为 Rich Motion 而添加。
- Toast/Tooltip 的停留、延迟属于交互等待时间，见组件规范，不等于动画时长。

## 3. 中断、滚动与生命周期

- 最新意图优先：快速开关/再次点击时从当前值过渡到新目标，不排队播放旧动画；退出中的组件不接受新的后台点击。
- UI、路由、焦点与请求状态立即更新，不通过等待 animation complete 决定操作是否生效。退出动画只负责短暂视觉收尾；不能把焦点留在即将卸载节点上。
- 动画、scroll/pointer 监听和 observer 在卸载时清理；窗口隐藏或目标离屏暂停持续工作。StrictMode 重挂载不产生两份 timeline/监听。
- 视差仅在 >= lg、fine pointer、支持 hover 且无 reduced motion 的首页 Hero 开启；范围固定 ±parallax-max，最多一个视差区域、三个装饰层，不对正文和业务控件做视差。
- 滚动保持原生，不劫持滚轮/触摸，不用长距离 pin 强迫观看。位置采样合并进 requestAnimationFrame，避免每个 pointermove 写 React state。
- 页面路由变化尊重浏览器返回位置；锚点平滑滚动仅在无 reduced motion 且为用户主动跳转时使用。

## 4. Reduced motion、触屏与低性能降级

应用可访问性设置提供“跟随系统 / 减少动态效果”；减少模式 = 系统 reduce 或站内减少开关，站内不能强行覆盖系统减少。P1 在已有设置/菜单入口中承载，不为此扩展独立业务模块。

| 效果 | 常规桌面 | 触屏或移动/平板 | reduce / 动画资源不可用 |
| --- | --- | --- | --- |
| Hero/内容进入 | 按模式 | 位移最多 distance-enter，无倾斜 | 最终位置直接显示；必要淡变 <= fast，无延迟 |
| 视差/倾斜 | 满足第 3 节才开启 | 关闭 | 关闭 |
| 卡片 hover | 内部媒体抬升 | 无 hover，点击直接操作 | 无位移/缩放，保留边界反馈 |
| Dialog/Sheet | 按模式 | 同交互，位移不遮住控件 | 无平移；直接呈现或 fast 淡入淡出 |
| 图片/路由 | 淡变 | 淡变 | fast 淡变或直接切换 |
| Spinner / Skeleton | 有限状态动画 | 同左 | 静态标记 + 可读状态，不旋转、不闪烁 |

- 背景视频、自动轮播、粒子和持续漂浮不作为 P0 默认能力。若需未来扩展，单独确认暂停机制和素材预算。
- Spinner 常规旋转周期 1000ms（linear），只在实际等待时存在；超过 5s 后改为静态“处理中”标记。Skeleton 不使用大面积 shimmer；可做 1500ms 的 opacity 0.7–1 往返 pulse，最多 3 轮后静止。后台任务仍可继续，不能靠循环动画解释长任务。
- 动画降级不隐藏任务进度、错误或交互反馈；不制造快速明暗闪烁。
- 首次性能测量不达预算时，按倾斜 → 视差 → 装饰进入的顺序降级，保留状态反馈；无需另加猜测设备档位的检测框架。

## 5. 引擎与性能约束

- React 默认 **Motion**；简单颜色/焦点状态可以 CSS。GSAP 仅在已验证需要复杂时间轴时按页懒加载。不能让 CSS transition、Motion、GSAP 同时写同一元素的同一属性；必要时分离静态外壳与动画内层。
- 动画主路径只用 transform / opacity。阴影预置在伪元素上通过 opacity 显隐，不逐帧插值大范围 box-shadow、blur、filter 或 backdrop-filter。
- 不动画 top/left/width/height/margin 等布局属性；内容展开用已知容器与 transform/opacity，无法无损实现时直接重排。业务表格/长列表禁止全量 layout animation。
- will-change 只在动画期间给当前参与元素，结束释放；避免把整页永久提升到独立合成层。首页同屏主动装饰动画最多 3 层，业务页最多 1 个强调反馈，必要任务状态图标不计装饰层。

以下是 P1 起的项目预算，**不是本次文档已实测结果**：

| 项目 | 初始验收预算 |
| --- | --- |
| 初始 JS | <= 250 KiB gzip，不含后续用户主动打开的懒加载 chunk；共享依赖计入首屏 |
| 初始 CSS | <= 50 KiB gzip |
| 首屏所需字体 | <= 200 KiB 实际传输；含中英文首屏子集 |
| 首屏图片总量 | 移动 <= 500 KiB；桌面 <= 800 KiB；不含下屏懒加载图 |
| 首页 LCP / CLS | 实验室目标 <= 2.5s / <= 0.1；图片先占位 |
| 关键输入反馈 | <= 200ms 可见反馈；不把 AI 等待算作交互处理时间 |
| 动画帧 | 60Hz 设备目标 60fps；连续 10s trace 中帧时长 p95 <= 20ms |
| 主线程 | 动画不得产生 > 50ms 的自身长任务 |

记录设备、浏览器、网络、CPU 限速和 trace；弱网下优先文本/控件、静态低成本素材。若预算超出，提交具体证据与整改/例外评审，不能口头说“很流畅”就通过。

## 6. 实现与验收依据

Motion 的全局 reducedMotion 与局部偏好检测需要同时覆盖自定义视差和 CSS 动画；不能以库开关代替整页测试。参见 [Motion 官方可访问性指南](https://motion.dev/docs/react-accessibility)。完整截图与 trace 的验收方法见[设计验收](design-acceptance.md)。
