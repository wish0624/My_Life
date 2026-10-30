# 前端架构建议

## 目录建议
```text
src/
  app/                 # 应用入口、路由、Provider
  pages/               # 页面级组合
  components/
    ui/                # 基础 UI 组件
    shared/            # 跨模块复用组件
  modules/
    home/
    wardrobe/
      clothing/
      avatar/
      outfit/
  services/            # API client
  stores/              # Zustand stores
  hooks/
  styles/              # tokens、主题、全局样式
  assets/
```

## 约定
- 页面负责布局和组合；业务逻辑放入模块 hooks/services。
- 基础组件与业务组件分层。
- API 类型由后端 schema 生成或集中维护，避免散落的 any。
- 页面状态、服务端数据和表单状态分开管理。
- 路由切换、弹窗和生成任务必须有明确 loading/error/empty 状态。
- 组件不直接调用第三方 AI API；统一调用自有后端。
- 主题 Token 集中定义，禁止页面随意硬编码颜色。
- 动效封装为可复用模式，禁止每个页面各写一套互不一致的动画。

## 推荐依赖
React + TypeScript + Vite；Tailwind CSS；shadcn/ui；Motion；GSAP（复杂时间轴时）；Zustand；TanStack Query（服务端状态）。
