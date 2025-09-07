# Math Chronicles

An interactive timeline of the historical development of mathematical ideas.

Contributions are welcome! See `CONTRIBUTING.md` for how to add or edit timeline entries.

## GitHub Pages Deployment

- Deploy: `.github/workflows/gh-pages.yml` runs on pushes to `main` (and on manual dispatch) and publishes to GitHub Pages.
- CI: `.github/workflows/ci.yml` runs on pull requests (and manual dispatch) to validate content, lint, and build without deploying.
- The deploy workflow sets `BASE_PATH` to `/<repo-name>` for project pages, or root for `*.github.io` repositories, and creates `out/.nojekyll`.

Local build (static export):

```
npm ci
npm run build
# output in ./out
```

## GitHub Star Button

The header renders a GitHub "Star" button using the iframe embed from ghbtns.com. Set the environment variable `NEXT_PUBLIC_GITHUB_REPO` to your repo slug, e.g.:

```
NEXT_PUBLIC_GITHUB_REPO=yourname/math-chronicles
```

For GitHub Actions deployments, this is set automatically in the workflows. If unset locally, the button defaults to the Bootstrap repo example.
