import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadContent, publicContent } from './content.mjs';
import {
  normalizeLocation,
  movePosition,
  filterProjects,
} from '../lib/navigation.mjs';

test('renaming and reordering preserves ID references', () => {
  const data = loadContent();
  data.projects[0].title = 'New name';
  data.projects[0].order = -100;
  const result = publicContent(data);
  assert.equal(result.projects[0].title, 'New name');
  assert.ok(result.tour.chapters.length > 1);
});
test('hidden, draft and archived projects never leak through tour or profile references', () => {
  for (const state of ['hidden', 'draft', 'archived']) {
    const data = loadContent();
    const project = data.projects.find((p) => p.id === 'landing-protection');
    project.visibility = state;
    const result = publicContent(data);
    assert.ok(!result.projects.some((p) => p.id === project.id));
    assert.ok(!result.tour.chapters.some((c) => c.project === project.id));
    assert.ok(
      !result.profile.stack.some((s) => s.projects.includes(project.id)),
    );
  }
});
test('deleting a referenced project and duplicate IDs fail before build', () => {
  const data = loadContent();
  data.projects = data.projects.filter((p) => p.id !== 'landing-protection');
  assert.throws(() => publicContent(data), /unknown project/);
  const duplicate = loadContent();
  duplicate.projects.push(duplicate.projects[0]);
  assert.throws(() => publicContent(duplicate), /Duplicate project/);
});
test('new project needs no page or scene code', () => {
  const data = loadContent();
  const sample = structuredClone(data.projects[0]);
  sample.id = 'new-project';
  sample.scene = undefined;
  sample.order = 1000;
  data.projects.push(sample);
  assert.ok(publicContent(data).projects.some((p) => p.id === 'new-project'));
});
test('unsafe evidence URLs and note traversal fail validation', () => {
  const data = loadContent();
  data.projects[0].links = [{ label: 'bad', url: 'javascript:alert(1)' }];
  assert.throws(() => publicContent(data), /https/);
  data.projects[0].links = [];
  data.projects[0].note = '../secret.md';
  assert.throws(() => publicContent(data), /note path/);
});
test('unknown hashes fall back and detail hash preserves tour step', () => {
  const { tour, projects } = publicContent(loadContent());
  const state = normalizeLocation(
    '#chapter=landing-protection&step=step-2&project=dsh-aside',
    tour.chapters,
    projects,
  );
  assert.equal(state.step, 1);
  assert.equal(state.project, 'dsh-aside');
  assert.equal(
    normalizeLocation(
      '#chapter=bad&step=bad&project=bad',
      tour.chapters,
      projects,
    ).chapter,
    'intro',
  );
});
test('previous from a chapter returns to prior final step', () => {
  const { tour, projects } = publicContent(loadContent());
  const index = tour.chapters.findIndex((c) => c.id === 'video-pipeline');
  assert.deepEqual(movePosition(index, 0, -1, tour.chapters, projects), [
    index - 1,
    2,
  ]);
  assert.deepEqual(movePosition(0, 0, -1, tour.chapters, projects), [0, 0]);
});
test('combined search and filters include tags and provide a true empty result', () => {
  const { projects } = publicContent(loadContent());
  assert.ok(
    filterProjects(projects, 'NV12', '工作交付', '已交付').length === 2,
  );
  assert.equal(
    filterProjects(projects, 'no-such-project', 'all', 'all').length,
    0,
  );
});
