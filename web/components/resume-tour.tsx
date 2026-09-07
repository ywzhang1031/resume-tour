'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  CodeXml,
  Play,
  Sparkles,
  Maximize,
  Minimize,
  Mail,
  FileText,
  Search,
  X,
  Box,
  Layers,
  ExternalLink,
  RotateCcw,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { content, projectById, type Project } from '@/lib/content';
import {
  normalizeLocation,
  movePosition,
  filterProjects,
} from '@/lib/navigation.mjs';
import { SystemScene } from './system-scene';

const { profile, projects, tour } = content;
const chapters = tour.chapters;
type Location = {
  chapter: string;
  step: number;
  project: string | null;
  mode: string;
};
const initial: Location = {
  chapter: chapters[0].id,
  step: 0,
  project: null,
  mode: 'tour',
};
const pad = (n: number) => String(n).padStart(2, '0');

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="evidence-links">
      {project.links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
          {link.label}
          <ArrowUpRight size={16} />
        </a>
      ))}
    </div>
  );
}

export default function ResumeTour() {
  const [location, setLocation] = useState<Location>(initial);
  const [motion, setMotion] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const detailTrigger = useRef<HTMLElement | null>(null);
  const main = useRef<HTMLElement>(null);
  const chapterIndex = Math.max(
    0,
    chapters.findIndex((c) => c.id === location.chapter),
  );
  const chapter = chapters[chapterIndex];
  const project = chapter.project ? projectById[chapter.project] : undefined;
  const step = project?.steps[location.step];
  const selected = location.project ? projectById[location.project] : undefined;
  const stepsCount = project?.steps.length ?? 1;
  const totalSteps = chapters.reduce(
    (sum, c) => sum + (c.project ? projectById[c.project].steps.length : 1),
    0,
  );
  const currentStep =
    chapters
      .slice(0, chapterIndex)
      .reduce(
        (sum, c) => sum + (c.project ? projectById[c.project].steps.length : 1),
        0,
      ) +
    location.step +
    1;
  const last =
    chapterIndex === chapters.length - 1 && location.step === stepsCount - 1;
  const filtered = filterProjects(
    projects,
    query,
    category,
    status,
  ) as Project[];

  useEffect(() => {
    const sync = () =>
      setLocation(normalizeLocation(window.location.hash, chapters, projects));
    sync();
    window.addEventListener('hashchange', sync);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => {
      setReduced(media.matches);
      setMotion(!media.matches);
    };
    preference();
    media.addEventListener('change', preference);
    const full = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', full);
    return () => {
      window.removeEventListener('hashchange', sync);
      media.removeEventListener('change', preference);
      document.removeEventListener('fullscreenchange', full);
    };
  }, []);

  const navigate = useCallback(
    (patch: Partial<Location>, scroll = false) => {
      const next = { ...location, ...patch };
      const targetChapter =
        chapters.find((c) => c.id === next.chapter) ?? chapters[0];
      const targetSteps = targetChapter.project
        ? projectById[targetChapter.project].steps
        : undefined;
      const params = new URLSearchParams({ chapter: targetChapter.id });
      if (targetSteps)
        params.set('step', (targetSteps[next.step] ?? targetSteps[0]).id);
      if (next.mode === 'projects') params.set('view', 'projects');
      if (next.project) params.set('project', next.project);
      const hash = params.toString();
      setLocation(normalizeLocation(hash, chapters, projects));
      window.location.hash = hash;
      if (scroll) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        main.current?.focus({ preventScroll: true });
      }
    },
    [location],
  );

  const move = useCallback(
    (direction: number) => {
      if (direction > 0 && last) return;
      const [index, position] = movePosition(
        chapterIndex,
        location.step,
        direction,
        chapters,
        projects,
      );
      navigate(
        {
          chapter: chapters[index].id,
          step: position,
          project: null,
          mode: 'tour',
        },
        true,
      );
    },
    [chapterIndex, location.step, last, navigate],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        location.project ||
        location.mode !== 'tour'
      )
        return;
      if (
        (event.target as HTMLElement)?.closest(
          'input, textarea, select, a, [role="tab"], [role="checkbox"], [contenteditable="true"]',
        )
      )
        return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move, location.project, location.mode]);

  const openProject = (id: string, trigger: HTMLElement) => {
    detailTrigger.current = trigger;
    navigate({ project: id });
  };
  const closeProject = () => navigate({ project: null });
  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen)
        await document.documentElement.requestFullscreen();
      else setNotice('当前浏览器不支持全屏，可以使用浏览器的全屏菜单。');
    } catch {
      setNotice('暂时无法进入全屏，可以继续按章节介绍。');
    }
  };
  const relatedButtons = (ids: string[]) => (
    <div className="related-projects">
      {ids.map((id) => (
        <button
          key={id}
          onClick={(event) => openProject(id, event.currentTarget)}
        >
          {projectById[id].title}
          <ArrowUpRight size={14} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="resume-app">
      <a className="skip-link" href="#main-content">
        跳到正文
      </a>
      <header className="site-header">
        <a className="identity" href="/">
          <span className="identity-mark">yz.</span>
          <span>
            {profile.englishName}
            <small>SYSTEMS · INTELLIGENCE</small>
          </span>
        </a>
        <span className="header-label">个人履历 / 2026</span>
        <div className="header-actions">
          <a
            href="/resume"
            className="header-link"
            aria-label="查看简历"
            target="_blank"
            rel="noreferrer"
          >
            <FileText size={17} />
            <span>简历</span>
          </a>
          <a
            href={profile.github}
            className="header-link"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <CodeXml size={17} />
            <span>GitHub</span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </header>
      <SidebarProvider className="tour-layout">
        <Sidebar collapsible="none" className="chapter-sidebar">
          <p className="eyebrow">THE INTERVIEW TOUR</p>
          <h2 className="nav-heading">从这里认识我</h2>
          <nav aria-label="面试章节">
            {chapters.map((c, i) => (
              <button
                key={c.id}
                aria-current={
                  c.id === chapter.id && location.mode === 'tour'
                    ? 'step'
                    : undefined
                }
                className={`chapter-link ${c.id === chapter.id && location.mode === 'tour' ? 'active' : ''}`}
                onClick={() =>
                  navigate(
                    { chapter: c.id, step: 0, mode: 'tour', project: null },
                    true,
                  )
                }
              >
                <span className="chapter-number">{pad(i + 1)}</span>
                {c.title}
                <span className="chapter-dot" />
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <span className="live-dot" /> AI Infra 为主
            <br />
            Coding Agent 为辅
            <div className="sidebar-line" />
            <span>用工程实践，展开介绍。</span>
          </div>
        </Sidebar>
        <main id="main-content" tabIndex={-1} ref={main} className="tour-main">
          <div className="view-toolbar">
            <Tabs
              value={location.mode}
              onValueChange={(value) =>
                navigate({ mode: String(value), project: null })
              }
            >
              <TabsList aria-label="浏览方式">
                <TabsTrigger value="tour">面试导览</TabsTrigger>
                <TabsTrigger value="projects">
                  全部项目 <span className="count">{projects.length}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="view-controls">
              <Button
                variant="ghost"
                onClick={() => setMotion(!motion)}
                disabled={reduced}
                aria-pressed={motion && !reduced}
                className="motion-control"
                title={
                  reduced
                    ? '已遵循系统的减少动态效果设置'
                    : '切换技术场景的空间与静态视图'
                }
              >
                {motion && !reduced ? <Box /> : <Layers />}
                <span>{motion && !reduced ? '3D 开启' : '静态视图'}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFull}
                aria-label={fullscreen ? '退出全屏' : '进入全屏'}
              >
                {fullscreen ? <Minimize /> : <Maximize />}
              </Button>
            </div>
          </div>
          {notice && (
            <div className="notice" role="status">
              {notice}
              <button aria-label="关闭提示" onClick={() => setNotice('')}>
                <X size={16} />
              </button>
            </div>
          )}
          {location.mode === 'tour' ? (
            <>
              <div className="chapter-top">
                <span className="eyebrow">
                  {pad(chapterIndex + 1)} /{' '}
                  {chapter.kind === 'intro'
                    ? 'INTRODUCTION'
                    : chapter.kind === 'journey'
                      ? 'EXPERIENCE'
                      : chapter.kind === 'closing'
                        ? 'WHAT’S NEXT'
                        : project?.category.toUpperCase()}
                </span>
                <span className="chapter-time">约 {chapter.duration}</span>
              </div>
              {chapter.kind === 'intro' && (
                <>
                  <section className="intro-stage">
                    <div className="intro-copy">
                      <div className="availability">
                        <span className="live-dot" /> 寻找 AI Infra 方向的新机会
                      </div>
                      <h1>
                        你好，我是
                        <span className="name-line">
                          {profile.name}
                          <span className="name-period">.</span>
                        </span>
                      </h1>
                      <p className="intro-english">
                        YUEWEN ZHANG / SYSTEMS ENGINEER
                      </p>
                      <p className="intro-description">{profile.intro}</p>
                      <div className="intro-tags">
                        <span>影石 · HPC 工程经验</span>
                        <span>中科院 · 硕士</span>
                      </div>
                      <div className="intro-actions">
                        <Button
                          className="primary-action"
                          onClick={() => move(1)}
                        >
                          <Play size={15} />
                          开始介绍
                          <ArrowRight size={18} />
                        </Button>
                        <span>
                          {chapters.length} 章 · {tour.duration}
                        </span>
                      </div>
                    </div>
                    <div className="portrait-stage">
                      <img
                        src={profile.portrait}
                        alt="张跃文的风格化个人形象"
                        className="portrait-image"
                        fetchPriority="high"
                        width="1122"
                        height="1402"
                      />
                      <div className="portrait-caption">
                        <span className="portrait-caption-icon">
                          <Sparkles size={17} />
                        </span>
                        <span>
                          从真实系统出发<small>BUILDING WITH CURIOSITY</small>
                        </span>
                        <span className="portrait-cross">+</span>
                      </div>
                    </div>
                  </section>
                  <section
                    className="stack-section"
                    aria-labelledby="stack-title"
                  >
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">TOOLS I WORK WITH</p>
                        <h2 id="stack-title">
                          我的技术栈<span className="accent">↗</span>
                        </h2>
                      </div>
                      <p>从技术，到实际做过的项目。</p>
                    </div>
                    <div className="stack-grid">
                      {profile.stack.map((group, index) => (
                        <article className="stack-card" key={group.id}>
                          <div className="stack-top">
                            <span className="stack-index">
                              {pad(index + 1)}
                            </span>
                            <span
                              className={`level ${group.level === '工作交付' ? 'delivered' : ''}`}
                            >
                              {group.level === '工作交付' && (
                                <Check size={12} />
                              )}{' '}
                              {group.level}
                            </span>
                          </div>
                          <h3>{group.title}</h3>
                          <p>{group.summary}</p>
                          <ul className="stack-tags">
                            {group.tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                          {relatedButtons(group.projects)}
                        </article>
                      ))}
                    </div>
                  </section>
                </>
              )}
              {chapter.kind === 'journey' && (
                <section className="journey-section">
                  <div className="section-intro">
                    <h1>
                      一路走来，
                      <br />
                      <em>把模型带进系统。</em>
                    </h1>
                    <p>从研究中的泛化能力，到真实环境中的性能与可靠性。</p>
                  </div>
                  <div className="timeline">
                    {profile.experience.map((entry, i) => (
                      <article key={entry.org}>
                        <div className="timeline-date">
                          <span className="timeline-point" />
                          {entry.period}
                        </div>
                        <div className="timeline-body">
                          <span className="eyebrow">
                            {pad(i + 1)} / {entry.role}
                          </span>
                          <h2>{entry.org}</h2>
                          <p>{entry.description}</p>
                          {relatedButtons(entry.projects)}
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="direction-note">
                    <span className="live-dot" />
                    <p>
                      现在继续向 LLM Infra
                      深入：用可复现的项目，连接已有的系统工程经验与新的工作负载。
                    </p>
                  </div>
                </section>
              )}
              {project && step && (
                <section className="project-stage">
                  <div className="project-heading">
                    <div>
                      <div className="project-kicker">
                        <span>{project.category}</span>
                        <span className="status-badge">{project.status}</span>
                      </div>
                      <h1>{project.title}</h1>
                      <p>{project.subtitle}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={(event) =>
                        openProject(project.id, event.currentTarget)
                      }
                    >
                      <FileText />
                      展开项目
                    </Button>
                  </div>
                  <div className="step-tabs" aria-label="讲述步骤">
                    {project.steps.map((s, i) => (
                      <button
                        key={s.id}
                        className={i === location.step ? 'active' : ''}
                        aria-current={i === location.step ? 'step' : undefined}
                        onClick={() => navigate({ step: i })}
                      >
                        <span>{pad(i + 1)}</span>
                        {s.title}
                      </button>
                    ))}
                  </div>
                  <div className="case-grid">
                    <article className="step-copy" aria-live="polite">
                      <p className="eyebrow">
                        STEP {pad(location.step + 1)} /{' '}
                        {pad(project.steps.length)}
                      </p>
                      <h2>{step.title}</h2>
                      <p className="step-body">{step.body}</p>
                      <ul className="case-points">
                        {step.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <p className="ownership">
                        <span>我的职责</span>
                        {project.role}
                      </p>
                    </article>
                    <div className="case-visual">
                      <SystemScene
                        flow={step.flow}
                        step={location.step}
                        enabled={motion && !reduced}
                      />
                      {project.metric ? (
                        <div className="metric">
                          <strong>{project.metric.value}</strong>
                          <div>
                            <span>{project.metric.label}</span>
                            <p>{project.metric.detail}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="project-tools">
                          <span className="eyebrow">BUILT WITH</span>
                          <div className="intro-tags">
                            {project.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="case-bottom">
                    <p>{project.boundary}</p>
                    <ProjectLinks project={project} />
                  </div>
                  {Boolean(project.relatedProjects?.length) && (
                    <div className="companion-projects">
                      <span>相关实践</span>
                      {relatedButtons(project.relatedProjects ?? [])}
                    </div>
                  )}
                </section>
              )}
              {chapter.kind === 'closing' && (
                <section className="closing-section">
                  <span className="availability">
                    <span className="live-dot" /> OPEN TO WORK
                  </span>
                  <h1>
                    下一站，
                    <br />
                    <em>AI Infrastructure.</em>
                  </h1>
                  <p className="closing-lead">
                    把真实系统里积累的性能意识、并发经验和交付能力，
                    <br />
                    带到大模型的推理与运行基础设施。
                  </p>
                  <div className="fit-grid">
                    <article>
                      <span>01 / PERFORMANCE</span>
                      <h2>性能与数据流</h2>
                      <p>
                        端侧实时处理、零拷贝
                        IPC、硬件卸载，以及可追溯的推理测量。
                      </p>
                    </article>
                    <article>
                      <span>02 / RELIABILITY</span>
                      <h2>并发与可靠性</h2>
                      <p>有界缓存、资源生命周期、状态一致性和异常路径。</p>
                    </article>
                    <article>
                      <span>03 / RUNTIME</span>
                      <h2>模型与运行时</h2>
                      <p>
                        端侧模型集成、训练实践，以及可控的 Coding Agent 系统。
                      </p>
                    </article>
                  </div>
                  <div className="contact-row">
                    <a
                      className="contact-email"
                      href={`mailto:${profile.email}`}
                    >
                      <Mail />
                      {profile.email}
                      <ArrowUpRight />
                    </a>
                    <a href={profile.github} target="_blank" rel="noreferrer">
                      <CodeXml />
                      GitHub
                      <ArrowUpRight size={16} />
                    </a>
                    <a href="/resume" target="_blank" rel="noreferrer">
                      <FileText />
                      查看简历
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ ...initial }, true)}
                  >
                    <RotateCcw />
                    重新开始介绍
                  </Button>
                </section>
              )}
              <footer className="tour-footer">
                <div className="tour-progress">
                  <div>
                    <span>
                      {pad(currentStep)} / {pad(totalSteps)}
                    </span>
                    <span>← → 切换步骤</span>
                  </div>
                  <progress
                    max={totalSteps}
                    value={currentStep}
                    aria-label="面试导览进度"
                  />
                </div>
                <div className="footer-buttons">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="上一步"
                    disabled={chapterIndex === 0 && location.step === 0}
                    onClick={() => move(-1)}
                  >
                    <ArrowLeft />
                  </Button>
                  <Button
                    className="next-action"
                    onClick={() =>
                      last ? navigate({ ...initial }, true) : move(1)
                    }
                  >
                    {last
                      ? '回到开场'
                      : location.step < stepsCount - 1
                        ? '下一步'
                        : '下一章'}
                    <ArrowRight />
                  </Button>
                </div>
              </footer>
            </>
          ) : (
            <section className="library-section">
              <div className="section-intro">
                <span className="eyebrow">
                  SELECTED WORK / {pad(projects.length)}
                </span>
                <h1>
                  以项目，<em>展开对话。</em>
                </h1>
                <p>工作交付、正在推进的实践，以及研究和个人作品。</p>
              </div>
              <div className="project-filters">
                <div className="search-box">
                  <Search size={18} />
                  <Input
                    aria-label="搜索项目或技术栈"
                    placeholder="搜索项目、技术或关键词…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button onClick={() => setQuery('')} aria-label="清空搜索">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <select
                  aria-label="按方向筛选"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">全部方向</option>
                  {[...new Set(projects.map((p) => p.category))].map(
                    (value) => (
                      <option key={value}>{value}</option>
                    ),
                  )}
                </select>
                <select
                  aria-label="按状态筛选"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">全部状态</option>
                  {[...new Set(projects.map((p) => p.status))].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </div>
              <p className="result-count" role="status">
                找到 {filtered.length} 个项目
              </p>
              <div className="project-grid">
                {filtered.map((p, index) => (
                  <article className="project-card" key={p.id}>
                    <div className="project-card-top">
                      <span>{p.category}</span>
                      <span>{p.status}</span>
                    </div>
                    <span className="project-card-index">{pad(index + 1)}</span>
                    <h2>
                      <button
                        onClick={(event) =>
                          openProject(p.id, event.currentTarget)
                        }
                      >
                        {p.title}
                        <ArrowUpRight />
                      </button>
                    </h2>
                    <p>{p.summary}</p>
                    <div className="intro-tags">
                      {p.tags.slice(0, 4).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="card-open"
                      onClick={(event) =>
                        openProject(p.id, event.currentTarget)
                      }
                    >
                      查看项目
                      <ArrowRight />
                    </Button>
                  </article>
                ))}
              </div>
              {!filtered.length && (
                <div className="empty-state">
                  <Search />
                  <h2>没有匹配的项目</h2>
                  <p>试试 C++、推理或 Agent，或清除筛选条件。</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery('');
                      setCategory('all');
                      setStatus('all');
                    }}
                  >
                    清除全部筛选
                  </Button>
                </div>
              )}
            </section>
          )}
          <div className="page-colophon">
            <span>© 2026 {profile.englishName}</span>
            <a
              href="https://github.com/ywzhang1031/resume-tour"
              target="_blank"
              rel="noreferrer"
            >
              Resume Tour · 开源代码
              <ExternalLink size={12} />
            </a>
          </div>
        </main>
      </SidebarProvider>
      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) closeProject();
        }}
      >
        <SheetContent
          className="project-sheet"
          showCloseButton={false}
          finalFocus={() => detailTrigger.current ?? main.current}
        >
          {selected && (
            <>
              <SheetHeader className="detail-header">
                <div className="project-kicker">
                  <span>{selected.category}</span>
                  <span className="status-badge">{selected.status}</span>
                </div>
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>{selected.summary}</SheetDescription>
                <Button
                  className="detail-close"
                  variant="ghost"
                  size="icon"
                  onClick={closeProject}
                  aria-label="关闭项目详情"
                >
                  <X />
                </Button>
              </SheetHeader>
              <div className="detail-body">
                <p className="ownership">
                  <span>我的职责</span>
                  {selected.role}
                </p>
                <div className="intro-tags">
                  {selected.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {selected.steps.map((s, i) => (
                  <section key={s.id}>
                    <span className="eyebrow">{pad(i + 1)}</span>
                    <h2>{s.title}</h2>
                    <p>{s.body}</p>
                    <ol className="detail-flow">
                      {s.flow.map((node, n) => (
                        <li key={n}>{node}</li>
                      ))}
                    </ol>
                    <ul>
                      {s.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </section>
                ))}
                {selected.metric && (
                  <div className="detail-metric">
                    <strong>{selected.metric.value}</strong>
                    <h3>{selected.metric.label}</h3>
                    <p>{selected.metric.detail}</p>
                  </div>
                )}
                {selected.markdown && (
                  <div className="markdown">
                    <ReactMarkdown>{selected.markdown}</ReactMarkdown>
                  </div>
                )}
                <p className="boundary-note">{selected.boundary}</p>
                <ProjectLinks project={selected} />
                <a
                  className="permalink"
                  href={`/#project=${selected.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  独立项目链接
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
