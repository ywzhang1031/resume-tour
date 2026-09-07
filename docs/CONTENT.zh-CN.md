# 内容维护

所有命令在 `web/` 目录执行。原始简历、内部项目代码和个人聊天记录不进入此仓库。

## 文件与更新

- `content/profile.json`：身份、邮箱、肖像路径、技术栈、经历。`introTags` 控制首页标签；`resumeSummary` 统一网页与 PDF 简介；`focus` 展示模型研究、在研与下一阶段方向；`personal` 管理爱好、MBTI、AI 愿景与主页链接。
- `content/projects/*.json`：一个文件对应一个项目。
- `content/notes/*.md`：长篇技术说明，通过项目的 `note` 文件名关联。
- `content/tour.json`：章节顺序与稳定项目引用。
- `content/resume.json`：精简 PDF 中的工作项目与精选项目顺序。
- `lib/content.generated.json`：自动生成的公开内容；不要手动编辑。

开发服务监听内容文件。保存合法内容后，页面自动更新；校验失败时显示错误并保留上一份合法结果。构建前再次校验。生成文件纳入 Git，修改内容时一起提交。

## 新增

复制 `examples/project.json` 到 `content/projects/my-project.json`。设置稳定的 `id`（小写字母、数字、短横线）、标题、职责、标签和讲述步骤。

`visibility` 默认是 `draft`，完成内容后改为 `visible`。`order` 越小，在项目列表中越靠前。

`steps` 至少一项，每项包含 `id`、`title`、`body`、`points` 和 `flow`。`flow` 是有序的数据流节点；没有专属场景的项目使用默认数据流场景。`scene` 目前只支持默认 pipeline，留作后续扩展。

若进入面试导览，在 `tour.chapters` 加入：

```json
{"id":"my-project","title":"新项目","kind":"project","project":"my-project","duration":"1 分钟"}
```

首页技术栈关联项目：修改对应分组的 `projects`。项目间关联：使用 `relatedProjects`。

阶段进度使用项目的 `milestones` 数组：每项填写 `label`、`status`（`已完成` / `在研` / `计划实践`）和 `detail`。可独立更新预训练、SFT、RL 与评测进展，导览和详情自动展示。

步骤可选 `illustration: "landing-safety"`，展示可播放的 8 秒降落保护流程示意；静态 / 减少动态效果模式下保留手动选步。它是本站绘制的示意动画，不是实飞录像。

## 修改、排序与查找

标题可以随时改；稳定 ID 用于外部链接和内部引用，应保持不变。讲述步骤也具有稳定 ID。

`order` 控制列表顺序；`tour.chapters` 的数组顺序控制讲解顺序，两者独立。网站的「全部项目」支持名称、摘要、技术标签关键词及方向、状态筛选。

项目 `status`：`开发中`、`阶段实验完成`、`已发布版本`、`已交付`、`已发表`。添加新状态时同时修改 `scripts/content.mjs` 中的集合。

## 隐藏、归档、删除

- `visibility: visible`：展示。
- `draft`、`hidden`、`archived`：不进入公开页面，并自动过滤导览、技术栈及相关项目入口。
- 物理删除文件：必须同时移除导览、个人经历、技术栈、相关项目与 PDF 选集的引用；否则构建会指出错误。

这些字段不是访问权限。公开仓库的文件与历史记录仍可被读到。私密内容应放在仓库之外。

## 证据与细节

`links` 使用带标签的 HTTPS URL；`metric` 包含 `value`、`label`、`detail`，注明硬件、测量口径、版本或适用条件。`boundary` 简要描述个人职责或实验范围。`note` 只能引用 `content/notes` 中的 Markdown 文件，页面不执行原始 HTML。

`resumeHighlights` 可选，用于给网页简历与 PDF 提供精简要点，不必压缩面试导览的详细步骤。内容表述应区分工作交付、已完成实验、当前研读和计划实践。

## PDF

在线 `/resume` 始终读取最新公开内容，可以用浏览器打印保存 PDF。两页精简版由 Python 脚本生成：

```sh
npm run content:check
python3 -m pip install reportlab
python3 scripts/resume-pdf.py --font /path/to/a/chinese-font.ttf
cp output/pdf/yuewen-zhang-resume.pdf public/files/yuewen-zhang-resume.pdf
```

macOS 默认使用系统 STHeiti Light 字体；其他系统指定可覆盖中文的 TrueType 字体。生成后检查页数和排版，再复制到 `public/files/`。调整 PDF 的项目数量时可能需要重新安排分页。

## 检查与发布

```sh
npm run content:check
npm run typecheck
npm test
npm run build
```

CI 执行相同核心检查。发布使用构建后的同一份代码。Sites 访问权限独立于 GitHub：公开源代码不表示部署网址也已公开。

## 项目图与章节衔接

项目的可选 `image` 包含 `src`、`alt`、`caption`、`width`、`height`。图片放在 `public/images/projects/`，支持 SVG / PNG / JPG / WebP；路径、说明、尺寸和文件存在性均经过校验。列表显示预览，详情提供大图链接，导览的第一步展示概览图。没有图片的新项目仍可使用默认数据流场景。

`node scripts/project-diagrams.mjs` 可重新生成本站八张原生架构/流程示意图；DALSCLIP 使用个人主页中的方法图。修改示意图时同步校对项目阶段和个人职责，避免把计划画成已经完成。

章节的可选 `bridge` 是末尾的承接句，下一章名称自动跟随导览顺序。`kind: personal` 展示“代码之外”，无需关联项目。

## 访客展示与联系入口

- `profile.resumePdf`：顶部、联系区和打印页使用的 PDF 地址，文件放入 `web/public/files/`。目前使用作者指定的 `resume/Chinese_version/resume_ai_agent.pdf` 原件，不随网站文案自动重生成。
- `profile.socialLinks`：首页和联系区共用的社交链接。现有 GitHub、谷歌学术、小红书、微信二维码、个人主页及邮箱。微信二维码属于个人身份资产。
- `profile.personal.mbtiImage`：INTP 角色的图片地址、替代文本与来源页；第三方版权见 `ASSETS.md`。
- 章节 `duration` 保留为编辑数据，不在访客界面展示。首页与导航使用访客文案，保留原有方向键浏览、项目筛选与详情功能。

- `profile.portraitCaption`：照片底部的文字，当前为“我有一颗勇敢的心”；由无边框渐变叠层呈现，原照片文件不作修改。
- 技术栈现为六组，`focus` 中的在研与计划项目参考官方岗位要求，来源及个人能力边界见 `JD-ALIGNMENT.zh-CN.md`。
