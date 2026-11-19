# Figma → Code (MCP)

Rules and conventions for converting Figma designs into components with the
OpenFigma MCP server (`opencode.jsonc`, credentials in root `.env`).

## Universal Figma asset configuration

- All images, vector graphics, and icons downloaded by the Figma MCP server are
  stored in the project's public folder at `/figma-export/`.
- Do NOT use temporary AI-generated placeholders or ask the user to upload
  these files.
- In your generated React/HTML/Next.js components, always use the matching
  files directly with their relative paths (e.g.
  `<img src="/figma-export/filename.png" />` or `/figma-export/node-id.png`).

## Figma design guidelines

- Always fetch layout metadata, colors, typographies, and positioning using
  the local Figma MCP server tools (`get_figma_data`).
- Do not invent ad-hoc styling metrics. Use the spacing, margins, and padding
  values returned by the server.
- Map vertical stacks in Figma directly to Tailwind `flex flex-col` and
  horizontal layout groupings directly to `flex flex-row`.

## Workflow notes

- Rate limits: the Figma image render API (used by `get_image`) is heavily
  capped on free plans. When renders return `429`, fall back to placeholder
  files at their **exact final paths/hames** under `public/projects/` (or
  `/figma-export/`) and let the user export/replace them later — component
  code must not change when real assets land.
- Design node geometry that must be honored (aspect ratios, fixed columns,
  per-line typography ramps) belongs in a comment on the component's data, not
  invented per render.
