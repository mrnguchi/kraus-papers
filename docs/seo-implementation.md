# SEO implementation audit — 4 November 2026

Source plan: Kraus_Papers_14_Day_On_Page_SEO_Plan.docx. This report replaces the former PHP implementation checklist. The active site is Next.js in the repository root, configured for GitHub → Netlify. Status below is based on source inspection and local verification; it is not a Search Console report or proof that the latest code is deployed.

## Current inventory

- 32 product URLs across four categories, all retained.
- Home, About, Contact, Resources and two buyer guides.
- 42 intended indexable canonical pages in the sitemap.
- Three legal drafts remain accessible but noindex and outside the sitemap.
- Original product action register: seo-url-register.csv. All 32 products still map to their original URLs. The register's stock-verification actions remain unresolved.

## Reconciliation against the 14-day plan

| Plan day | Status | Implemented evidence | Still required |
|---|---|---|---|
| 1 — Baseline and offer | Partial | Original public audit retained in the source plan; complete local URL inventory and automated crawl. | Owner: target countries, customer types, sourcing/manufacturing role and qualified-enquiry definition. Account owner: Search Console 28/90-day exports and PageSpeed baseline. |
| 2 — URL consistency/discovery | Implemented in code | Absolute canonicals retain product IDs; plain index.php redirects to `/` and preserves queries; www redirects to non-www; robots and 42-entry sitemap; invalid pages/IDs return 404. | Verify HTTPS, domain aliases, sitemap and Google-selected canonicals on the actual Netlify production domain after DNS/cutover. HTTPS enforcement belongs to the hosting platform. |
| 3 — Overlap and product facts | Pending owner evidence | All original URLs preserved; A4, receipt, parent-roll, colour and tape overlap groups identified in the source plan/register. | Product owner + SEO account owner: compare SKUs, supplied grades, dimensions and real query/link data. No merges or one-to-one product redirects have been approved or implemented. |
| 4 — Home/trust/contact | Partial | Range-specific Home metadata/H1, four category paths, About with illustrative production captions, dedicated product-aware Contact, consistent supplied email/address. | Owner: full registered company identity, operating role, markets, image permissions and legal/privacy facts. Legal drafts have not been finalised. |
| 5 — Printing paper | Partial | Category buying guidance and all 11 URLs retained; A4, large sheets, PE-coated sheets and white kraft have priority application/enquiry notes. | Product owner: actual grades, sizes, weights, grain, finish, pack units and duplicate decisions. No unsupported supply specifications added. |
| 6 — Thermal/labels | Partial | Category distinguishes finished rolls from labels and jumbo stock. Receipt, barcode and custom-label priority notes, printer-fit checklists, relevant guide links. | Product owner: actual roll/label geometry, winding, adhesive, printer process, packing and grade-specific declarations. Receipt overlap still pending. |
| 7 — First review | Partial | Local technical, link, mobile and mock-form regression checks. | Owner review of product facts and account-based URL inspection; production comparison. |
| 8 — Jumbo rolls | Partial | Parent-roll/converting guidance, thermal and coloured roll priority notes, core/weight/winding checklists and guide links. | Product owner: grade/geometry/tolerance evidence and duplicate/colour decisions. |
| 9 — Tapes | Partial | Category separates carton sealing, bonding, general use and custom requests. BOPP, bonding and custom-packing priority notes. | Product owner: actual backing/adhesive/thickness, sizes, application limits and confirmed custom print services. |
| 10 — Metadata/linking/schema | Implemented for known facts | Unique metadata, canonicals, category/product breadcrumbs, Organization markup, contextual links. Guides now have Article markup and article-specific previews. | Live Rich Results/URL inspection after deployment. Product rich-result offers/ratings remain intentionally absent because qualifying verified data is unavailable. |
| 11 — Buyer resources | Implemented; review pending | Two original guides and a linked resource hub. Editorial article layout, measurement diagrams, summaries, dates, reading times, contents links, related reading and quote paths. | Product-specialist review of guidance; do not invent a named reviewer. |
| 12 — Performance/mobile | Partial; improved this pass | Compressed responsive hero backgrounds; optimized secondary background; responsive Next Image product media; intrinsic dimensions restored; responsive editorial layout; native scrolling and reduced-motion support. | Comparable PageSpeed/lab runs and available field CWV. Asset reductions and browser layout checks are not a field LCP/INP/CLS pass. |
| 13 — Release audit | Partial | Automated page/link/metadata/schema checks, browser/mobile checks and mock form/security coverage. | Owner commercial/legal review and deployed-domain, Blobs, cleanup and actual mailbox acceptance/inbox verification. No real messages sent during this audit. |
| 14 — Submission/follow-up | Pending account/release action | Current deployment instructions are in netlify-deployment.md. | Submit sitemap in Search Console, record release date and schedule reviews 2/4 weeks later. No indexing requests or ranking claims made. |

## Improvements made in this pass

### Editorial UI and content

Resources now has a news-style masthead, a prominent lead story, a secondary story, section labels and a catalogue sidebar. Article pages use a large readable headline, a concise standfirst, a visible Kraus Papers byline, reading time, labelled diagrams and captions, a summary, anchored contents navigation, comfortable text width and relevant next reading. Mobile layouts stack cleanly; the news-style presentation does not turn buying guides into news reports.

Two original SVG measurement diagrams have PNG versions for sharing metadata. Summaries, takeaways and diagrams are substantive additions, so both guides now visibly show 4 November 2026 as their update date. That same date is used in Article dateModified, Open Graph and sitemap lastmod. No original publication date, named expert, testimonial or review was invented.

The Resources link is now visible in primary navigation as well as the footer and relevant categories/products. All catalogue entries can be read without JavaScript; the noscript view displays entries normally hidden behind View More.

### Technical polish

- Article schema describes visible buying guides using Article, not fabricated NewsArticle claims.
- Product social previews use the actual product image; guide previews use their own diagram. General pages use the paper-production image. Open Graph/Twitter metadata includes meaningful images and dimensions.
- Actual image dimensions are generated from public assets. Product cards/detail images use Next Image with responsive sizes. About/editorial images retain explicit dimensions.
- Hero preloads match the mobile/desktop background variants. Optimized background byte comparisons are recorded in seo-image-report.md; originals are retained for reference.
- Legal/preview noindex rules, product canonicals, form privacy and the 42-URL sitemap are preserved. Only the two actually updated guides receive lastmod dates; no dates are fabricated for other pages.

## Verification and practical limits

Run from the root:

```powershell
npm.cmd test
npm.cmd run build
```

With a local server running (see README.md):

```powershell
npm.cmd run test:site
npm.cmd run test:browser
```

Checks cover canonical/metadata uniqueness, genuine 404s, JSON-LD, internal links, sitemap parity, guide content/preview agreement, image dimensions and article anchors, plus mobile layouts, catalogue controls, motion preferences and mock/non-JavaScript form behaviour. Live-domain HTTPS/DNS, Google indexing, actual Netlify service bindings and real inbox delivery need deployment/account checks.

Final local results: optimized production build passed; 931 HTTP/SEO checks passed across all 42 indexable pages and 32 products; 13 security/storage test groups passed; 28 responsive page checks passed (seven representative pages at 320, 375, 768 and 1440 pixels). Browser checks also passed for article contents links, no-JavaScript catalogue discovery, navigation, filters, motion preferences and mock form success/failure. Resource-hub and article screenshots were visually inspected on mobile and desktop. No real emails sent and no deployment performed.

## Next actions, in order

1. **Business/product owner:** complete registered identity and the actual product specification sheets. Approve which overlapping listings are genuine variants before any merge.
2. **Site owner:** deploy the tested commit to Netlify and verify production aliases, contact operation, privacy draft status and image delivery. Preserve Hostinger email DNS during any nameserver change.
3. **Search Console owner:** submit https://krauspapersgmbh.com/sitemap.xml, inspect Home, categories and representative products/guides; export query/page/country/device baselines.
4. **SEO/analytics owner:** choose an approved measurement platform and consent approach, connect existing non-personal lead/email-click hooks, and define qualified enquiries. Event hooks alone do not report conversions.
5. **Performance reviewer:** record mobile/desktop lab comparisons on Home, a category, a product and a guide. Evaluate field thresholds only when sufficient real-user data exists.

## Sources

- Original 14-day Word plan in this folder.
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/appearance/google-images
- https://nextjs.org/docs/app/api-reference/components/image

No new supplier specifications, search volumes, traffic numbers, rankings or field performance scores were invented.
