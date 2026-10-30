# MyLife Design Preview

独立的 P0 视觉实验室，依据 main 的 `0471bcb` 七份设计规范实现。规范原文保持不变；此应用不替代正式首页，不包含业务后端、数据库或 AI 接口。

## 本地启动

需要 Node.js 22.12+。在本目录执行：

```powershell
npm ci
npm run dev
```

打开 **http://127.0.0.1:4173/design-preview**。A / B 也可以直接访问：

- A：`/design-preview?direction=a`
- B：`/design-preview?direction=b`

服务仅绑定本机。这个地址不是互联网共享预览地址。根路径只提供实验室入口说明，正式首页未实现。关闭终端后可再次运行启动命令。

## 两套方向

| | A / 空间门廊 | B / 生活藏品 |
| --- | --- | --- |
| 字体 | Inter Variable | Geist Variable |
| Hero | 原创 CSS 门廊、石质基座、摄影藏品 | 摄影陈列、物件式叠层、材质色卡 |
| 构图 | 稳定建筑框景与留白 | 非对称照片比例与编辑式陈列 |
| 优点 | 品牌空间感强，容纳未来生活模块 | 首期衣橱定位直观，生活气息更强 |
| 取舍 | 依赖精细比例；需用文案解释衣橱入口 | 更依赖摄影质量；可能被理解为时尚内容站 |
| 推荐 | **推荐作为主方向**，再由用户审美确认 | 保留为衣橱展示与内容编排参考 |

两案共用语义色、尺寸、组件交互、Mixed Theme 与 Motion 规则；不是单纯换颜色。中文暂使用规范允许的设备字体回退，Noto Sans SC 品牌样张及最终字标仍需确认。

## D-01 至 D-06

- D-01：实际加载本地 Inter / Geist 字体；顶部切换方案即比较字标、标题与正文。
- D-02：Dark Hero、Light 内容和双主题组件面板；暗区/亮区触发弹窗分别继承主题。
- D-03：两个独立 Hero 构图，桌面、平板与手机重排；摄影本地存放，CSS 场景原创。
- D-04：衣橱 CTA 可打开筛选/选择/空态演示；筹备中模块可开关对照，始终不可进入。
- D-05：有限媒体视差、卡片反馈、方案淡变、按下/焦点/Loading；统一线性 SVG 图标；系统/站内 reduced motion。
- D-06：同一公开摄影在 Avatar 中性舞台与 Outfit 深色舞台切换，Light 控制区、标签选中与预览弹窗可操作；照片不变色、不伪装成 AI 结果。

## 真实交互

衣橱筛选与 Radio 选择；输入校验；防重复保存演示；Loading / Success；禁用按钮解释；Light / Dark Dialog；菜单与锚点；键盘焦点与 Escape 关闭；原入口焦点恢复；方案 URL 与浏览器返回；系统减少动态效果优先。所有数据仅存在于当前页面，刷新后重置。不会上传图片或联系业务服务。

## 工程与验证

React + TypeScript + Vite + Motion。共享 CSS Token 从现有规范映射；此原型用原生语义控件与 dialog，未引入完整组件框架或 GSAP/Three.js。Fontsource 仅用于本地 WOFF2 字体。Playwright Core 使用本机 Edge，不下载浏览器。

```powershell
npm run typecheck
npm run build
npm test
```

浏览器检查需要先启动预览服务；可通过 `PREVIEW_URL` 覆盖地址、`EDGE_PATH` 指向本机 Chromium/Edge 可执行文件。自动截图和机器结果位于忽略的 `.qa/`。测试在 Windows 沙箱外使用独立临时浏览器配置，不读取个人浏览记录。

详细验证范围和未测项目见 [QA.md](QA.md)，素材来源见 [ASSETS.md](ASSETS.md)。

## 变更边界

设计探索分支本地提交；没有推送、PR、合并、正式部署或 main 修改。高保真样张属于待评审方案；选择偏好只在本页反馈，不等于设计已批准。确认方向后再决定是否抽取到正式前端工程。
