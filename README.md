# Kraus Papers

Next.js and React company website. Run commands directly from this folder; there is no separate application subdirectory.

## Run locally

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:3000. Install dependencies once on a fresh checkout; after that, just run `npm.cmd run dev`. Ctrl+C stops the server. `npm.cmd` avoids PowerShell's npm.ps1 execution-policy restriction.

## Production build for local testing

```powershell
npm.cmd run build
$env:CONTACT_STORE='memory'
$env:APP_ORIGIN='http://localhost:3000'
npm.cmd start
```

Local form security uses process-shared memory and resets on restart. Netlify always uses durable shared Blobs storage instead; it never falls back to in-memory protection. SMTP remains unavailable without private credentials. Existing root .env was preserved and Next.js loads it automatically; do not commit it. Tests mock delivery or reject before sending and do not send real messages.

## Structure

```
src/app/                 Pages, metadata, styles, sitemap, robots and API
src/components/          React navigation, catalogue, forms and motion
src/data/content.json    All 32 products and editorial content
src/lib/                 Content helpers, security and mail transport
public/assets/images/    Public images; commit these to Git
netlify/functions/       Scheduled private-state cleanup
scripts/                 Asset checks
tests/                   Security, HTTP/SEO and browser tests
docs/                    SEO plan, deployment and migration notes
```

The former PHP application is archived locally under .migration-backup, excluded from Git and Next.js output tracing. The archive is for rollback only. PHP, Composer and vendor are not part of the active app. Existing `.php` URLs remain valid Next.js routes for SEO continuity.

## Design and interaction

The existing design, responsive product cards and legal pages are preserved. Native smooth anchor scrolling has header offsets; sections and cards reveal subtly as they enter view, with restrained hover effects. Reduced-motion preferences disable the effects. Content remains readable without JavaScript or animation support.

## Content and SEO

Edit src/data/content.json for catalogue and editorial content. Home/About sections include trusted static HTML; visitor data is never inserted as HTML. Canonicals and metadata retain the production origin https://krauspapersgmbh.com. The sitemap lists 42 indexable URLs; legal drafts stay noindex. Do not add unverified stock, certification, registration or delivery claims.

The resource hub and guides use a dedicated editorial layout in src/components/Editorial.jsx. Guide summaries, diagrams and update dates are in src/data/editorial.js. Keep visible update dates, Article metadata and sitemap modification dates aligned when making substantive changes. Image preparation generates actual intrinsic dimensions and optimized backgrounds during dev/build. See docs/seo-implementation.md for the current plan audit and pending owner/account work.

## Contact form and email

Use .env.example as the private configuration template or set values in Netlify's environment-variable UI. No credential belongs in public/, netlify.toml, GitHub or a NEXT_PUBLIC_ variable. The recipient is fixed to info@krauspapersgmbh.com. A configured authorized From address is used, with the visitor's validated email as Reply-To. Nodemailer supports the configured LOGIN/PLAIN SMTP transport over verified TLS.

Security includes CSRF, allowed-origin checks, body/field limits, honeypot, shared atomic rate limits and send claims. Failed submissions preserve values; repeated clicks are blocked. The non-JavaScript form has a secure initialization link. Success means SMTP acceptance, not guaranteed inbox placement. Integration events contain no personal form content and do not install analytics.

On Netlify, strong Blobs reads and ETag-conditional writes coordinate separate function instances. A daily scheduled cleanup removes expired date partitions. Tokens expire logically after 24 hours and rate windows last 15 minutes. If acceptance recording fails after sending, the uncertain claim is not reopened. Production and preview stores are separate; preview email sending is disabled. See docs/netlify-deployment.md for retention and deployment verification.

## Tests

```powershell
npm.cmd test
npm.cmd run test:site
npm.cmd run test:browser
```

HTTP/browser checks require a running server. Browser tests require `npx.cmd playwright install chromium`. TEST_URL can select a different local port. For optimized local testing, use CONTACT_STORE=memory. No live SMTP sends are performed by these tests.

## Deploy from GitHub

Connect this repository to Netlify. The root netlify.toml sets base `.`, build `npm run build`, publish `.next`, and Node 24. Clear any previous `nextjs` base/package directory in the dashboard. Commit public/assets/images, package-lock.json, src and netlify/functions. Ignore node_modules, .next, .env, test screenshots and .migration-backup.

Add the private mail variables in Netlify with Functions scope (or all scopes). See [Netlify deployment instructions](docs/netlify-deployment.md). No live deployment, DNS or mailbox changes were performed.
