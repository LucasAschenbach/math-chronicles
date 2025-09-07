# Contributing to Math Chronicles

Thanks for your interest in improving the timeline! This project accepts content contributions via pull requests. After your PR is merged, the content automatically appears on the website on the next deploy.

Below is a quick guide to add or edit entries.

## How content works

- Source of truth: `content/timeline.json`
- Each entry is an object with:
  - `year` (string, e.g. "300 BCE" or "1687")
  - `title` (string)
  - `blurb` (string; short paragraph; supports inline LaTeX via `$...$` and display via `$$...$$`)
  - `details` (optional string; longer description; LaTeX supported)
  - `image` (optional object): `{ src: string; alt?: string; caption?: string }`
    - `src` is a root-relative path under `public/` (e.g. `/images/elements.png`)

Example entry:

```
{
  "year": "1687",
  "title": "Principia Mathematica",
  "blurb": "Short context for the milestone.",
  "details": "Optional longer description with math like $F=ma$.",
  "image": { "src": "/images/principia.png", "alt": "Title page", "caption": "Newton's Principia (1687)" }
}
```

Ordering is preserved as-is in the JSON file. Add new entries wherever they fit chronologically.

## Adding images

- Place assets under `public/images/` (create the folder if it doesn't exist)
- Reference them with a leading slash, e.g. `"/images/my-figure.png"`

## Local development

1. Install dependencies: `npm ci`
2. Start the dev server: `npm run dev`
3. Edit `content/timeline.json`. Changes hot-reload in the app.

## Validation & CI

Every PR runs CI to ensure content and build are valid:

- Content validation: `node scripts/validate-content.js`
- Linting: `npm run lint`
- Build: `npm run build`

If validation fails, the Action output will list the issues. Fix them and push again.

## Tips for good entries

- Keep `blurb` concise; use `details` for depth.
- Provide `alt` text when including images.
- Prefer clear, neutral tone with a reference-worthy caption.

Thanks again for contributing!

