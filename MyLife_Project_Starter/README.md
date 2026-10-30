# MyLife

**Your Life, Your Space.**

MyLife 是供本人及受邀朋友使用的个人生活管理 Web 网站。用户通过公网链接访问，无需获取源码或安装开发环境。

当前阶段：**P0 产品与设计准备**。Design System v1.1 已补齐可执行文档基线，尚待组件样张、首页/衣橱关键稿与评审；不代表业务已经实现。

## 已确认方向

- 产品形态：响应式平面 Web 网站。
- 视觉：Modern Spatial UI + 3D Editorial Design；现代、偏写实、有质感。
- 主题：Mixed Theme，暖白与深色按页面场景组合。
- 动效：Rich Motion，首页可表现空间感，业务页更克制，并支持 reduced motion。
- 3D：不做游戏世界、浮岛地图或自由漫游；优先 CSS 与 Motion，GSAP 仅复杂时间轴按需使用，不默认引入 Three.js。
- 第一阶段：衣橱与虚拟穿搭。
- 核心能力：问题/答案验证登录、多用户数据隔离、衣物数字化、图像式虚拟真人形象、AI 试穿、穿搭保存。

字体、语义配色、Hero 素材和首页文案等新增具体基线及其确认状态见 [Design System 的决策清单](docs/design/design-system.md)。不得把这些新基线追溯写成用户已确认的审美结果。

## 文档索引

| 领域 | 文档 |
| --- | --- |
| 产品 | [概述](docs/product/product-overview.md)、[需求](docs/product/functional-requirements.md)、[旅程](docs/product/user-journey.md) |
| 设计 | [哲学](docs/design/design-philosophy.md)、[Design System](docs/design/design-system.md)、[组件](docs/design/component-spec.md)、[响应式](docs/design/responsive-guidelines.md)、[Motion](docs/design/motion-system.md)、[首页](docs/design/homepage-spec.md)、[验收](docs/design/design-acceptance.md) |
| 架构 | [系统](docs/architecture/system-architecture.md)、[前端](docs/architecture/frontend-architecture.md)、[数据模型](docs/architecture/data-model.md)、[安全](docs/architecture/security-checklist.md) |
| 计划 | [阶段路线与剩余任务](docs/roadmap/development-roadmap.md)、[Definition of Done](docs/roadmap/definition-of-done.md) |

## 开发原则

先完成设计规范与关键页面原型，再开始业务开发；先做可用闭环，再扩展生活模块。保留当前文档结构，P1 再按架构建立源码工程。共享值只在所属规范定义，组件/页面引用，不重复造标准。未经确认，不得改变已确认产品和视觉方向。
