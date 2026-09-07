# Resume Tour

用于面试讲解与日常求职展示的开源个人网站。

[English](README.md) · [内容维护指南](docs/CONTENT.zh-CN.md) · [设计文档](docs/DESIGN.zh-CN.md)

## 已实现

- 9 个面试章节、逐步讲解、方向键切换、进度与全屏。
- 首页四组技术栈，区分工作交付与项目实践，并关联项目。
- 9 个项目，支持关键词、技术标签、方向和状态筛选。
- 详情面板、Markdown 技术解释、独立项目链接与讲述位置保留。
- Three.js 数据流场景、静态备用视图与减少动态效果偏好。
- 在线简历、打印功能与两页 PDF 下载。
- JSON / Markdown 内容管理、排序、隐藏、归档与引用校验。

目前内容以张跃文的 AI Infra 求职经历为主，Coding Agent 为辅。个人形象为风格化图片，技术数据流场景使用 WebGL。

## 本地运行

需要 Node.js 22.13 或更新版本。

```sh
cd web
npm ci
npm run dev -- --host 127.0.0.1 --port 4173
```

访问 `http://localhost:4173`，Ctrl-C 停止。端口占用时改成 `--port 4174`。生产构建后可用 `npm start -- --port 4175` 检查生产版本。

```sh
npm run content:check
npm run typecheck
npm test
npm run build
```

## 改内容

个人介绍、经历与技术栈在 `web/content/profile.json`；每个项目是 `web/content/projects/` 中的独立文件；讲述顺序在 `web/content/tour.json`。修改项目内容后，导览、项目列表与在线简历会一起更新。精简 PDF 需按指南重新生成。

新项目复制 `web/examples/project.json` 即可。可以改名、换序、隐藏、归档；不需要创建新页面或制作 3D 模型。删除项目时，校验器会指出仍引用它的地方。详细字段与操作见[内容维护指南](docs/CONTENT.zh-CN.md)。

隐藏仅控制网站展示，公开 GitHub 仓库中的源文件仍然可读。私人资料不要放入仓库。

## 发布与复用

网站使用 React、TypeScript、Vinext、shadcn/Base UI 与 Three.js。生产输出是兼容 Cloudflare 的 Worker，图片、字体和内容均不依赖外部 CDN；完整离线安装尚未实现。

当前 Sites 归属记录在 `web/.openai/hosting.json`。Fork 后部署自己的版本，应注册自己的项目。CI 负责校验，不自动发布网站。代码采用 [MIT License](LICENSE)；使用模板时替换个人资料、简历与肖像，素材说明见 [ASSETS.md](docs/ASSETS.md)。
