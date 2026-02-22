# FitTrack 健身记录器

![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white)

![FitTrack 预览](public/screenshot.svg)

## 项目简介

FitTrack 是一款移动端优先的健身记录应用，围绕训练、饮食与知识库提供轻量化管理体验，并集成 AI 助手帮助你持续进步。

## 功能亮点

- 运动记录：快速新增/编辑/删除训练，支持强度与心情记录
- 数据统计：趋势图表一目了然
- 日历回顾：按日期回看训练安排
- 饮食管理：菜谱分类筛选、收藏与上传
- AI 助手：训练、饮食、恢复建议随问随答
- 移动端优先：底部导航、触控优化、安全区适配

## 快速开始

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 项目结构

- `src/components` 组件与 UI 基础库
- `src/sections` 页面模块
- `src/hooks` 业务逻辑与状态管理
- `src/services` 本地存储与默认数据

## 主要路由

- `/` 首页
- `/records` 运动记录
- `/statistics` 数据统计
- `/calendar` 训练日历
- `/knowledge` 健身知识
- `/diet` 饮食管理
- `/ai` AI 助手
- `/profile` 个人资料

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS
- Radix UI
- FullCalendar

## 说明

- 仅提供简体中文体验
- 数据存储在浏览器 `localStorage`
- 移动端体验为主要设计目标
