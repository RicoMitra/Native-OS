# Privacy

Native OS is a local-first browser application. Version 1 does not require accounts, paid APIs, external AI services, server-side storage, analytics, or a cloud database.

## Data Stored Locally

Project data is stored in browser `localStorage` under:

```text
native-os:v1
```

Stored data can include:

- Project brief fields
- Workflow checklist state
- Checklist evidence
- Stage notes
- Generated prompt text
- Project log entries

## Data Not Collected

Native OS does not collect or transmit:

- Names, emails, or account identities
- API keys or credentials
- Environment variables
- Payment information
- Analytics events
- Project data to a backend
- Project data to OpenAI or any paid API
- Project data to Vercel, GitHub, or cloud storage automatically

## Manual User Actions

The user can manually copy prompt text, copy Markdown, download Markdown, commit files to GitHub, or deploy the app to a host. Those actions are outside automatic app behavior and should be reviewed by the user before publishing.

## Clearing Data

Use the app reset controls or clear browser site data to remove local project state. Clearing browser storage deletes saved Native OS project data on that browser.

## Deployment Privacy

The deployed application remains client-side for V1. Hosting the app on Vercel, Cloudflare Pages, or Netlify does not require storing user project data on that platform.
