# MyLife Design System v1.1

状态：P0 **可执行设计基线，待高保真视觉验收**。本次补齐开发规则，不代表页面稿已完成或新增审美选择已获用户确认。

## 1. 方向与规范归属

保留 **Mixed Theme + Rich Motion + Modern Spatial UI / 3D Editorial Design**：现代、偏写实、有质感的响应式平面网站。空间感由材质、摄影、光影、叠层和适度透视形成；不做 Low-poly、游戏世界、浮岛、自由漫游，不默认引入 Three.js。

| 内容 | 唯一规范来源 |
| --- | --- |
| 视觉定位与禁用方向 | [设计哲学](design-philosophy.md) |
| 颜色、字体、间距、圆角、阴影、叠层与公共尺寸 Token | 本文 |
| 断点、容器、栅格、跨设备布局 Token | [响应式规范](responsive-guidelines.md) |
| 组件结构、变体、交互与异常状态 | [组件规范](component-spec.md) |
| 动画 Token、触发、中断、降级与性能预算 | [Motion System](motion-system.md) |
| 首页内容、主题分区与页面状态 | [首页规范](homepage-spec.md) |
| 视觉检查、对比度证据与交付标准 | [设计验收](design-acceptance.md) |

同一值只在所属文档定义，其他文档引用 Token 或规则。页面不能自行新建同义 Token、复制组件样式或覆盖共享值。变更先更新所属规范，再同步引用；仍有冲突时停止该处实现并记录差异，不凭文档日期猜测。

## 2. Token 与主题契约

- CSS 自定义属性统一使用 `--ml-` 前缀；颜色采用不透明 sRGB HEX，只有遮罩、阴影可使用 alpha。
- 下表是完整 Light / Dark 语义色基线，不进行“浅色取反”。React 组件使用语义 Token，禁止直接引用品牌 HEX 当文字色或页面私有调色板。
- P1 的运行时单一来源为 `src/styles/tokens.css`；本文是其规范依据。本次仅记录契约，不创建运行时代码。
- `:root` 明确使用 Light；每个主题区域用 `data-theme="light|dark"` 完整覆盖全部主题色、阴影和 `color-scheme`。嵌套 Light 在 Dark 中也必须完整恢复，不依赖只在根节点定义的默认值。
- Mixed Theme 是页面分区策略，不等于根据系统设置把整页反转。P0 不新增全站主题切换开关；`prefers-color-scheme` 不覆盖编辑指定的主题区域。
- 按钮、输入框跟随所在区域。Portal 的弹窗、菜单、Tooltip 继承触发源区域的显式主题；跨区打开时记录触发源，不从 `body` 猜测。
- 渐变、图片或半透明材质不能作为正文的唯一底色保障；文字块必须有通过对比度检查的实色衬底，或逐张检验素材最差位置。

### 2.1 原始品牌色（只用于素材与装饰）

| Token | 值 | 使用边界 |
| --- | --- | --- |
| `--ml-brand-champagne` | #C4A779 | 少量品牌点缀；不是浅底正文色 |
| `--ml-brand-silver` | #AEB7C2 | 材质与静态装饰 |
| `--ml-brand-olive` | #78836E | 素材配色；不直接等同成功状态 |
| `--ml-brand-terracotta` | #B87964 | 素材配色；不直接等同错误状态 |

### 2.2 语义颜色

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--ml-color-canvas` | #F5F3EF | #171A20 | 页面底色 |
| `--ml-color-surface` | #FFFFFF | #20242C | 卡片、输入框、主要面板 |
| `--ml-color-surface-raised` | #FFFFFF | #2B303A | 弹窗、菜单 |
| `--ml-color-surface-subtle` | #EDEAE4 | #12151B | 媒体占位、内嵌区 |
| `--ml-color-surface-hover` | #F0EDE7 | #292E38 | 中性组件悬停 |
| `--ml-color-surface-pressed` | #E7E2D9 | #323945 | 中性组件按下 |
| `--ml-color-text-primary` | #20232A | #F5F3EF | 主文字、功能图标 |
| `--ml-color-text-secondary` | #565D68 | #B4BBC7 | 次级说明 |
| `--ml-color-text-muted` | #5F6470 | #9CA5B3 | 辅助文字、placeholder；不可再减 opacity |
| `--ml-color-border` | #E7E4DE | #3B414C | 装饰分隔、普通卡片边缘 |
| `--ml-color-border-control` | #7C8089 | #8993A3 | 输入、未选复选框等必需边界 |
| `--ml-color-border-hover` | #565D68 | #B4BBC7 | 控件 hover 边界 |
| `--ml-color-focus` | #71552D | #D8BF95 | 键盘焦点环 |
| `--ml-color-accent` | #71552D | #D8BF95 | 品牌语义文字、选中标记 |
| `--ml-color-link` | #71552D | #D8BF95 | 正文链接，默认下划线 |
| `--ml-color-link-hover` | #5A4120 | #E9D4B0 | 链接 hover |
| `--ml-color-link-pressed` | #48331A | #C4A779 | 链接 active |
| `--ml-color-selection-bg` | #EDE4D6 | #353128 | 选中卡片、Tab、文本选区 |
| `--ml-color-selection-fg` | #71552D | #D8BF95 | 选中内容与边界 |
| `--ml-color-action-bg` | #171A20 | #F5F3EF | 主按钮 |
| `--ml-color-action-hover` | #292E38 | #FFFFFF | 主按钮 hover |
| `--ml-color-action-pressed` | #3A414D | #E6E1D9 | 主按钮 active |
| `--ml-color-action-fg` | #FFFFFF | #171A20 | 主按钮文字与图标 |
| `--ml-color-disabled-bg` | #ECE9E3 | #252A33 | 禁用控件 |
| `--ml-color-disabled-fg` | #70737B | #8D96A5 | 禁用文字；原因说明用正常正文色 |
| `--ml-color-disabled-border` | #D5D1C9 | #454D59 | 禁用边界 |
| `--ml-color-success-bg` | #E7EEE5 | #24352A | 成功提示浅底 |
| `--ml-color-success-fg` | #425B3D | #B4D2AF | 成功文字、图标、边界 |
| `--ml-color-warning-bg` | #F5E9D2 | #3B3020 | 警告提示浅底 |
| `--ml-color-warning-fg` | #71521F | #E4C58B | 警告文字、图标、边界 |
| `--ml-color-info-bg` | #E9EDF2 | #24323F | 信息提示浅底 |
| `--ml-color-info-fg` | #42566B | #B5CADF | 信息文字、图标、边界 |
| `--ml-color-danger-bg` | #F8E8E3 | #3C2828 | 错误提示浅底 |
| `--ml-color-danger-fg` | #A13932 | #F2A79D | 错误文字、图标、输入边界 |
| `--ml-color-danger-action` | #A13932 | #F2A79D | 危险按钮实色 |
| `--ml-color-danger-hover` | #882F29 | #FFC0B8 | 危险按钮 hover |
| `--ml-color-danger-pressed` | #70251F | #E69A90 | 危险按钮 active |
| `--ml-color-on-danger` | #FFFFFF | #171A20 | 危险按钮文字 |
| `--ml-color-skeleton` | #E7E4DE | #353C48 | 骨架实色块 |
| `--ml-color-scrim` | rgba(18,21,27,0.56) | rgba(0,0,0,0.64) | 模态背景遮罩；不作文字底色 |

`border` 不能替代 `border-control` 识别输入区域；状态不能只靠色彩区分，必须同时有文字或可辨识图标。普通文字目标 >= 4.5:1；必要控件边界与焦点指示 >= 3:1。旧辅助色 #737782 不再用于正文；新 `text-muted` 在暖白底约 5.35:1，详见[验收证据](design-acceptance.md)。

### 2.3 Mixed Theme 页面分配

| 场景 | 执行基线 |
| --- | --- |
| Home | 导航与 Hero 为 Dark；Personal Space、Recent Activity、Footer 为 Light；模块媒体区可独立 Dark |
| Wardrobe | Light 页面与控件，衣物图片保持原色 |
| Avatar Studio | Light 控制区；人物预览用中性舞台，禁止色彩滤镜 |
| Outfit Studio | Dark 人物舞台、Light 控制面板；每区完整使用所属主题 Token |
| 弹层 | 跟随触发源主题，遮罩不改变弹层内部主题 |

照片舞台另用固定 Token `--ml-color-photo-stage: #E5E5E5`（两主题相同，不随主题染色）；只放照片，不放正文或控件。人物原图、衣物图、生成图不加金色蒙版、滤镜、混合模式或自动调色。Outfit 深色外舞台内可保留中性照片衬底。

## 3. 字体与排版

执行基线选择 **Inter + Noto Sans SC**；需在高保真评审中确认品牌适配，不宣称字体审美已经批准。

| Token | 值 |
| --- | --- |
| `--ml-font-sans` | "Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif |
| `--ml-font-mono` | ui-monospace, "SFMono-Regular", Consolas, monospace |
| `--ml-font-weight-regular` | 400 |
| `--ml-font-weight-medium` | 500 |
| `--ml-font-weight-semibold` | 600 |
| `--ml-font-weight-bold` | 700 |

下表为 字号/行高（px），实现时按 16px 基准转为 rem；不修改用户根字号。移动、平板、桌面的区间只由[响应式规范](responsive-guidelines.md)定义。字号与行高分别映射 `--ml-font-size-<角色>`、`--ml-line-height-<角色>`，下面是这两个 Token 家族的唯一数值来源。

| 角色 | 移动 | 平板 | 桌面 | 字重 / 字距 |
| --- | --- | --- | --- | --- |
| hero | 40/48 | 52/60 | 64/72 | 600 / 英文 -0.03em，中文 0 |
| page | 32/40 | 36/44 | 40/48 | 600 / 英文 -0.02em，中文 0 |
| section | 24/32 | 26/34 | 28/36 | 600 / 0 |
| card | 20/28 | 20/28 | 20/28 | 600 / 0 |
| body | 16/24 | 16/24 | 16/24 | 400 / 0 |
| body-sm | 14/22 | 14/22 | 14/22 | 400 / 0 |
| label | 14/20 | 14/20 | 14/20 | 500 / 0 |
| caption | 12/18 | 12/18 | 12/18 | 400 / 0 |

- 输入正文固定使用 body，不能为窄屏缩小输入文字。按钮使用 label + semibold；大按钮使用 body + semibold。
- 数字比较使用 `font-variant-numeric: tabular-nums`；正文不启用全局等宽。
- 单页一个 h1，语义层级不因视觉字号跳级。说明文字最长 65ch；中文正文建议容器不超过 36em。
- 标签/按钮不得省略关键含义；卡片标题最多两行，截断时详情可读完整名称。字段错误、隐私说明和任务状态不截断。
- 字体采用 WOFF2、`font-display: swap`；中文按使用字符/字体包能力子集化，避免一次载入多个完整 CJK 字重。使用真实字重，不伪造粗体。首屏加载预算见 Motion 文档。
- P0 不新增装饰衬线字体；保留将来单独评审品牌标题的可能。

## 4. 间距、尺寸与形状

| Token | 值 |
| --- | --- |
| `--ml-space-0` | 0 |
| `--ml-space-1` | 4px |
| `--ml-space-2` | 8px |
| `--ml-space-3` | 12px |
| `--ml-space-4` | 16px |
| `--ml-space-5` | 20px |
| `--ml-space-6` | 24px |
| `--ml-space-8` | 32px |
| `--ml-space-10` | 40px |
| `--ml-space-12` | 48px |
| `--ml-space-16` | 64px |
| `--ml-space-20` | 80px |
| `--ml-space-24` | 96px |
| `--ml-radius-sm` | 8px；小控件、菜单项 |
| `--ml-radius-control` | 12px；按钮、输入框 |
| `--ml-radius-card` | 16px；普通卡片 |
| `--ml-radius-panel` | 24px；大型视觉面板、弹窗 |
| `--ml-radius-pill` | 999px；徽章、头像、开关 |
| `--ml-border-width` | 1px |
| `--ml-selection-width` | 2px；选中内环，不改变布局 |
| `--ml-focus-width` | 2px |
| `--ml-focus-offset` | 2px；与控件间留底色间隙 |
| `--ml-control-height-sm` | 44px |
| `--ml-control-height-md` | 48px |
| `--ml-control-height-lg` | 56px |
| `--ml-target-min` | 44px；交互目标最小宽高 |
| `--ml-icon-sm` | 16px |
| `--ml-icon-md` | 20px |
| `--ml-icon-lg` | 24px |
| `--ml-icon-stroke` | 1.75px |

间距优先按“标签-输入 space-2、字段间 space-6、相关操作 space-3、卡片内 space-6”组合；移动卡片内收为 space-4。可点图标须有 target-min 命中区及可读名称。内联文字链接可随正文行盒，不作为密集工具栏的小图标例外。图标沿用一个线性图标集，不混用实心/多色风格；具体图标集见待确认项。

## 5. 阴影、视觉深度与真实叠层

| Token | Light | Dark |
| --- | --- | --- |
| `--ml-shadow-none` | none | none |
| `--ml-shadow-card` | 0 2px 8px rgba(23,26,32,0.06) | 0 2px 8px rgba(0,0,0,0.18) |
| `--ml-shadow-raised` | 0 12px 32px rgba(23,26,32,0.12) | 0 12px 32px rgba(0,0,0,0.32) |
| `--ml-shadow-overlay` | 0 24px 64px rgba(23,26,32,0.20) | 0 24px 64px rgba(0,0,0,0.48) |

视觉深度 D0（页面）、D1（卡片）、D2（抬升面板）、D3（Hero 素材）是材质表达，不是 z-index。D3 装饰绝不能压住菜单或弹窗。普通卡片默认 shadow-none + border；仅交互卡片按组件规范使用阴影，禁止每张卡片都重阴影。

| Token | z-index | 层级 |
| --- | --- | --- |
| `--ml-z-base` | 0 | 页面与隔离后的 Hero 根 |
| `--ml-z-content` | 1 | 页面局部内容 |
| `--ml-z-sticky` | 20 | 导航、工作台固定操作区 |
| `--ml-z-dropdown` | 30 | 页面级菜单/Popover |
| `--ml-z-backdrop` | 40 | 模态遮罩 |
| `--ml-z-modal` | 50 | Dialog / Sheet |
| `--ml-z-modal-popover` | 60 | 模态内部的菜单/Popover |
| `--ml-z-tooltip` | 70 | 当前交互上下文提示 |
| `--ml-z-toast` | 80 | 轻反馈，不挡当前关键操作 |

Hero 使用 `isolation: isolate`，内部层级限 0–3；装饰 `pointer-events: none`、无语义素材 `aria-hidden`。全局弹层不放在带 transform 的页面祖先里；只允许一个主动模态，模态内菜单归该模态的焦点范围。不得用 9999 修叠层。

## 6. React / Tailwind / shadcn 接入契约

- Tailwind 主题映射引用 CSS 语义变量；不用默认色表替代设计值。断点与尺寸映射分别引用所属规范；库版本与配置语法在 P1 锁定。
- shadcn 是交互底座，保留其语义和键盘支持；统一包装在 `components/ui`，业务页不复制一份再改单独样式。
- 若采用 shadcn 变量名，在每个主题区域建立别名，映射如下，禁止维护第二套 HEX：

| shadcn 变量 | MyLife 来源 |
| --- | --- |
| `--background / --foreground` | `--ml-color-canvas / --ml-color-text-primary` |
| `--card / --card-foreground` | `--ml-color-surface / --ml-color-text-primary` |
| `--popover / --popover-foreground` | `--ml-color-surface-raised / --ml-color-text-primary` |
| `--primary / --primary-foreground` | `--ml-color-action-bg / --ml-color-action-fg` |
| `--secondary / --secondary-foreground` | `--ml-color-surface-subtle / --ml-color-text-primary` |
| `--muted / --muted-foreground` | `--ml-color-surface-subtle / --ml-color-text-muted` |
| `--accent / --accent-foreground` | `--ml-color-selection-bg / --ml-color-selection-fg` |
| `--destructive / --destructive-foreground` | `--ml-color-danger-action / --ml-color-on-danger` |
| `--border / --input / --ring` | `--ml-color-border / --ml-color-border-control / --ml-color-focus` |

主题别名也在 theme scope 上声明，避免父节点解析后继承旧值。hover/active/disabled 直接引用对应 MyLife Token，不以全局 opacity 模拟。组件 props 与目录约定见[前端架构](../architecture/frontend-architecture.md)。

## 7. 仍需人工确认的设计决策

以下为可用于高保真制作的建议基线；它们不是新增的用户已批准决策。确认前保持此基线，避免每页自行选方案；如修改，统一更新规范。

| ID | 建议基线 | 人工确认内容 | 影响 |
| --- | --- | --- | --- |
| D-01 | Inter + Noto Sans SC；品牌文字 MyLife. | 字体观感、Logo/字标及中英文品牌文案 | 字体文件、首屏排版 |
| D-02 | 保留原四个点缀色；语义浅深色采用本文数值 | 双主题样张的暖冷、深色层次与金色比例 | 全站视觉；对比度底线不能降低 |
| D-03 | Hero 用写实产品/建筑式静态素材，分层产生空间感 | 具体主体、素材来源/授权、手机裁切 | 首页主视觉，不涉及实时 3D |
| D-04 | 首页只突出衣橱；主 CTA 使用“进入衣橱”语义 | 最终文案语言、是否展示不可点击的未来模块预告 | 内容和信息架构，不新增可用模块 |
| D-05 | Motion 使用本文链接的预算；图标选单一线性集，建议 Lucide | 高保真动效节奏与图标观感 | 组件样张；不以审美理由取消降级 |
| D-06 | Avatar 中性预览；Outfit 深色舞台 + 浅色控制面板 | 真实人物/衣物样张中的背景比例 | 关键业务页视觉，不承诺新 AI 能力 |

首页与衣橱关键稿、AI 能力边界、身份/隐私和任务数据模型仍属于 P0 后续评审事项；设计系统完成不能替代这些评审。
