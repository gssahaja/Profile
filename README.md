# TaskKu V5 — Build & Publish

This repo is a Vite + React + TypeScript single-page app. Below are quick steps to publish it so everyone can use it.

1) Build locally

```bash
npm install
npm run build
```

The production files will be in `dist/`.

2) Publish via GitHub Pages (automatic)

- Push this repository to GitHub (branch `main` or `master`).
- If you don't already have a remote, create a new GitHub repo and copy the URL from the green `Code` button.
- Use one of these commands in PowerShell:

```powershell
cd "C:\Users\user\Desktop\TASKKU VSCODE"
# replace the URL with your repo URL
$remoteUrl = "https://github.com/<username>/<repo>.git"
.\setup-github-remote.ps1 -RemoteUrl $remoteUrl
```

- The included GitHub Actions workflow `.github/workflows/deploy.yml` will build and publish `dist/` to the `gh-pages` branch automatically on each push.

No extra secrets are required — the workflow uses `${{ secrets.GITHUB_TOKEN }}`.

3) Alternative hosts

- Vercel: connect the repo to Vercel and set the framework to `Vite`. Vercel will auto-deploy on push.
- Netlify: drag `dist/` as a deploy target or connect the repo and set build command `npm run build` and publish directory `dist`.

If you want, I can also:
- Configure a `package.json` `deploy` script using `gh-pages` package.
- Create a `CNAME` file for custom domain.
- Set up automatic deploy to Vercel/Netlify.
