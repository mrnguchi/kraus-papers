# Image optimization — 4 November 2026

Original and optimized file sizes from this working tree. These are asset-byte comparisons, not PageSpeed scores or measured field Core Web Vitals.

| Asset | Original bytes | Served variant bytes | Reduction |
|---|---:|---:|---:|
| Hero — desktop | 1,033,892 | 151,230 | 85.4% |
| Hero — mobile | 1,033,892 | 45,248 | 95.6% |
| About secondary | 2,974,601 | 152,116 | 94.9% |

The hero preload and CSS choose the same mobile/desktop WebP variant. Product media uses Next Image for responsive formats/sizes, with actual intrinsic dimensions from image-manifest.json. About gallery and editorial diagrams reserve their intrinsic dimensions. The original JPEGs remain in source control for traceability but are no longer requested by the corresponding backgrounds.

Reproduce with `node scripts/optimize-images.mjs` followed by `node scripts/report-seo-assets.mjs`. Visually check the site after changing encoding or sizes. Browser layout checks and visual screenshots are separate from this byte report.
