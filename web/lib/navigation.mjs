export function normalizeLocation(hash, chapters, projects) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const chapter =
    chapters.find((c) => c.id === params.get('chapter')) ?? chapters[0];
  const steps = projects.find((p) => p.id === chapter.project)?.steps ?? [
    { id: 'overview' },
  ];
  const step = Math.max(
    0,
    steps.findIndex((s) => s.id === params.get('step')),
  );
  const project = projects.some((p) => p.id === params.get('project'))
    ? params.get('project')
    : null;
  return {
    chapter: chapter.id,
    step,
    project,
    mode: params.get('view') === 'projects' ? 'projects' : 'tour',
  };
}

export function movePosition(
  chapterIndex,
  step,
  direction,
  chapters,
  projects,
) {
  const count = (index) =>
    projects.find((p) => p.id === chapters[index].project)?.steps.length ?? 1;
  if (direction > 0)
    return step + 1 < count(chapterIndex)
      ? [chapterIndex, step + 1]
      : [Math.min(chapters.length - 1, chapterIndex + 1), 0];
  return step > 0
    ? [chapterIndex, step - 1]
    : chapterIndex > 0
      ? [chapterIndex - 1, count(chapterIndex - 1) - 1]
      : [0, 0];
}

export function filterProjects(projects, query, category, status) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return projects.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (status === 'all' || p.status === status) &&
      terms.every((term) =>
        `${p.title} ${p.subtitle} ${p.summary} ${p.tags.join(' ')}`
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
}
