# Contributing

Keep changes focused on a concrete interview or maintenance workflow. Describe the problem, resulting behavior and relevant validation.

Start with the [README](README.md) and [content guide](docs/CONTENT.zh-CN.md). Run `npm ci`, `npm run content:check`, `npm run typecheck`, `npm test` and `npm run build` from `web/`.

For content-model changes, exercise adding a project, renaming without changing its ID, hiding it and deleting referenced content. Extend the reference checks for new relations. For presentation changes, verify keyboard access, detail-panel return behavior and a narrow viewport. All essential text must remain usable without WebGL.

Do not commit credentials, private source documents or raw agent traces. Use `web/examples/project.json` for reusable examples. Personal portraits and resume content are excluded from the template's reuse permission; see [ASSETS.md](docs/ASSETS.md).
