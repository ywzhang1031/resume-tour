import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const states = ['开发中', '阶段实验完成', '已发布版本', '已交付', '已发表'];
const visibility = ['visible', 'draft', 'hidden', 'archived'];
const requireValue = (ok, message) => {
  if (!ok) throw new Error(message);
};

export function validateContent(data) {
  const ids = new Set();
  for (const project of data.projects) {
    requireValue(
      idPattern.test(project.id),
      `Invalid project id: ${project.id}`,
    );
    requireValue(!ids.has(project.id), `Duplicate project id: ${project.id}`);
    ids.add(project.id);
    for (const field of ['title', 'subtitle', 'category', 'role', 'summary']) {
      requireValue(
        typeof project[field] === 'string' && project[field].trim(),
        `${project.id}: missing ${field}`,
      );
    }
    requireValue(
      states.includes(project.status),
      `${project.id}: invalid status`,
    );
    requireValue(
      visibility.includes(project.visibility),
      `${project.id}: invalid visibility`,
    );
    requireValue(
      Number.isFinite(project.order),
      `${project.id}: invalid order`,
    );
    requireValue(
      Array.isArray(project.tags) &&
        project.tags.every((x) => typeof x === 'string'),
      `${project.id}: invalid tags`,
    );
    requireValue(
      Array.isArray(project.steps) && project.steps.length,
      `${project.id}: steps cannot be empty`,
    );
    const steps = new Set();
    for (const step of project.steps) {
      requireValue(
        idPattern.test(step.id) && !steps.has(step.id),
        `${project.id}: invalid or duplicate step id`,
      );
      steps.add(step.id);
      if (step.illustration)
        requireValue(
          step.illustration === 'landing-safety',
          `${project.id}: unknown illustration`,
        );
      requireValue(
        step.title &&
          step.body &&
          Array.isArray(step.points) &&
          Array.isArray(step.flow) &&
          step.flow.length > 1,
        `${project.id}/${step.id}: incomplete step`,
      );
    }
    if (project.resumeHighlights)
      requireValue(
        Array.isArray(project.resumeHighlights) &&
          project.resumeHighlights.every(
            (line) => typeof line === 'string' && line.trim(),
          ),
        `${project.id}: invalid resume highlights`,
      );
    if (project.milestones) {
      requireValue(
        Array.isArray(project.milestones),
        `${project.id}: invalid milestones`,
      );
      for (const milestone of project.milestones)
        requireValue(
          milestone.label &&
            milestone.detail &&
            ['已完成', '在研', '计划实践'].includes(milestone.status),
          `${project.id}: invalid milestone`,
        );
    }
    for (const link of project.links ?? []) {
      requireValue(
        link.label && /^https:\/\//.test(link.url),
        `${project.id}: links must use https`,
      );
    }
    if (project.note)
      requireValue(
        /^[a-z0-9-]+\.md$/.test(project.note),
        `${project.id}: invalid note path`,
      );
    if (project.image) {
      const picture = project.image;
      requireValue(
        /^\/images\/projects\/[a-z0-9-]+\.(svg|png|jpg|webp)$/.test(
          picture.src,
        ) &&
          picture.alt?.trim() &&
          picture.caption?.trim() &&
          Number.isFinite(picture.width) &&
          picture.width > 0 &&
          Number.isFinite(picture.height) &&
          picture.height > 0,
        `${project.id}: invalid project image`,
      );
      requireValue(
        existsSync(resolve(root, 'public' + picture.src)),
        `${project.id}: missing project image`,
      );
    }
  }
  const chapters = new Set();
  for (const project of data.projects) {
    for (const id of project.relatedProjects ?? [])
      requireValue(ids.has(id), `${project.id}: unknown related project ${id}`);
  }
  for (const chapter of data.tour.chapters) {
    requireValue(
      idPattern.test(chapter.id) && !chapters.has(chapter.id),
      `Duplicate or invalid chapter id: ${chapter.id}`,
    );
    chapters.add(chapter.id);
    requireValue(
      ['intro', 'journey', 'project', 'personal', 'closing'].includes(
        chapter.kind,
      ),
      `${chapter.id}: invalid chapter kind`,
    );
    if (chapter.kind === 'project')
      requireValue(
        ids.has(chapter.project),
        `${chapter.id}: unknown project ${chapter.project}`,
      );
  }
  for (const item of [
    ...data.profile.stack,
    ...(data.profile.focus ?? []),
    ...data.profile.experience,
  ]) {
    for (const id of item.projects)
      requireValue(ids.has(id), `Profile references unknown project: ${id}`);
  }
  for (const id of [
    ...(data.resume?.workProjects ?? []),
    ...(data.resume?.selectedProjects ?? []),
  ])
    requireValue(ids.has(id), `Resume references unknown project: ${id}`);
  requireValue(
    data.tour.chapters.some((c) => c.kind === 'intro'),
    'Tour requires an introduction',
  );
  return data;
}

export function publicContent(input) {
  validateContent(input);
  const projects = input.projects
    .filter((p) => p.visibility === 'visible')
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const ids = new Set(projects.map((p) => p.id));
  return {
    profile: {
      ...input.profile,
      stack: input.profile.stack.map((s) => ({
        ...s,
        projects: s.projects.filter((id) => ids.has(id)),
      })),
      focus: (input.profile.focus ?? []).map((s) => ({
        ...s,
        projects: s.projects.filter((id) => ids.has(id)),
      })),
      experience: input.profile.experience.map((s) => ({
        ...s,
        projects: s.projects.filter((id) => ids.has(id)),
      })),
    },
    tour: {
      ...input.tour,
      chapters: input.tour.chapters.filter(
        (c) => c.kind !== 'project' || ids.has(c.project),
      ),
    },
    projects: projects.map((p) => ({
      ...p,
      relatedProjects: (p.relatedProjects ?? []).filter((id) => ids.has(id)),
    })),
    resume: {
      workProjects: (input.resume?.workProjects ?? []).filter((id) =>
        ids.has(id),
      ),
      selectedProjects: (input.resume?.selectedProjects ?? []).filter((id) =>
        ids.has(id),
      ),
    },
  };
}

export function loadContent() {
  const json = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  const data = {
    profile: json('content/profile.json'),
    tour: json('content/tour.json'),
    resume: json('content/resume.json'),
    projects: readdirSync(resolve(root, 'content/projects'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => json(`content/projects/${f}`)),
  };
  validateContent(data);
  for (const project of data.projects) {
    if (project.note)
      project.markdown = readFileSync(
        resolve(root, 'content/notes', project.note),
        'utf8',
      );
  }
  requireValue(
    /^\/images\/[a-z0-9-]+\.(png|webp|jpg)$/.test(data.profile.portrait) &&
      existsSync(resolve(root, 'public' + data.profile.portrait)),
    'Missing or invalid profile portrait',
  );
  return data;
}

export function generateContent() {
  const data = publicContent(loadContent());
  const output = JSON.stringify(data, null, 2) + '\n';
  const path = resolve(root, 'lib/content.generated.json');
  if (!existsSync(path) || readFileSync(path, 'utf8') !== output)
    writeFileSync(path, output);
  return data;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const data = generateContent();
  console.log(
    `Content valid: ${data.projects.length} projects, ${data.tour.chapters.length} chapters.`,
  );
}
