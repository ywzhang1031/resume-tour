# Resume Tour

An open-source personal website for presenting experience, projects and technical work during interviews.

[简体中文](README.zh-CN.md) · [Content guide](docs/CONTENT.zh-CN.md) · [Design](docs/DESIGN.zh-CN.md)

## What works

- A guided interview with chapters, individual steps, arrow keys, progress and fullscreen.
- An introduction with grouped technology stacks, each linked to concrete projects.
- Separate research and learning directions, editable training milestones, and a short landing-protection schematic.
- A searchable project library with category and delivery-status filters.
- Expandable technical notes with stable links and return-to-step behavior.
- Optional Three.js data-flow scenes, static fallback and reduced-motion support.
- A printable resume and a concise, downloadable two-page PDF.
- File-based content, stable IDs, reference validation, ordering and visibility controls.

The current content is Yuewen Zhang's AI Infra / Coding Agent portfolio. The site is implemented with React, TypeScript, Vinext, shadcn/Base UI and Three.js. Its stylized portrait is a raster image; the technical data-flow scenes use WebGL.

## Run locally

Requires Node.js 22.13 or newer.

```sh
cd web
npm ci
npm run dev -- --host 127.0.0.1 --port 4173
```

Open `http://localhost:4173`. Stop with Ctrl-C. If the port is occupied, use `--port 4174`.

```sh
npm run content:check
npm run typecheck
npm test
npm run build
npm start -- --port 4175
```

`npm start` serves the production Worker locally through Wrangler. All instructions run from `web/`.

## Customize

| Change | File |
| --- | --- |
| Profile, stacks and experience | `web/content/profile.json` |
| Add or edit a project | `web/content/projects/<stable-id>.json` |
| Technical detail | `web/content/notes/<name>.md` |
| Interview sequence | `web/content/tour.json` |
| Concise PDF selection | `web/content/resume.json` |
| Colors and layout | `web/app/globals.css` |
| Default technical scene | `web/components/system-scene.tsx` |

Copy `web/examples/project.json` to add a project. No page or scene code is needed. Content edits regenerate the public manifest during development and build. Hidden, archived and draft entries are omitted from the website; they remain readable in this public source repository. Do not use visibility as a privacy mechanism.

See the [content guide](docs/CONTENT.zh-CN.md) for adding, removing, renaming and regenerating the PDF. Online editing and offline installation are not implemented.

## Deployment

The generated build is a Cloudflare-compatible Worker plus local static assets. The current Sites project is identified in `web/.openai/hosting.json`. Forks must register their own hosting project before deploying; do not reuse the original project's ID. Credentials are never stored in this repository. CI validates content, types, behavior and builds; it does not deploy automatically.

## Reference and license

[intro3d](https://intro3d.com/) inspired the chapter navigation and camera transitions. This is an independent implementation.

Code and original documentation: [MIT](LICENSE). The author's personal content, portrait and resume are not reusable template identities. Replace them before publishing your own site. See [asset provenance](docs/ASSETS.md).
