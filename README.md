# Resume Tour

An open-source personal website for presenting your experience, projects, and technical work during interviews.

[简体中文](README.zh-CN.md) · [Design plan](docs/DESIGN.zh-CN.md) · [Roadmap](docs/ROADMAP.zh-CN.md)

## Project status

**Planning stage.** This repository currently contains the agreed product requirements and development plan. There is no runnable application or deployed demo yet. Features below are planned, not implemented.

## The idea

A personal website should work both as a portfolio that visitors explore and as a presentation that its owner can guide through an interview. Resume Tour will use the same content for both experiences.

The guided experience will combine chapter navigation, optional 3D scenes, readable diagrams, and expandable technical explanations. A presenter should be able to follow a prepared sequence, answer a question in depth, and return to the same point.

The initial use case is an AI infrastructure engineer's portfolio, with systems engineering experience, inference and training experiments, research, and coding-agent projects. The reusable structure should also accommodate other professions.

## Planned experience

- **Browse:** explore a profile, work experience, projects, research, and contact links.
- **Present:** advance through an interview narrative with keyboard controls, a chapter menu, progress, and full-screen presentation.
- **Explain:** expand architecture diagrams, experiments, implementation decisions, and evidence without losing the current chapter.
- **Maintain:** create, find, edit, reorder, hide, or archive projects through structured content files.
- **Customize:** adjust profile data, presentation routes, themes, and scenes independently.
- **Fall back:** retain complete readable content when 3D or motion is unavailable or disabled.

## Content-first architecture

Project content, presentation order, scene selection, and theme settings will be separate concerns. Stable IDs will connect them.

Adding a project should require content and assets, not a new page component or custom 3D model. A project without a custom scene will receive a default presentation. A later visual editor should use the same content format.

The initial content workflow will use Markdown and structured configuration under Git. The exact framework and file schema are not selected yet.

## Design reference

[intro3d](https://intro3d.com/) is a reference for chapter-based navigation and camera transitions. Resume Tour is an independent project; the reference does not grant permission to copy its source code, models, images, or branding.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Early contributions should focus on the content model, interview flow, accessibility, or a bounded implementation proposal. Setup and deployment instructions will be added with the first working prototype.

## License

Code and original project documentation are available under the [MIT License](LICENSE). Third-party materials retain their respective licenses. Personal portraits, resumes, and other contributed media need explicit reuse terms before being distributed as template assets.
