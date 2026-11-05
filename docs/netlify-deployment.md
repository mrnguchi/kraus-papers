# Netlify deployment and local testing

> Email setup update (5 November 2026): use [Microsoft Graph email setup](microsoft-graph-email.md) for the current certificate configuration. It replaces the historical Hostinger SMTP instructions below. No mailbox password is needed for Graph.

The Next.js application now lives in the repository root. If Netlify previously used `nextjs` as its base/package directory, clear that dashboard value. The root netlify.toml now sets base `.`. Public images are directly under public/assets/images and must be committed.

Root-conversion checks passed: optimized build, 13 security/storage groups, 379 HTTP/SEO checks and responsive browser checks. Browser coverage includes native smooth scrolling, section reveal animations and reduced-motion behaviour. The PHP version and old build caches are archived locally in ignored .migration-backup; they are also excluded from Next.js output tracing. The root .env was preserved privately.

## Run locally

From the project root:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:3000. Dependencies only need installing on a fresh checkout or after the lockfile changes. Ctrl+C stops the server. `npm.cmd` avoids PowerShell's npm.ps1 execution-policy restriction. No PHP command or Netlify account is required for local development.

Local forms use an in-memory store; it resets when the server restarts. Mail sending stays unavailable until private SMTP credentials are configured. To test an optimized local build:

```powershell
npm.cmd run build
$env:CONTACT_STORE = 'memory'
$env:APP_ORIGIN = 'http://localhost:3000'
npm.cmd start
```

## Connect GitHub to Netlify

1. Commit/push the root `netlify.toml`, `package.json`, `package-lock.json`, `src/`, `netlify/`, `scripts/` and `public/assets/images/`. These are the active Next.js files. The PHP archive is ignored and must not be pushed.
2. Import the repository in Netlify. The root configuration sets **base directory `.` (repository root)**, **build command `npm run build`**, **publish directory `.next`**, and **Node 24**. Clear any old `nextjs` base/package directory in the dashboard. Netlify supplies its Next.js adapter automatically; do not add a catch-all SPA redirect or choose a static export.
3. Add the private email variables listed below in **Project configuration → Environment variables**. They must be available to **Functions**, or all scopes if separate scopes are not offered. Variables in netlify.toml's build environment do not configure serverless runtime secrets.
4. Deploy the main/production branch. Start with its Netlify hostname; no mailbox/DNS changes are needed for this check.
5. Check pages, product prefilling, `/robots.txt`, `/sitemap.xml` and the contact form. Confirm **contact-cleanup** appears as a Scheduled function. Its daily run removes expired private state from older partitions. Monitor the scheduled function's execution/logs.

Netlify recognizes old URLs such as `/about.php` and `/product-details.php?id=…` as Next.js routes. The original PHP files are not needed in the published app. Keeping these URLs preserves existing links and canonical targets.

## Private runtime variables

Set these in Netlify, using the current Hostinger mailbox:

| Variable | Value |
|---|---|
| MAIL_TRANSPORT | smtp |
| MAIL_HOST | smtp.hostinger.com |
| MAIL_PORT | 465 |
| MAIL_ENCRYPTION | smtps |
| MAIL_AUTH | LOGIN |
| MAIL_USERNAME | info@krauspapersgmbh.com |
| MAIL_PASSWORD | Enter the mailbox password privately |
| MAIL_FROM_ADDRESS | info@krauspapersgmbh.com |
| MAIL_FROM_NAME | Kraus Papers |
| APP_ORIGIN | Optional; exact website origin, e.g. https://krauspapersgmbh.com |

The fixed recipient remains info@krauspapersgmbh.com. The visitor's validated email is Reply-To. No existing password was read or copied. Never prefix credentials with NEXT_PUBLIC_. Never put them in GitHub or netlify.toml. Existing .env files are ignored by Git; confirm they were never committed before pushing.

Netlify's generated site URL and current deploy URL are recognized automatically for origin checks. The public custom domain remains the canonical SEO origin. Deploy Previews/branch deploys are noindex and real mail sending is disabled there; test live delivery only on the production deployment after privately configuring SMTP. Preview variables should not contain production mailbox credentials.

## Serverless security storage

The app selects Netlify Blobs using non-secret build-context identifiers embedded by next.config.mjs. Store authentication comes from Netlify's runtime SDK context; no Netlify personal access token or external database account is required in this project's environment file. Production uses kraus-contact-v2-production; previews use kraus-contact-v2-preview.

Strong reads plus ETag-conditional writes prevent races in rate limits and submission claims. The app never falls back to per-instance memory on Netlify. Storage failures return a safe error and prevent sending. Only the platform's x-nf-client-connection-ip is used on Netlify; arbitrary forwarded headers are not accepted as substitutes. If the platform IP is unavailable, a conservative shared limit applies.

Sessions expire logically after 24 hours. Daily cleanup removes older date partitions, normally within four days of creation while it runs successfully. Failed forms without JavaScript may temporarily retain bounded entered values; accepted enquiry bodies are not stored in Blobs. A daily schedule runs on production deployments, not on preview-only deployments. Review these details along with provider agreements when finalising the draft privacy notice.

## Verify before launch

Local mock tests/build/browser checks do not prove deployed Blobs authentication, scheduled execution or SMTP delivery. After deployment, verify those services once on the actual site. A successful form response requires SMTP acceptance; it does not guarantee inbox placement. No real emails were sent during this change and no live deployment was performed.

## Sources checked

Local verification: optimized Next.js build passed; 13 security/storage test groups passed using mocks (including concurrent limits/claims and accepted-send storage failures); 379 production HTTP/SEO checks and 24 responsive browser checks passed. Navigation, filters, mocked success/failure, non-JavaScript value preservation and privacy exclusions were checked. No actual Netlify deployment, Blobs request with live credentials, scheduled execution or real SMTP send was performed. Confirm those integrations after the first deployment.

- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- https://docs.netlify.com/build/functions/scheduled-functions/
- https://docs.netlify.com/build/functions/environment-variables/
