# 前端架构与设计系统接入

状态：P0 接入规划；本次不初始化项目、不安装依赖、不实现业务。产品仍为响应式平面 Web，技术栈保留 React + TypeScript + Vite。

## 1. 目录建议（P1 创建时采用）

```text
src/
  app/                 # 入口、路由、Provider、可访问性偏好
  pages/               # 页面组合，不持有第二套组件样式
  components/
    ui/                # Button、Field、Dialog 等统一封装
    shared/            # ThemeScope、媒体占位、跨模块反馈
  modules/
    home/
    wardrobe/
      clothing/
      avatar/
      outfit/
  services/            # 自有 API client
  stores/              # 必要客户端共享状态
  hooks/
  motion/              # 模式、曲线、偏好与生命周期封装
  styles/
    tokens.css         # 运行时颜色、公共尺寸、主题语义单一来源
    typography.css     # 按规范生成的角色排版
    globals.css
  assets/
```

上表是未来源码目录，不代表当前仓库已经存在 src。当前文档继续保留在 MyLife_Project_Starter/docs；不为规范化做无必要迁移。

## 2. 设计规范到实现的映射

| 输入 | P1 实现责任 | 禁止 |
| --- | --- | --- |
| [Design System](../design/design-system.md) | tokens.css 定义完整浅深语义变量，Tailwind/shadcn 只做别名；统一排版和组件尺寸 | 每页各写 HEX、第二套主题颜色 |
| [响应式规范](../design/responsive-guidelines.md) | 一份断点映射、容器与栅格工具；角色排版随规定区间切换 | 把 CSS var 直接塞入 @media；另选断点 |
| [组件规范](../design/component-spec.md) | ui 组件保证尺寸、语义、键盘、异常状态；shared 组合媒体与反馈 | 复制 shadcn 到业务页改成新风格 |
| [Motion System](../design/motion-system.md) | 命名模式、ms 到秒转换、曲线数组、reduced motion 和清理 | 多引擎控制同元素同属性 |
| [设计验收](../design/design-acceptance.md) | 建立可浏览的组件状态样张与页面截图记录 | 用库默认样式或静态稿代替交互验收 |

ThemeScope 将 data-theme 和 color-scheme 作用于区域；Portal 显式传递触发源主题。全局 overlay host 避开 transform 祖先，模态内下拉仍属于模态的主题和焦点上下文。相邻主题边界、嵌套 Light-in-Dark、两个主题分别打开的弹层都要验证。

## 3. 组件公共接口约定

| 组件 | 建议公开接口 | 语义约束 |
| --- | --- | --- |
| Button | variant: primary / secondary / ghost / danger；size: sm / md / lg；loading、disabled | 导航交给 Link；loading 防重入并保留焦点 |
| Field | label、description、error、required、disabled、readOnly | id 与描述关联；error 映射 aria-invalid |
| Card | variant: content / navigation / selection | 导航与选择语义分开；嵌套操作不嵌套 button |
| Dialog / Sheet | open、onOpenChange、title、description、originTheme | 焦点恢复、Esc、inert、内容滚动与主题一致 |
| AsyncState | status、message、retryAction | 区分 loading / empty / error / success，不推断后端状态 |
| Media | aspect、fit、alt、loading、error | 按图片角色取固定比例；不以滤镜修色 |
| Motion wrapper | pattern、reducedMotion | 只使用规范模式；跟随系统或用户减少设置 |

接口是对齐基线，实际 TypeScript 组合可使用原生 props/无障碍组件库；不为了这一表创造复杂 DSL。只有存在真实重复逻辑才抽象 shared；不在 P0 写空模块占位代码。

## 4. 状态与依赖边界

- 页面负责布局和组合，业务逻辑位于模块 hooks/services。组件不直接调用第三方 AI API。
- TanStack Query 管服务端获取、缓存和刷新；Zustand 仅管跨组件且需要共享的客户端状态。表单本地状态留在表单，不复制同一份远端数据到两个 store。
- API 类型由 schema 生成或集中维护；任务状态、可重试/可取消能力由服务端契约决定，不能从按钮颜色推断。
- 路由、弹窗与长任务必须覆盖 loading/error/empty；长任务查询失败不直接再次创建生成请求。
- Motion 为默认动效库；简单状态可用 CSS；GSAP 只对有必要的复杂时间轴按页懒加载。引擎所有权和预算见 Motion 文档。
- shadcn/ui 作为组件底座，保留无障碍语义后适配 MyLife；不把它的默认颜色和尺寸当设计系统。
- 不默认引入 Three.js、实时 3D 人体或复杂动画框架。依赖版本在 P1 初始化时锁定，本次文档不凭空指定未经验证版本。

## 5. P1 接入顺序

先落 Token/字体与区域主题 → 基础组件及双主题状态样张 → 响应式容器 → Motion 模式与减少动态效果 → 首页组合。完成设计验收后再接真实业务，不能先铺所有页面再回头修主题。
