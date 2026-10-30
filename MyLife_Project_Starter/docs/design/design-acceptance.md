# 设计一致性与验收

状态：P0 规范与静态证据；以下页面/真机/性能验收要在原型或实现存在后执行。本轮没有业务代码、运行中页面或高保真成稿，不把检查清单当作已通过记录。

## 1. 验收原则与证据

设计师与 React 开发使用同一份 [Design System](design-system.md)、[响应式规范](responsive-guidelines.md)、[组件规范](component-spec.md)、[Motion System](motion-system.md) 和[首页规范](homepage-spec.md)。Review 记录必须包含：版本/提交、页面或组件、主题、视口、浏览器/设备、状态、预期与实际、截图/trace、问题结论。

阻断交付：方向变化、关键操作不可达、文字不达对比度门槛、焦点丢失/被遮住、错误无法恢复、手机横向溢出、私有内容泄露、缺少 reduced motion。轻微材质/阴影审美差异可记录给 D 系列决策评审，不自行产生新 Token。

## 2. 视觉一致性

- [ ] 使用同一套语义色、字体、间距、圆角、控件尺寸与图标笔画；没有页面私有 HEX、任意间距或库默认色混入。
- [ ] Home 的 Dark Hero 与 Light 内容区、Wardrobe 的 Light、工作台的混合主题符合规范；跨区 Portal 继承正确主题。
- [ ] 同一排版角色、相邻容器、卡片内边距可对齐；同类元素不在不同页有不同规则。
- [ ] 每个任务操作区只有一个主操作；正文、辅助说明、状态与入口层次清楚，不把全部内容做成同权重浮卡。
- [ ] 业务照片使用规定比例、contain 与中性舞台，保留原色；Hero 单独记录构图/素材来源和手机裁切。
- [ ] hover / pressed / selected / focus-visible 可区分，选中和错误不只靠色彩；disabled 原因有可读说明。
- [ ] 渐变或摄影背景上的文字逐张验证最差对比位置；不能用纯色 Token 的通过结果替代照片上的检查。
- [ ] 同一组件在 Dark、Light、Dark 内嵌 Light、相邻主题切换处保持一致；弹窗/下拉/Tooltip 不漏用 body 默认主题。

## 3. 对比度静态证据（2026-10-30）

颜色门槛沿用 Design System：普通文字采用 4.5:1，必要非文字边界/状态指示采用 3:1。品牌装饰色、disabled 文本、照片像素不属于本轮的正常正文色配对；装饰边界 border 不作为唯一控件识别线。

本轮从 Design System 色表直接提取 HEX 并用 sRGB 相对亮度计算。每通道先归一化为 c：c <= 0.04045 时为 c/12.92，否则为 ((c+0.055)/1.055)^2.4；L = 0.2126R + 0.7152G + 0.0722B；对比度 = (较亮 L + 0.05)/(较暗 L + 0.05)。判定使用未四舍五入值，表中仅显示两位小数。

| 检查对象 | Light | Dark | 用途 |
| --- | --- | --- | --- |
| text-muted / canvas | 5.35:1 | 7.01:1 | 辅助文字 |
| text-muted / surface-pressed | 4.59:1 | 4.68:1 | 辅助文字最不利中性状态 |
| border-control / surface-pressed | 3.07:1 | 3.74:1 | 必需控件边界 |
| focus / surface-pressed | 5.36:1 | 6.53:1 | 焦点环在相邻主题底色上 |
| action-fg / action-pressed | 10.28:1 | 13.39:1 | 主按钮按下 |
| selection-fg / selection-bg | 5.48:1 | 7.28:1 | 选中文字 |
| success-fg / success-bg | 6.35:1 | 7.90:1 | 成功 |
| warning-fg / warning-bg | 5.96:1 | 7.77:1 | 警告 |
| info-fg / info-bg | 6.44:1 | 7.78:1 | 信息 |
| danger-fg / danger-bg | 5.61:1 | 7.07:1 | 错误 |

覆盖 **210 项色对/门槛校验，全部通过**（同一色对作为文字与边界时按各自门槛检查）：

- text-primary、text-secondary、text-muted、link、link-hover、link-pressed 对 canvas、surface、surface-raised、surface-subtle、surface-hover、surface-pressed、selection-bg，双主题。
- border-control、border-hover、focus、selection-fg 对上述七类背景，双主题。
- action-fg 对 action-bg/hover/pressed；on-danger 对 danger-action/hover/pressed；selection-fg 对 selection-bg，双主题。
- success、warning、info、danger 的 fg 对各自 bg，以及前述六类非 selection 中性底色，双主题。

旧色 #737782 对 #F5F3EF 为 4.04:1；新 text-muted 保留灰色调但提高对比度。上述证据不是整站无障碍认证；真实素材、透明叠加、字体渲染、CSS 映射和交互仍须验收。颜色改变后必须重算并更新此表。

计算与阈值依据：[W3C 普通文字对比度](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)、[W3C 非文字对比度](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)。

## 4. 状态、键盘与辅助技术

在 Light / Dark 各展示 Button、Field、选择控件、Tabs、Card、Upload、Dialog/Sheet、Menu/Tooltip 和 Feedback 的全部适用状态；组件规范的“不适用”需要注明原因。

- [ ] default、hover、focus-visible、pressed、selected、disabled、loading、invalid、success、readonly 覆盖适用组件；异常和恢复状态可主动触发演示。
- [ ] Tab / Shift+Tab 顺序符合阅读顺序；按钮、链接、表单、Tabs、菜单遵守各自键盘语义，无键盘陷阱。
- [ ] Dialog/Sheet 打开正确聚焦、背景不可交互、关闭可恢复；暗区触发的弹窗仍为 Dark；嵌套菜单没有越过模态范围。参照 [W3C Dialog 模式](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)。
- [ ] 焦点环不被导航、底栏、遮罩、overflow 裁切；项目要求当前聚焦操作完整可见。参照 [W3C Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)，此处是项目更严格的目标。
- [ ] 图标有可读名称，字段 Label/帮助/错误已关联；图片替代文字合理；状态变化播报一次，不跟着 spinner 重复读。
- [ ] Loading 连续触发不会重复提交；失败保留输入；查询失败不会错误地显示“生成失败”或重复计费提交。
- [ ] 危险操作有明确对象与确认；视图关闭不伪装成服务端取消成功。

## 5. 响应式与内容压力测试

按响应式规范的完整宽度/断点矩阵执行，不再另建断点。

- [ ] 常规视口、断点两侧、横屏、短视口、软键盘均无丢失内容/遮挡操作/页面横向溢出。
- [ ] 200% 文字放大后不裁切控件；320 CSS px 等效宽度可重排。依据 [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) 与 [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)。
- [ ] 按 [W3C Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) 将行高 1.5 倍、段后距 2 倍、字距 0.12em、词距 0.16em 作为用户覆盖测试，无内容/功能丢失；这不是要求修改默认排版，中文按适用属性测试。
- [ ] 使用长中英文名称、长 URL、缺失图片、单项/大量数据、空数据、网络超时与会话过期。
- [ ] 触屏无需 hover 即可发现编辑、删除、选择、上传与重试；任务跨断点切换不丢失选择/输入。
- [ ] 图片有占位尺寸，字体 swap 与错误状态切换不造成明显跳版。

## 6. 动效与性能

- [ ] 所有动画映射到命名模式，无 CSS/Motion/GSAP 的同属性竞争。
- [ ] 快速点击、切换、返回、离开页面不会排队播放旧动画或留下监听；后台与离屏暂停。
- [ ] 系统 reduce、站内减少、coarse pointer、无 hover、资源加载失败分别检查；任务状态仍可理解。
- [ ] 主要操作首帧可用，Hero 不延迟入口；没有滚动劫持、无意义循环、颜色闪烁。
- [ ] Motion 文档资源与时间预算逐项有证据，不以“看起来流畅”替代测量。

P1 首次实现的可复现测量建议：生产构建；Chrome 当时稳定版（记录版本）；390px 视口、CPU 4× slowdown、下载 1.6Mbps / 上传 750Kbps / RTT 150ms、冷缓存运行 3 次，记录中位 LCP 和最差 CLS。资源预算取 Network 实际传输/构建 gzip 报告。交互与动画另在无 CPU 限速的真实 60Hz 手机和桌面录制 10s trace，按 Motion 预算报告帧时长与长任务；实验室模拟不替代真机。

P0 只完成规范和配色数学检查，尚无上述测量结果。

## 7. 文档维护与交付清单

- [ ] 相对 Markdown 链接存在；Token 引用可解析，所有主题值成对完整。
- [ ] 断点、排版、尺寸、motion、叠层只有一个权威数值来源；首页与架构使用引用。
- [ ] 没有把建议基线写成“用户已确认”，D-01 至 D-06 的状态清楚。
- [ ] 提交只包含设计与必要关联文档，无业务代码、运行时依赖或无关文件。
- [ ] 后续交接包含页面稿、组件状态样张、素材/授权/裁切、动效说明、未解决问题和评审结论。

本轮静态修订不勾选原型/实现阶段清单。最终提交报告记录本次实际执行的链接、Token、对比度与 diff 检查，阶段完成情况按[路线图](../roadmap/development-roadmap.md)判断。
