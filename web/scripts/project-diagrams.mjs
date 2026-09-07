// Original explanatory diagrams. These are not screenshots or measured charts.
// Regenerate with: node scripts/project-diagrams.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { root } from './content.mjs';

const output = resolve(root, 'public/images/projects');
mkdirSync(output, { recursive: true });
const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const text = (x, y, label, size = 20, color = '#dde6d4', anchor = 'start') =>
  `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}">${esc(label)}</text>`;
const panel = (
  x,
  y,
  w,
  h,
  fill = '#20291b',
  stroke = '#46573a',
  dashed = false,
) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}" ${dashed ? 'stroke-dasharray="7 6"' : ''}/>`;
const box = (x, y, w, title, sub, accent = false, dashed = false) =>
  panel(
    x,
    y,
    w,
    88,
    accent ? '#2f4120' : '#20291b',
    accent ? '#b0d571' : '#46573a',
    dashed,
  ) +
  text(x + 18, y + 35, title, 22, accent ? '#d2f76a' : '#dde6d4') +
  text(x + 18, y + 63, sub, 16, '#adbea0');
const arrow = (x1, y1, x2, y2, dashed = false) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="#829c67" stroke-width="2" ${dashed ? 'stroke-dasharray="6 6"' : ''} marker-end="url(#arrow)"/>`;
const path = (d) =>
  `<path d="${d}" fill="none" stroke="#829c67" stroke-width="2" marker-end="url(#arrow)"/>`;
const save = (id, title, subtitle, body) =>
  writeFileSync(
    resolve(output, `${id}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(subtitle)}</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#829c67"/></marker></defs><rect width="960" height="540" rx="18" fill="#141b11"/><g font-family="system-ui, -apple-system, sans-serif">${text(40, 48, 'YUEWEN ZHANG / PROJECT NOTES', 14, '#91a57e')}${text(40, 94, title, 32)}${text(40, 124, subtitle, 17, '#a8b99a')}${body}</g></svg>\n`,
  );

save(
  'landing-protection',
  '降落保护 · 感知到控制',
  '四类输入，同一条有界、实时的决策链路。',
  ['双目视觉', '深度相机', 'ToF 高度', '姿态 / 导航']
    .map(
      (s, i) =>
        panel(40, 167 + i * 62, 156, 46) +
        text(58, 197 + i * 62, s, 20) +
        arrow(196, 190 + i * 62, 258, 286),
    )
    .join('') +
    box(268, 242, 170, '时间对齐', 'Buffer / 匹配') +
    arrow(438, 286, 482, 286) +
    box(494, 242, 184, '感知模块', '量化模型 / 融合', true) +
    arrow(678, 286, 720, 286) +
    box(732, 242, 188, '飞控接口', '状态 + reason') +
    panel(268, 389, 652, 92) +
    text(292, 425, '并发与性能贯穿链路', 20, '#d2f76a') +
    text(292, 455, 'epoch 版本检查 · NV12 输入 · 模式与频率门控', 19),
);

save(
  'video-pipeline',
  '多路视频 · 统一编码管线',
  '13 类输入按需接入，硬件编码后的数据分发到录制与预览。',
  ['双目 / 主摄', '全景图像', '深度可视化']
    .map(
      (s, i) =>
        box(40, 163 + i * 104, 184, s, '配置驱动') +
        arrow(224, 207 + i * 104, 282, 300),
    )
    .join('') +
    box(294, 256, 178, '预处理', 'NV12 / 对齐') +
    arrow(472, 300, 518, 300) +
    box(530, 256, 180, 'H.265', '硬件编码 / RAII', true) +
    path('M710 300 L748 300 L748 222 L772 222') +
    path('M710 300 L748 300 L748 378 L772 378') +
    box(784, 178, 140, '录制', '循环 / 保护') +
    box(784, 334, 140, '预览', 'IPC 发布'),
);

save(
  'inference-lab',
  'LLM 推理 · 请求时间线',
  '区分客户端调度滞后、首 token 延迟与完整响应耗时。',
  arrow(65, 253, 904, 253) +
    [80, 296, 564, 860]
      .map(
        (x, i) =>
          `<circle cx="${x}" cy="253" r="7" fill="#d2f76a"/>` +
          text(
            x,
            207,
            ['计划到达', '实际提交', '首 token', '完成'][i],
            21,
            '#dde6d4',
            'middle',
          ) +
          text(
            x,
            291,
            ['scheduled', 'submitted', 'first token', 'finished'][i],
            16,
            '#a8b99a',
            'middle',
          ),
      )
      .join('') +
    text(175, 335, '调度滞后', 17, '#a8b99a', 'middle') +
    text(425, 335, 'TTFT', 18, '#d2f76a', 'middle') +
    text(713, 335, '逐 token / 流式记录', 18, '#d2f76a', 'middle') +
    box(40, 388, 272, '负载与调度', 'Closed-loop / Open-loop') +
    box(344, 388, 272, 'HTTP / SSE', '原始请求记录与错误统计', true) +
    box(648, 388, 272, '指标分析', 'TTFT / TPOT / E2E'),
);

save(
  'nanochat-lab',
  'nanochat · 训练实践路线',
  '从已有预训练 checkpoint，继续向对话与强化学习推进。',
  ['Pretraining', 'SFT', 'RL / GRPO', 'Evaluation']
    .map(
      (s, i) =>
        box(
          40 + i * 226,
          213,
          202,
          s,
          i === 0 ? '阶段实验完成' : '计划实践',
          i === 0,
          i > 0,
        ) + (i < 3 ? arrow(243 + i * 226, 257, 261 + i * 226, 257, true) : ''),
    )
    .join('') +
    panel(40, 351, 880, 131) +
    text(65, 391, '已完成的实验基础', 20, '#d2f76a') +
    text(65, 426, 'Dense GPT · d6 / d12 · 各 5,000 步', 26) +
    text(
      65,
      459,
      'Apple Silicon / MPS · 各约 81.92M 训练 tokens',
      18,
      '#a8b99a',
    ),
);

save(
  'my-agent',
  'My Agent · 可控执行循环',
  '用清晰的运行边界，连接模型决策、工具执行与结果检查。',
  box(40, 182, 242, '用户 / 模型', '目标与工具调用') +
    arrow(282, 226, 344, 226) +
    box(356, 182, 242, 'Agent Runtime', '上下文 / 中断 / 模式', true) +
    arrow(598, 226, 660, 226) +
    box(672, 182, 248, '权限与工具', '参数约束 / 执行策略') +
    path('M796 270 L796 380 L610 380') +
    box(356, 336, 242, '结果与事件', '检查 / JSONL / 回放') +
    path('M356 380 L161 380 L161 278') +
    text(40, 482, 'CONTROL → ACTION → OBSERVATION → NEXT STEP', 21, '#a8b99a'),
);

save(
  'dsh-aside',
  'DSH Aside · 把追问留在原文旁',
  '选区锚定，让主线与只读旁注各自继续。',
  panel(40, 159, 498, 329) +
    text(63, 197, '主对话', 22) +
    text(63, 238, '理解 LLM 推理中的内存与调度', 19, '#a8b99a') +
    panel(63, 263, 448, 49, '#344527', '#7f9d52') +
    text(78, 295, 'KV Cache 按 block 组织与管理', 21, '#d2f76a') +
    text(63, 350, '继续主线：请求调度 → 延迟与吞吐', 20) +
    text(63, 454, '主线保持原有上下文', 17, '#a8b99a') +
    arrow(511, 287, 576, 287) +
    panel(588, 159, 332, 329, '#202a1a', '#789b4e') +
    text(610, 197, '旁注 · 独立只读会话', 22, '#d2f76a') +
    text(610, 242, '引用选区', 16, '#a8b99a') +
    text(610, 276, '为什么按 block 管理？', 21) +
    text(610, 329, '就地追问，保留原文锚点', 18) +
    text(610, 365, '支持多轮对话与历史恢复', 18) +
    text(610, 454, '返回原文 / 继续追问', 17, '#a8b99a'),
);

save(
  'trajectory-vault',
  'Agent Trajectory Vault · 轨迹变成数据',
  '从多源执行记录到统一结构，为分析与后续评估提供基础。',
  ['Codex', 'Cursor', 'OpenCode']
    .map(
      (s, i) =>
        panel(40, 184 + i * 72, 170, 52) +
        text(61, 217 + i * 72, s, 22) +
        arrow(210, 210 + i * 72, 278, 287),
    )
    .join('') +
    box(290, 243, 184, '导入与脱敏', '来源可追溯') +
    arrow(474, 287, 515, 287) +
    box(527, 243, 186, '统一 Schema', '规范化执行记录', true) +
    arrow(713, 287, 754, 287) +
    box(766, 243, 154, '分析视图', '派生 / 检查') +
    panel(290, 398, 630, 78) +
    text(311, 429, '保留来源关系 · 同时检查原始记录与派生数据', 19) +
    text(311, 457, '后续方向：Agent Evaluation / 训练数据研究', 17, '#a8b99a'),
);

save(
  'eyecare',
  'EyeCare · 给专注留一个休息间隙',
  '围绕工作与休息的节奏，实践 iOS / watchOS 提醒体验。',
  `<circle cx="237" cy="302" r="118" fill="none" stroke="#33432a" stroke-width="18"/><circle cx="237" cy="302" r="118" fill="none" stroke="#b6d875" stroke-width="18" stroke-dasharray="580 742" transform="rotate(-90 237 302)"/>` +
    text(237, 302, '20 分钟', 42, '#d2f76a', 'middle') +
    text(237, 339, '工作时段', 22, '#a8b99a', 'middle') +
    arrow(386, 302, 468, 302) +
    box(486, 208, 390, '20 秒 · 休息提醒', '把视线从屏幕移开', true) +
    box(486, 343, 390, '下一轮', '手机与手表上的轻量提醒') +
    arrow(681, 296, 681, 334),
);

console.log(
  'Generated 8 original project diagrams; DALSCLIP uses the author-provided method figure.',
);
