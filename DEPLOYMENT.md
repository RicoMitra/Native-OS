# Deployment

Native OS has been deployed as a separate Vercel project for this application.

Production URL:

```text
https://native-os-eight.vercel.app
```

## Required Separation

Keep GitHub and Vercel responsibilities separate:

- **GitHub**: source control, documentation, pull requests, CI.
- **Vercel**: hosting and deployment.

Do not treat Vercel as the source of truth for repository content.

## Vercel Configuration

If deploying from a repository that contains this project as a subfolder, configure Vercel with:

```text
Root Directory: native-os
Framework Preset: Next.js
Install Command: pnpm install
Build Command: pnpm build
Output Directory: .next
```

No environment variables are required for Version 1.

## Manual Redeploy Steps

1. Push the repository to GitHub.
2. Open Vercel and choose **Add New Project**.
3. Import the GitHub repository.
4. Set **Root Directory** to `native-os`.
5. Confirm the framework preset is Next.js.
6. Keep install/build defaults or use the commands above.
7. Deploy only after reviewing the preview configuration.

## Important Warning

Do not deploy from the repository root if the repository also contains other projects. The Vercel root directory must be:

```text
native-os
```

## Pre-Deploy Checklist

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Desktop browser QA
- Mobile browser QA
- Console error check
- Sensitive-file scan
- Confirm no private Obsidian vault files are staged for GitHub
