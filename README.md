# FitTrack 健身记录器

一个纯前端的健身记录与健康管理应用，覆盖训练记录、数据统计、饮食与知识库、身体数据追踪和 AI 助手。项目默认简体中文，并针对移动端做了深入适配与交互动效优化。

## 功能概览
- 运动记录：新增/编辑/删除、心情/强度/备注/图片，列表与日历双视图
- 数据统计：训练趋势、类型分布、月度概览、近 7 天统计
- 知识库：分类筛选、搜索、文章详情、相关文章跳转
- 饮食：菜谱上传、收藏、评论、分类与搜索
- 身体数据：体重/体脂/围度趋势与历史记录
- AI 助手：训练/饮食/恢复问答
- 账户与偏好：登录/注册、个人资料、偏好设置
- 视觉与动效：卡片跳出动效、3D 轻微倾斜、流光高光与噪点纹理

> 数据默认存储在浏览器 `localStorage`，无需后端即可体验完整功能。

## 技术栈
- React 19 + TypeScript
- Vite 7
- Tailwind CSS
- Radix UI
- React Router
- FullCalendar / Recharts

## 本地运行
```bash
npm install
npm run dev
```

## 构建与预览
```bash
npm run build
npm run preview
```

## 部署说明
- 已集成 GitHub Actions 自动部署到 GitHub Pages
- 路由使用 `HashRouter`，页面访问路径为 `#/xxx`

## 目录结构
```
src/
  components/   # 组件与基础 UI
  sections/     # 页面区块
  hooks/        # 业务逻辑 hooks
  services/     # 本地存储/认证等服务
  types/        # 类型定义
```

## 开发建议
- Node.js 20+ 推荐
- 如遇依赖问题，可删除 `node_modules` 后重新 `npm install`

---

如需对接后端、增加多语言或扩展功能，请在 issue 中说明需求。