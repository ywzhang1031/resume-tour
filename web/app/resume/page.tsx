import { content } from '@/lib/content';
import { PrintButton } from '@/components/print-button';
import './resume.css';
export const metadata = {
  title: '张跃文 · 简历',
  description: 'AI Infra / Coding Agent · 张跃文的工作、项目与研究经历。',
};
export default function Resume() {
  const { profile, projects } = content;
  return (
    <main className="print-resume">
      <div className="print-toolbar">
        <a href="/">← 返回交互履历</a>
        <a className="pdf-download" href={profile.resumePdf} download>
          下载简历 · PDF
        </a>
        <PrintButton />
      </div>
      <header>
        <h1>
          {profile.name}
          <span>{profile.englishName}</span>
        </h1>
        <p>AI Infra 为主 · Coding Agent 为辅</p>
        <div>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span>github.com/ywzhang1031</span>
        </div>
      </header>
      <section>
        <h2>个人简介</h2>
        <p>{profile.resumeSummary}</p>
      </section>
      <section>
        <h2>技术栈</h2>
        {profile.stack.map((s) => (
          <p key={s.id}>
            <strong>
              {s.title} · {s.level}：
            </strong>
            {s.tags.join(' / ')}
          </p>
        ))}
        {profile.focus.map((s) => (
          <p key={s.title}>
            <strong>
              {s.title} · {s.level}：
            </strong>
            {s.detail}
          </p>
        ))}
      </section>
      <section>
        <h2>工作与教育经历</h2>
        {profile.experience.map((e) => (
          <article key={e.org}>
            <h3>
              {e.org}
              <span>{e.period}</span>
            </h3>
            <p>
              <strong>{e.role}</strong> · {e.description}
            </p>
          </article>
        ))}
      </section>
      <section>
        <h2>工程交付与项目实践</h2>
        {projects
          .filter((p) => p.category !== '其他作品')
          .map((p) => (
            <article key={p.id}>
              <h3>
                {p.title}
                <span>{p.status}</span>
              </h3>
              <p>
                <strong>{p.role}</strong>
              </p>
              <p>{p.summary}</p>
              <ul>
                {p.resumeHighlights
                  ? p.resumeHighlights.map((line) => <li key={line}>{line}</li>)
                  : p.steps.slice(0, 2).map((s) => (
                      <li key={s.id}>
                        {s.title}：{s.points.join('；')}。
                      </li>
                    ))}
              </ul>
              <p className="resume-boundary">{p.boundary}</p>
              {p.links[0] && (
                <a className="resume-source" href={p.links[0].url}>
                  {p.links[0].url}
                </a>
              )}
            </article>
          ))}
      </section>
      <footer>
        内容更新：{profile.updated} · 完整项目说明与交互导览见个人网站。
      </footer>
    </main>
  );
}
