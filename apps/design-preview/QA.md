# 本轮验证记录

日期：2026-10-30。实际运行环境：Windows，Node.js 22.18.0，Edge 156.0.4314.50，Playwright Core，独立临时浏览器配置。

## 已执行并通过

- `npm run typecheck`；最终 `npm run build` 再次执行 TypeScript 检查并成功构建。
- `npm test`：15 组浏览器检查全部通过，控制台错误 0、同源失败响应 0。
- `/design-preview` 返回 200，A/B 查询参数可直达，切换改变真实内容、构图和字体，浏览器返回恢复原方案；根路径保持正式首页边界。
- 两案分别检查 320、390、479、480、600、767、768、900、1023、1024、1279、1280、1440px，无页面横向溢出。
- 实际鼠标 hover / 按下颜色不同；表单错误、Loading、防重复提交与 Success 可操作。
- Dialog 中 Tab / Shift+Tab 循环、Escape 和关闭按钮可用，关闭恢复原触发器焦点与页面滚动；Light / Dark 弹层继承正确主题。
- 衣橱筛选、Radio 选择、空态恢复、D-04 未开放模块静态展示、D-06 舞台主题切换通过。
- 快速反复切换方案、菜单打开/关闭后无残留模态或滚动锁。
- 系统 reduced-motion 的运行时切换与站内开关均通过；CSS 动画停止，必要淡变仍符合规范。
- 启用 `hasTouch / isMobile` 的 390px 浏览器上下文实际 tap 菜单与关闭按钮；另检查 844×390 横屏、1024×600 短视口及根字号 200% 内容重排。
- 滚动实际加载所有本地图片，并确认当前方案的字体完成加载；未使用方案字体按需加载。
- CSS 变量引用检查无未定义项；本次变更不修改原有规范文档。

已修复浏览器测试发现的两处实际问题：原生 Dialog 的末端 Tab 越界、Motion 库当前版本不动态刷新 reduced-motion hook。前者补充显式焦点循环，后者由可清理的 matchMedia 订阅驱动。

## 实测文件体积

Vite 最终构建输出：JS 120.46 kB gzip，CSS 8.01 kB gzip；两套字体共 77.66 kB。三张 WebP 总计 513,904 bytes；A Hero 使用夹克图，B Hero 两图共 433,968 bytes。下方图片使用 lazy loading。字体、JS、CSS 和 Hero 图像文件体积均在既定预算内。

这是构建/文件大小证据，不等于弱网首屏时间实测。

## 截图与机器结果

运行测试生成 `.qa/browser-report.json` 和：

- a-desktop.png / b-desktop.png（1440×1000）
- a-tablet.png / b-tablet.png（768×1024）
- a-mobile.png / b-mobile.png（390px 全页，滚动加载素材后截取）
- components.png / studio.png

截图来自真实页面，不替代可运行的 React 应用。桌面两案、平板以及组件和工作台截图已做视觉检查。

## 尚未执行 / 待确认

- 没有实体手机、Safari、Firefox 验证；浏览器视口/触摸模拟不是实体设备验收，软键盘与刘海安全区还需真机确认。
- 没有校准网络/CPU 的 LCP、CLS、INP 测量或 10 秒帧时间 trace；这些仍是性能预算，不报告为已经达成。
- 没有正式生产可访问性认证或业务后端测试；当前没有这些业务实现。
- 字体最终选择、中文 Noto Sans SC 样张、字标、Hero 素材、文案及主题比例仍需用户审美确认。
- 没有远端推送、PR、合并或云端发布。保留独立本地设计分支。
