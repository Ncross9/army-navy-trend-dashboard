# Army Navy Outdoors — Weekly Trend Dashboard

Live client-facing dashboard. Rebuilt & redeployed automatically when `src/Dashboard.jsx` changes.

## Weekly update workflow

Each week you'll get a new `.jsx` file. To publish it:

```bash
cp /path/to/new-week.jsx src/Dashboard.jsx
git add src/Dashboard.jsx
git commit -m "Weekly update: week of <DATE>"
git push
```

GitHub Actions builds and deploys to GitHub Pages automatically (~1–2 min). Share the Pages URL with the client.

**Requirement for the weekly file:** it must `export default` a React component and may import from `react`, `recharts`, and `lucide-react` (already in `package.json`). If a week's file needs a new dependency, add it to `package.json` in the same commit.

## Local preview

```bash
npm install
npm run dev
```

## First-time GitHub setup

1. Create a new repo on GitHub and push this directory to it.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` handles the rest.

## Stack

- Vite + React 18
- Tailwind CSS
- recharts, lucide-react
- GitHub Actions → GitHub Pages
