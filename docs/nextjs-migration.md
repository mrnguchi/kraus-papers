# Next.js migration — 4 November 2026

**Root conversion update:** Next.js now runs directly in the project root. Run `npm.cmd run dev` here. The former PHP version is archived locally in .migration-backup and excluded from Git. Paths and `cd nextjs` examples below describe the earlier migration layout; use README.md and netlify-deployment.md for current instructions.

**Hosting update:** the application is now configured for Netlify and uses shared Netlify Blobs instead of SQLite. Use [netlify-deployment.md](netlify-deployment.md) for current instructions. The original Hostinger/persistent-disk discussion below records the first migration version and is superseded for the Next.js deployment.

The migrated application is in `nextjs/`. The original PHP site remains available for rollback. No live website, DNS record or mailbox was changed.

## Start and verify

From the project directory:

```powershell
cd nextjs
npm.cmd run dev
```

Open http://localhost:3000. Dependencies have been installed locally. On a fresh checkout, first run `npm.cmd ci`.

## Preserved behaviour

- All 32 product URLs and content; four categories and filters; View More; product-aware enquiries.
- Existing design/CSS and images, responsive legal pages, mobile menus and keyboard controls.
- Home, About, Contact, Resources, two buyer guides and three legal drafts.
- Absolute canonicals, unique metadata, genuine 404s, index.php redirect with preserved query, www redirect, 42-entry sitemap and robots file.
- Fixed recipient and authorized From/validated Reply-To, private credentials, field/body limits, CSRF, honeypot, persistent server-side rate limiting and accepted-submission deduplication.
- Failure feedback preserves values, double clicks are blocked, and non-JavaScript users can initialize and submit the secure form.
- Privacy draft updated for Node form session storage. Unverified legal/product claims remain draft/pending; no new identity details were invented.

## Architecture and deliberate choices

Next.js App Router with server-rendered pages and React client components for interaction. `.php` URLs remain as ordinary Node routes to avoid an unnecessary SEO URL migration. No PHP interpreter, Composer or vendor folder is needed in the Node deployment. Trusted static editorial HTML is held in content.json; it is not runtime PHP or fetched page snapshots. The source JSON can be edited directly.

Nodemailer replaces PHPMailer. SQLite replaces PHP sessions and the flat-file limiter, using transactional updates and atomic submission claims. The private database contains token/session metadata and temporary failed-form values, not accepted enquiry bodies. Proxy/IP and persistent storage configuration must be completed before production; see nextjs/README.md.

This build requires a persistent Node service with durable private SQLite storage. It is not a static export. For ephemeral/serverless or multiple isolated instances, replace the storage adapter with a shared transactional database before deployment. No analytics service or optional tracking cookies were added.

## Simple Hostinger deployment path

1. Keep the current PHP site running. Create a separate **Node.js Web App** on a temporary hostname or staging subdomain supported by your hosting plan. Verify that the account offers Node apps; ordinary PHP File Manager uploads cannot run this application.
2. Prepare the app's images locally with `npm.cmd run prepare:assets` from nextjs. Upload a ZIP of the contents of nextjs containing package.json, package-lock.json, next.config.mjs, jsconfig.json, src/, scripts/ and public/. Include the actual public/assets/images files. Exclude node_modules, .next, .env files, storage, and screenshots. Do not upload the parent PHP app/vendor directories as part of the Node app.
3. Select Next.js and Node 24 (or a supported version meeting package.json requirements). Use `npm ci` for installation, `npm run build` for building and `npm start` for the persistent server. Install dependencies on the hosting platform; do not upload Windows node_modules, because SQLite's native module must match the server OS.
4. Set private environment variables using nextjs/.env.example as the field list. Add the existing mailbox password yourself. Set APP_ORIGIN to the exact HTTPS staging origin while testing, then the production origin at cutover. Keep the recipient and authorized sender mailbox unchanged.
5. Arrange a private writable **persistent** CONTACT_STORAGE_DIR outside Hostinger's versioned build directories. Confirm the trusted client-IP header with Hostinger and configure CONTACT_TRUSTED_IP_HEADER only if the platform overwrites it. If either capability is unavailable, use a VPS or implement a durable shared database adapter before going live.
6. Test navigation, mobile layouts, product queries, invalid IDs, /sitemap.xml and /robots.txt on staging. Canonicals intentionally continue pointing to the production domain. Keep staging behind access control to avoid indexing. A genuine mail-delivery test should be an explicit owner-approved step; none was sent during migration.
7. Plan the production domain cutover separately after staging passes. Do not delete the PHP site or change MX/email settings as part of testing. Hostinger currently treats Node apps as separate websites, so confirm its domain reassignment procedure and keep full backups before any live switch. This migration does not authorize that switch.
8. At cutover, enforce HTTPS in the hosting proxy, verify www and index.php redirects, preserve mail DNS, retest enquiries and submit the unchanged sitemap URL in Search Console. Keep the old PHP copy for rollback.

Official hosting reference: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/ (checked 4 November 2026). Available features depend on the actual account/plan.

An optional packaging helper is provided at scripts/package-next.ps1 in the original project. Run it in PowerShell (or `powershell -ExecutionPolicy Bypass -File scripts/package-next.ps1` if local policy blocks this task script). It creates nextjs/kraus-nextjs-deploy.zip from an explicit source/public-file allowlist and excludes credentials, private storage and node_modules. Using Bypass for this single command does not change the system execution policy.

## Verification completed locally

- Optimized production build completed on Next.js 16.4.5 / React 19.3.1.
- 379 production HTTP/SEO checks passed, including all 32 products, canonical and internal-link coverage, 404s, aliases, discovery endpoints and rejected contact submissions.
- Six contact-core test groups passed: validation/limits, CSRF/origin/honeypot, persistent rate limits, transport acceptance/failure, atomic concurrent claims and session expiry. Mock transports only.
- Browser checks passed for six representative pages at 320, 375, 768 and 1440 pixels (24 layout checks), mobile menu/Escape, filtering/View More, failure value preservation, success clearing/events and non-JavaScript failure recovery.
- Mobile screenshots of legal, product and contact pages inspected. No horizontal overflow or browser runtime errors found in this tested scope.
- No real emails sent. No production deployment, DNS edits or mailbox changes performed. These are local checks, not field Core Web Vitals measurements or a claim about indexing/rankings.

## Remaining owner inputs

Existing SEO plan dependencies remain: registered company identity, product specifications/SKU distinctions, Search Console access, analytics decisions, and measured performance baselines. The Next.js migration does not itself establish rankings, verified product claims or completed legal review.
