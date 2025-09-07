# Math Chronicles

An interactive timeline of the historical development of mathematical ideas.

Contributions are welcome! See `CONTRIBUTING.md` for how to add or edit timeline entries.

## GitHub Pages Deployment

- The workflow `.github/workflows/gh-pages.yml` builds a static export and deploys it to GitHub Pages on pushes to `main`/`master`.
- It automatically sets `BASE_PATH` to `/<repo-name>` for project pages, or root for `*.github.io` repositories.
- No Jekyll: the workflow creates `out/.nojekyll` so `_next/` assets are served correctly.

Local build (static export):

```
npm ci
npm run build
# output in ./out
```
