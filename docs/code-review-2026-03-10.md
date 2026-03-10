# FitTrack 项目 Review（2026-03-10）

## 总体结论

项目整体结构清晰，`sections + hooks + services` 分层明确，页面体验与功能完整度较高，能够覆盖训练记录、饮食、知识和 AI 问答的核心闭环。当前最优先需要处理的问题是**工程质量门禁（lint）不可用**，其次是**类型约束和本地存储鲁棒性**。

## 优点

1. 路由与模块划分直观，懒加载策略已使用，首屏之外页面按需加载。  
2. 训练记录页面在列表/日历视图之间切换逻辑清楚，用户体验流畅。  
3. 构建流程可正常产出，`npm run build` 通过。

## 主要问题（按优先级）

### P1 - Lint 脚本当前不可用

- 现象：执行 `npm run lint` 直接失败，ESLint 9 找不到 `eslint.config.*`。  
- 影响：缺少自动化静态检查，PR 阶段难以保证基础代码质量。  
- 建议：
  - 方案 A：补齐 `eslint.config.js`（Flat Config）。
  - 方案 B：若仍使用 `.eslintrc` 体系，锁定 ESLint 8 并在 README 说明。

### P2 - TypeScript 严格模式关闭，类型防线偏弱

- 现象：`strict` 关闭，且 `noUnusedLocals/noUnusedParameters` 关闭。  
- 影响：潜在类型错误和无效代码更容易进入主干。  
- 建议：分阶段开启（先 `noUnusedLocals`，再 `strict`），并逐模块清理。

### P2 - 本地存储读取缺乏容错

- 现象：多处 `JSON.parse` 直接解析 localStorage 数据，无异常兜底。  
- 影响：一旦存储被污染（手动修改、历史版本残留），应用可能在运行时崩溃。  
- 建议：封装 `safeParse`，解析失败时回退默认值并清理坏数据。

### P3 - 认证实现仅适合 demo，安全性不足

- 现象：密码为本地可逆上下文（弱 hash）存储，token 为前端伪造结构。  
- 影响：不适用于真实生产认证场景。  
- 建议：如要上线，迁移到后端鉴权（短期可在 README 明确“演示用途”）。

## 建议执行顺序

1. 先修复 ESLint 配置，恢复基础门禁。  
2. 加入 localStorage 解析容错（低成本高收益）。  
3. 逐步提升 TS 严格度，配合 CI（lint + build）。  
4. 若计划生产化，再重构认证链路。

## 本次检查命令

- `npm run lint`（失败）
- `npm run build`（通过）

