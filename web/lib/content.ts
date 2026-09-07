import generated from './content.generated.json';

export type Step = {
  id: string;
  title: string;
  body: string;
  points: string[];
  flow: string[];
  illustration?: 'landing-safety';
};
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  visibility: string;
  order: number;
  role: string;
  tags: string[];
  summary: string;
  steps: Step[];
  links: { label: string; url: string }[];
  boundary: string;
  scene?: string;
  markdown?: string;
  relatedProjects?: string[];
  resumeHighlights?: string[];
  milestones?: {
    label: string;
    status: '已完成' | '在研' | '计划实践';
    detail: string;
  }[];
  metric?: { value: string; label: string; detail: string };
};
export type Chapter = {
  id: string;
  title: string;
  kind: 'intro' | 'journey' | 'project' | 'closing';
  project?: string;
  duration: string;
};
export const content = generated as Omit<
  typeof generated,
  'projects' | 'tour'
> & {
  projects: Project[];
  tour: { title: string; duration: string; chapters: Chapter[] };
};
export const projectById = Object.fromEntries(
  content.projects.map((p) => [p.id, p]),
);
