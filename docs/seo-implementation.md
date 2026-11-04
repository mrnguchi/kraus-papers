# SEO implementation — 27 October 2026

The Next.js version now targets GitHub → Netlify. See [netlify-deployment.md](netlify-deployment.md) for current deployment/local commands; the PHP Hostinger instructions below apply only to the retained original version.

Source: Kraus_Papers_14_Day_On_Page_SEO_Plan.docx. Local implementation only; no deployment, DNS changes, Search Console submission or real email sends.

## Implemented

- Preferred origin https://krauspapersgmbh.com. Absolute self-canonicals preserve each product ID and strip enquiry/tracking variants. Homepage variants canonicalise to `/`; contact variants canonicalise to `/contact.php`.
- Hostinger Apache rules redirect www/HTTP to the preferred origin and explicit index.php requests to `/`, preserving query strings. Local router reproduces the homepage alias redirect. Apache production rules require verification after upload; PHP's development server does not execute .htaccess.
- robots.txt and dynamically generated /sitemap.xml: 42 intended indexable pages (Home, About, Contact, resources, two guides, four categories, 32 products). No artificial lastmod dates. Draft legal pages remain accessible but noindex and excluded from the sitemap until owner review.
- Organization markup limited to the existing brand, URL, logo and email. BreadcrumbList matches the visible hierarchy. No unverified registered legal name, ratings, offers, zero prices or stock status. Product rich-result markup is deferred because no qualifying verified offer/review data exists.
- Home metadata and H1 describe the actual range without unconfirmed manufacturer/wholesale/geography claims. Existing category links remain crawlable. About gallery explicitly labels illustrative production imagery.
- All four category pages have intent-specific metadata/H1s, product-family guidance, relevant product links, ordering questions and quote CTA. Product grids remain above the additional guidance.
- All 32 product URLs retained with existing unique metadata, descriptions and specification tables. Twelve priority products have additional application/limitation notes. No fabricated supply specifications. Product and category links connect the guides, contact page and catalogue.
- Dedicated product-aware contact page. New card/detail enquiry links use contact.php; legacy homepage product queries and #contact still work. Existing form security and no-JavaScript fallback remain intact.
- Resources hub linked in footer; original thermal-roll measurement and thermal-jumbo specification guides link to relevant categories, products and enquiries. No invented reviewer attribution; technical/product-owner review remains recommended.
- Product-card and detail images now use real intrinsic dimensions. Homepage hero is preloaded and remains non-lazy. Static asset expiry rules added without changing private/no-store HTML or CSRF handling.
- Measurement integration hooks: `kraus:generate_lead` after an accepted response, once per submission ID within the page lifecycle; `kraus:email_click` separately. Payloads contain no names, addresses, message text or product-query URLs. No external analytics service, tracking storage or consent mechanism added. These hooks are not yet an analytics reporting system and do not measure non-JavaScript submissions.

## Verification

Local results: 514 SEO/link checks passed across 42 indexable URLs; smoke checks passed for all 32 products, assets, enquiry summaries and private-file isolation; 54 backend contact checks, 21 isolated HTTP checks, dotenv checks and client state/event checks passed. PHP syntax checks passed. No real email sent. Mobile visual review and measured browser performance are still outstanding; HTTP checks are not visual or Core Web Vitals validation.

Run `php -S 127.0.0.1:8096 -t public scripts/serve-router.php`, then:

```
php tests/seo.php
php tests/smoke.php http://127.0.0.1:8096
php tests/contact.php
php tests/contact-http.php
php tests/mail-config.php
node tests/contact-client.cjs
```

SEO checks cover 42 canonical pages, unique metadata, one H1, valid JSON-LD, sitemap parity, genuine 404s, homepage redirects, legal draft exclusion and both old/new product-prefill routes. Mail tests use mocks only. Local tests cannot establish Google-selected canonicals, indexing, ranking or field Core Web Vitals.

## Plan reconciliation and pending work

| Plan days | Result / remaining dependency |
|---|---|
| 1 | Original document provides the public audit baseline. Generated seo-url-register.csv accounts for all pages and 32 original products. Search Console 28/90-day exports, target countries and qualified-lead definition need owner account/input. No search metrics invented. |
| 2 | Canonicals, discovery endpoints and redirect configuration implemented; production host/HTTPS tests follow deployment. |
| 3 | All products retained pending SKU and grade comparison; no irreversible or speculative merges. A4, finished receipt and thermal-parent groups require owner evidence and GSC data. |
| 4 | Home, About and dedicated Contact improved. Registered identity and legal-page completion still owner-dependent. |
| 5–6, 8–9 | Four categories enriched; all products accounted for; 12 priority buying notes added. Actual grade, size, packing, MOQ, lead-time, chemical and certification fields cannot be filled without supplier documents. |
| 7, 10, 13 | Automated metadata/discovery/form checks available. Owner claims review and Search Console/Rich Results live inspection remain. No FAQ rich-result markup. |
| 11 | Resource hub and two guides implemented, linked both ways; no named expert review claimed. |
| 12 | Intrinsic dimensions, hero preload and safe static caching implemented. Original hero is 1,033,892 bytes; secondary about image 2,974,601 bytes. Image-format conversion and performance tuning need measured lab comparison/visual checks; no fabricated PageSpeed or CrUX pass. |
| 14 | Upload and Search Console submission not performed. Owner must deploy, submit sitemap and record actual release date; schedule manual reviews 2 and 4 weeks after that date. |

### Information to obtain

Product owner: SKU distinctions; actual supplied dimensions, grammage, coating/backing/adhesive, tolerances, packaging, minimum orders, delivery terms and supporting documents. Confirm custom printing availability and samples. Review A4, receipt-roll, thermal-parent, coloured/red and bonding/clear-tape overlap before selecting survivor URLs.

Business owner: legal entity/register details, operational role, countries served, image permissions, privacy retention and hosting processor information. These remain the same gaps noted in legal-pages-review.md.

Account owner: GSC property access/exports, analytics platform and privacy requirements, qualified-lead definition, PageSpeed/CrUX results. Connect measurement hooks to the approved platform only after deciding consent and privacy requirements. Exclude URL query data and form contents. Use a server-approved integration for non-JavaScript conversions if required.

## Hostinger upload

Back up the current site and .htaccess. Upload updated `app/` beside public_html. Upload the CONTENTS of `public/` into public_html, including .htaccess, robots.txt, sitemap.php, contact.php, resources.php, guides/ and updated assets. Do not overwrite the private .env or upload docs/tests into public_html. No new Composer dependencies.

Verify /sitemap.xml, /robots.txt, all four categories, guides, product prefilling and 404s. Check https://www.krauspapersgmbh.com/ redirects to the non-www host; /index.php?product=Clear+Tape must retain the query when redirecting. Confirm HTTPS rules do not loop under the hosting configuration. Then submit https://krauspapersgmbh.com/sitemap.xml in Search Console and inspect representative URLs.

## Primary references checked

- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet

The source plan supplies the remaining research context. Product-specific specifications from benchmark suppliers have not been copied into this catalogue.
