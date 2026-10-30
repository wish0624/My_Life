# 系统架构建议

## 总体结构
- Web 前端：React + TypeScript，负责页面、交互和体验。
- API 后端：Python + FastAPI，负责身份验证、业务逻辑、数据权限和 AI 服务调用。
- 数据库：PostgreSQL，保存用户、衣物、形象、穿搭和生成任务元数据。
- 对象存储：腾讯云 COS 或兼容 S3 的服务，保存原图、处理图和生成结果。
- AI Provider Adapter：统一封装背景移除、图像识别、虚拟形象生成和虚拟试穿 API。

## 关键原则
1. 浏览器不直接持有 AI 服务密钥。
2. 图片先上传到受控存储，再由后端按权限处理。
3. 耗时 AI 生成使用异步任务与状态查询，不阻塞普通 API 请求。
4. 模块之间通过明确 API 和数据模型交互。
5. 业务数据与大文件分离：数据库存元数据和对象存储 key。
6. 所有用户资源访问均校验归属。

## 建议技术栈
- Frontend：React、TypeScript、Vite、Tailwind CSS、shadcn/ui、Motion、GSAP、Zustand。
- Backend：Python、FastAPI、Pydantic、SQLAlchemy。
- Database：PostgreSQL。
- Storage：腾讯云 COS / S3-compatible object storage。
- Deployment：Docker Compose 起步，HTTPS 反向代理。
- AI：先通过 API 验证产品体验，再评估自部署模型。

## 暂缓引入
第一版不默认使用 Three.js、实时 3D 人体、微服务集群或复杂消息队列。等实际性能、功能和并发需求明确后再决定。
