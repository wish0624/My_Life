# 核心组件规范

状态：P0 开发执行基线。颜色、字体、共享尺寸只引用 [Design System](design-system.md)，设备规则引用[响应式规范](responsive-guidelines.md)，动画引用 [Motion System](motion-system.md)。本文件定义结构和状态，不实现业务或第三方服务。

## 1. 全组件交互契约

- 普通操作用 button，导航用 a；不把 div 加点击事件当控件。按钮写明 type，纯图标控件必须有可读名称。
- 最小点击宽高使用 `--ml-target-min`；可视图标可更小。hover 仅在 `(hover: hover) and (pointer: fine)` 开启；所有功能都有点击/键盘等价入口。
- focus-visible 使用 `--ml-focus-width` 实线、`--ml-color-focus`、`--ml-focus-offset`；不被 overflow 裁掉。不能只在 hover 显示关键操作。
- 样式优先级：disabled > loading > invalid > selected > pressed > hover > default；焦点环独立叠加，不被错误或选中覆盖。只合并适用状态，不给非表单控件编造 invalid。
- disabled 不响应激活、不执行 hover/按下动画；原生可禁用控件用 disabled，非原生用 aria-disabled 并阻止激活。必要原因显示在附近正文，不能只在禁用控件 Tooltip 里。
- loading 保留原尺寸、当前焦点与可理解标签；用 aria-busy 与 aria-disabled 阻止重复激活。读屏只播报任务变化，不逐帧播报动画。未知进度不伪造百分比。
- readonly 可聚焦、选择和复制，与 disabled 分开。表单错误用 aria-invalid、aria-describedby 关联字段；成功不能仅变绿。
- 操作失败保留输入与已选素材，提供有意义的重试/修改入口；未获后端确认不显示成功。
- 没有实现的状态标“未适用 + 原因”，不能删掉状态验收项。焦点、选中、错误均在双主题样张中展示。

## 2. Button、IconButton 与 Link

尺寸均为最小高度，文案放大时可增长，不裁剪文字。

| 尺寸 | 高度 | 水平内边距 | 图文间距 | 图标 | 文字 |
| --- | --- | --- | --- | --- | --- |
| sm | control-height-sm | space-4 | space-2 | icon-md | label + semibold |
| md（默认） | control-height-md | space-5 | space-2 | icon-md | label + semibold |
| lg（Hero 主操作） | control-height-lg | space-6 | space-2 | icon-lg | body + semibold |

本表及下文简写规则：色名补 `--ml-color-`，空间/圆角/尺寸补 `--ml-`（如 space-4 → `--ml-space-4`）；motion.* 是 Motion 文档的模式名，不是 CSS Token。统一 radius-control；IconButton 宽高相同，移动端不缩小。相邻操作间距 space-3；每个任务操作区只放一个主按钮。

| 变体 | default | hover | pressed | 其他 |
| --- | --- | --- | --- | --- |
| primary | action-bg / action-fg | action-hover | action-pressed | 无额外边框 |
| secondary | surface / text-primary + border-control | surface-hover + border-hover | surface-pressed | 有边框 |
| ghost | 透明 / text-primary | surface-hover | surface-pressed | 必须位于明确实色主题区 |
| danger | danger-action / on-danger | danger-hover | danger-pressed | 只用于删除等破坏动作 |
| link | link，带下划线 | link-hover | link-pressed | 正文导航保持 a 语义 |

- focus-visible 统一焦点环；按钮按下动效使用 motion.press，Link 不缩放。
- disabled：统一 disabled-bg / disabled-fg / disabled-border，取消阴影；Link 不使用假 href 或仍可导航的“禁用链接”，未开放入口显示说明文本。
- loading：保留该变体背景，左侧放与图标同尺寸的状态标记，文字“正在保存…”等；无图标位置也预留宽度，不能因 spinner 挤压按钮。超时/失败恢复可操作状态，并显示字段/面板错误，不把按钮永久留在 loading。
- 成功：任务面板/Toast 显示结果，按钮恢复正常；避免仅用一闪而过的对勾说明保存成功。

## 3. Field：Input、Textarea、Select

| 部位 | 规格 |
| --- | --- |
| Label | label；必填文字/符号有可访问解释，不只靠颜色 |
| Label 到输入 | space-2 |
| Input / Select | 最小高度 control-height-md；左右 space-4、上下至少 space-2；radius-control；border-width + border-control；surface |
| 输入文字 | body / text-primary；placeholder 用 text-muted，不替代标签 |
| 前后图标 | icon-md；与文字 space-2；清空/显隐操作保留 target-min |
| Textarea | 最小高度 120px；内边距 space-4；允许竖向伸展 |
| 帮助/错误说明 | body-sm；输入后 space-2；预留至少一行说明位置 |
| 字段组 | 字段间 space-6；分组标题后 space-4 |

| 状态 | 样式与行为 |
| --- | --- |
| hover | border-hover；不改变布局 |
| focus-visible | 全局焦点环；保持边框 |
| filled | 正文色；不以 placeholder 色显示已输入内容 |
| readonly | surface-subtle；可读可复制，标注“只读” |
| disabled | disabled 系列；Label 保持可读 |
| invalid | danger-fg 边框 + 文字错误；焦点仍保留 focus 环 |
| success | 必要时 success-fg 图标 + 已验证文案；不为每个有效字段加绿色装饰 |
| validating | 尾部状态标记、aria-busy；保留输入；旧请求结果不得覆盖新的输入校验 |
| submit failure | 保留所有字段；聚焦首个错误字段，长表单另有错误摘要 |
| submit success | 明确确认保存结果与后续入口；不无提示地清空 |

控件高度是最小值，放大文字后按行高和内边距增长，不使用固定高度截断。普通字段在首次 blur 或提交后校验；已显示错误的字段在修正时更新；不在未触碰字段上初始报错。服务端错误与本地格式错误均有对应文案。

Select 第一版优先原生单选，保持标签与上述尺寸，操作系统菜单允许原生表现。若内容需要搜索，才使用统一 Combobox：展开/收起有 aria-expanded；方向键移动候选、Enter 选中、Esc 关闭并保留焦点；结果 loading、无匹配、网络错误分别显示，错误提供重试。候选项最小高度 control-height-sm，菜单几何见第 8 节；不得自行做缺少键盘支持的 div 下拉框。

## 4. Checkbox、Radio、Switch、FilterChip

| 组件 | 可视尺寸 / 结构 | 状态 |
| --- | --- | --- |
| Checkbox | 20px 方框、radius-sm；与标签 space-2；整行 target-min | 未选 surface + border-control；选中 action-bg/action-fg 勾；indeterminate 用横线并向辅助技术暴露 |
| Radio | 20px 圆；选中内圆 8px；命中区 target-min | 未选同 Checkbox；选中用 selection-fg；单选组标签明确 |
| Switch | 44×28px 轨道、20px thumb、左右/上下 4px；命中高度 target-min | off 为 surface-subtle + border-control，thumb=text-secondary；on 为 action-bg，thumb=action-fg |
| FilterChip | 高度 control-height-sm；左右 space-3；radius-pill | 未选 secondary；选中 selection-bg/selection-fg + 内环；用 aria-pressed |

hover 仅作用于未禁用项的边界；按下不改变列表位置。focus-visible 放在完整命中区。disabled 用 disabled 系列；invalid 用组错误与 danger 边界；切换需要异步确认时保留当前值并显示保存中，不提前显示成功。失败恢复可重试状态并说明；不让 spinner 替代选中含义。

Checkbox / Switch 用 Space 切换；Radio 用方向键在组内切换；FilterChip 用 Enter/Space。可视标签点击与控件等价。删除型标签的“移除”是独立命名按钮，命中区不能与标签选择区域重叠。

## 5. Tabs、导航与用户菜单触发器

- Tabs 高度 control-height-md，左右 space-4，间距 space-2。未选 text-secondary；hover 为 surface-hover；选中 text-primary + 底部 selection-width 的 selection-fg 指示线，禁止选中时换字重造成位移。
- Tabs 使用 tablist/tab/tabpanel 语义；左右键、Home/End 移动焦点，Enter/Space 激活（基线采用手动激活，适合异步面板）。仅活动 Tab 在正常 Tab 序列中；方向键跳过 disabled。面板 loading/empty/error 在面板内部处理，不销毁整组 Tabs。
- 主导航高度、收起时机见响应式规范；当前页用 aria-current="page" + 选中指示。导航是链接集合，不冒用 Tabs 语义。
- 未开放模块不出现可点击假入口。用户菜单触发器的头像视觉为 32px，外围 target-min；空头像用用户名首字或中性图标，加载失败同此兜底；不得显示其他人的图片。
- 移动菜单为模态 Sheet；打开后锁定背景、可键盘关闭，状态和焦点规则与 Dialog 相同。不能通过第二次点击才揭示唯一导航入口。

## 6. Card、媒体、Avatar 与选择卡

| 组件 | 结构 | 规格 |
| --- | --- | --- |
| 普通内容卡 | 内容面板 | surface、border、radius-card、shadow-none；内边距桌面/平板 space-6，移动 space-4 |
| 模块卡 | 媒体 + 标题 + 描述 + 入口 | 媒体 16:10，object-fit: cover；卡内遵守同样排版；标题 card |
| 衣物卡 | 完整衣物图 + 名称/状态 + 操作 | 图片 1:1、contain、photo-stage；主体内留 space-4；标题最多两行 |
| 形象/穿搭卡 | 人物预览 + 名称/状态 | 图片 3:4、contain、photo-stage；不裁掉头脚或衣物主体 |
| Avatar | 头像图或 fallback | 32 / 40 / 64px 三档、radius-pill；交互外壳至少 target-min |

- 导航卡 hover 用 shadow-raised + motion.card；pressed 返回更低位移；focus-visible 围绕实际入口。非交互信息卡不模拟 hover 浮起。
- 选择卡用 selection-width 内环 + selection-fg + 可见勾选标记，底色 selection-bg；不能因增加 border 改变宽高。单选采用 Radio 组，多选采用 Checkbox，导航卡与选择卡是不同变体。
- 卡片内存在“更多/收藏”等操作时，主入口与操作按钮使用同级可聚焦元素，不在链接里嵌套 button，不用整卡点击劫持子操作。
- loading 维持媒体比例和文字占位；禁用选择卡保留可读原因；图像 error 展示等比例占位、文字“图片暂不可用”及适用的重试入口，不破坏其它操作。
- 图片在加载前保留宽高比；装饰图 alt 为空，业务图用简明替代文字。对象存储私有图加载错误不能回退到公开访问。
- 内容名称缺失显示“未命名衣物/形象/穿搭”；不可让空标题导致无名交互目标。

## 7. Upload / URL 输入面板

- Upload 区 surface + 1px 虚线 border-control、radius-card、内边距 space-6；最小高度移动 160px、其它 200px。图标 icon-lg；按钮必须可键盘打开文件选择器，拖放只是补充。
- default 显示用途、允许类型、大小与尺寸限制。这些值来自产品/API 配置，P0 未决定时在原型标“示例限制”，不写成后端已支持。
- drag-over 使用 selection-bg + selection-fg 实线边界；无 hover 的设备保持正常文件选择入口。
- 本地校验失败：danger 提示具体原因；上传失败：保留已选文件信息和重试/移除；禁用：说明先决条件。
- 上传百分比只来自实际传输；后续识别/去背景/生成是独立阶段，不把上传到 100% 当处理完成。
- uploading / processing 显示状态和已有预览；若支持取消才显示“取消”；取消请求不等于后台已取消。
- complete 展示预览及替换/移除，进入用户确认步骤；原图与处理图切换不变容器尺寸。
- URL 面板复用 Field + Button；解析失败保留网址，提供手动上传/填写，禁止只弹瞬时 Toast 后丢失输入。
- 真人照片上传旁保留用途、第三方处理和删除入口说明；UI 不能把未确认的照片处理条件默认为用户授权。

## 8. Dialog、Sheet、Menu / Popover、Tooltip

| 组件 | 几何 / 外观 |
| --- | --- |
| Dialog | 默认最大宽 560px，确认型 400px，预览型 960px；宽度不得超过视口减两侧 layout-gutter；radius-panel、surface-raised、shadow-overlay |
| Dialog 内容 | 内边距移动 space-4，其它 space-6；标题 section；标题与正文 space-4；正文与操作 space-6；高度边界见响应式规范 |
| Sheet | 桌面侧栏最大宽 400px；移动全宽；上下/侧向呈现按响应式规范；surface-raised |
| Menu / Popover | 宽度默认 240px、最大 320px，且不超视口安全区；内边距 space-2；radius-card、border、shadow-raised |
| Menu item | 最小高度 control-height-sm；左右 space-3；radius-sm；图标 icon-md |
| Tooltip | 最大宽 240px；内边距竖 space-2、横 space-3；body-sm；surface-raised/text-primary；border + shadow-card |

- Dialog / Sheet：标题可访问命名；打开焦点到标题或合适首项，危险确认默认落在取消；Tab 留在模态范围；Esc 关闭；关闭后还给触发器，若触发器已移除则回到合理后续入口。背景 inert，锁滚动，避免滚动条消失引起页面横移。
- 普通非编辑弹层可点击遮罩关闭；有未保存输入的编辑弹层，遮罩不关闭，显式关闭/Esc 先在当前弹层询问是否放弃，不叠第二个 Dialog。
- 弹层内请求错误保持内容和焦点；提交中可关闭视图，是否继续任务须显示真实含义，不能把关窗当取消后端。破坏操作进行中禁止重复提交，关闭后由任务反馈区继续提供结果。
- 菜单 hover 使用 surface-hover，pressed 使用 surface-pressed，危险项用 danger-fg；选中项加勾/文字，不只改色；disabled 跳过键盘导航。
- Menu 用方向键/Home/End、Enter 激活、Esc 返回触发器；Popover 内是普通表单时用正常 Tab 顺序，不误用 menuitem。
- Tooltip 在 hover 停留 500ms 或键盘 focus 时显示，离开后 100ms 隐藏；可移入提示、Esc 关闭；触屏不依赖长按获取必需信息。提示不包含交互按钮；有交互改用 Popover。
- 弹层在视口边缘翻转/避让，至少保留 layout-gutter；层级仅用 Design System 的 z Token，模态内菜单必须仍在该模态的焦点与主题上下文。

## 9. Feedback：Badge、Alert、Toast、Skeleton

| 组件 | 规格与状态 |
| --- | --- |
| Badge | 24px 最小高度、左右 space-2、caption、radius-pill；中性用 surface-subtle/text-secondary；语义用对应 status-bg/status-fg，含状态文字 |
| Alert | 内边距 space-4、radius-control、1px 对应 status-fg 边界；图标 icon-md；正文 body-sm；错误/重试一直可见至处理 |
| Toast | 最大宽 360px，移动按视口减两侧 layout-gutter；内边距 space-4；surface-raised、shadow-raised；最多同时 3 条，其余合并/排队 |
| Skeleton | skeleton 色、radius-sm；尺寸与最终内容匹配；装饰部分 aria-hidden，容器 aria-busy + 可读“正在加载” |
| Empty / Error panel | space-6 内边距、section 或 card 标题、body 说明、一个清晰后续操作；图片失败与整个列表失败区分 |

- Toast 成功/普通通知默认 6000ms，hover/focus 时暂停；错误或含用户操作的 Toast 不自动消失，提供关闭。关键错误还必须留在页面里。普通反馈用 polite，立即阻碍任务的错误才用 alert，避免重复播报。
- Toast 位于右下角；移动在底部安全区和固定操作栏之上，不能覆盖提交按钮；模态打开时不要生成可抢焦点的后台 Toast 操作。
- 骨架与 spinner 使用 Motion 的限时/降级规则；加载超过 10s 显示“耗时较长”及适用的返回/稍后查看，不伪判为失败。
- 空状态分首次无数据、筛选无结果、无权限/会话失效、接口错误；各自入口为创建、清除筛选、重新登录、重试，不复用一张“暂无数据”图。

## 10. 生成任务与结果面板（展示契约）

面板沿用 Card，阶段列表项最小高度 control-height-sm、间隔 space-2；预览沿用形象/穿搭卡；进度轨道高 4px，surface-subtle + accent 填充。以下是 UI 状态映射需求，不宣称后端状态枚举/API 已确定；P0 后续须对齐任务模型。

| UI 状态 | 展示与可执行动作 |
| --- | --- |
| idle / 未满足条件 | 选择摘要、缺少条件；生成按钮禁用并解释 |
| submitting | 保留摘要、正在提交；防止重复提交 |
| queued | “等待处理”，显示真实任务标识/时间（接口提供时）；不估造百分比或倒计时 |
| running | 当前阶段 + 不定进度；后端有可验证进度才显示百分比 |
| slow / 暂时无法查询 | 保留已知任务与阶段，提示稍后查询；查询失败不等于任务失败，不直接再创建一单 |
| succeeded | 结果预览、保存/重新生成等实际支持的入口；不自动当作用户已保存 |
| failed | 可理解原因、保留选择、明确重试代价；重新生成与查询重试分开 |
| cancelled | 仅在服务端确认后显示；取消能力未提供时隐藏取消动作 |
| result unavailable | 结果图片或访问失败独立报错，允许重新加载；不把图片下载失败当 AI 生成失败 |

同一会话重复访问结果不重播整段 Hero 动画；结果 reveal 一次即可。真实照片、候选数量、任务阶段名称和可取消能力须由产品/API 决定，设计稿使用标明的模拟数据。
