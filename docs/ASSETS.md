# Asset provenance and reuse

Code and original project documentation use the root MIT license. Yuewen Zhang's personal identity, resume text and portrait are included for this portfolio. They are not template identities: replace them before deploying a fork as your own site. Third-party names and linked repositories retain their own rights.

## Portrait

- Repository asset: `web/public/images/yuewen-photo.jpg`.
- The author's real photograph, reused at his explicit request from [his personal homepage](https://ywzhang1031.github.io/assets/img/photo.jpg).
- Copied unchanged from the homepage source repository. Only the page's CSS framing changes; no face generation or retouching is applied.
- This replaces the earlier generated portrait. The photo represents Yuewen Zhang and is not a reusable template identity.

## Project figures

- Eight original explanatory SVG diagrams live in `web/public/images/projects/` and can be regenerated with `node web/scripts/project-diagrams.mjs`.
- They illustrate project architecture, interfaces, measurement boundaries and training stages. They are not product screenshots, measured benchmark plots or records of completed future work.
- `dalsclip.png` is the author's method figure, reused from [his homepage](https://ywzhang1031.github.io/assets/img/publication_preview/dalsclip.png). The diagram remains unchanged; see the linked paper for the complete method and experimental claims.
- Project captions and alternative text are maintained in each project JSON file. Assets are local and need no third-party image host to render.

The technical scenes are original, code-generated data-flow diagrams built with Three.js. Interface icons use Lucide. System fonts are resolved locally. No intro3d models, images or source code were copied.

## Landing-protection illustration

`web/components/landing-demo.tsx` contains an original SVG and an eight-second, user-triggered sequence. It illustrates sensing water, publishing a protection state, and flight-controller response. It is explicitly labelled as a schematic, not flight footage or a measurement. The linked Antigravity A1 manual describes the public product behavior; no third-party video is copied or embedded.

## Resume

`web/public/files/yuewen-zhang-resume.pdf` is generated from public site content, with the locally available STHeiti font embedded for Chinese text. Use your own content and appropriately licensed local font when regenerating it. The resume is intended for recruitment review, not identity reuse.
