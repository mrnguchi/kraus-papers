# Legal pages: editorial review and upload

Prepared 26 October 2026. These are review drafts, not a claim of legal compliance. Nothing was deployed.

## Implementation

- Footer links: Terms & Conditions, Privacy Policy, Contact, Legal Notice; responsive wrapping and keyboard focus.
- Shared view: app/views/legal-page.php; content: app/data/legal-pages.php.
- Public entry points: privacy-policy.php, terms-and-conditions.php, legal-notice.php.
- Contact form links to the privacy notice without adding a compulsory marketing/consent checkbox.
- Only existing session cookies were found in the application; no analytics scripts or external fonts were found. A decorative cookie-consent button was therefore not copied from the old screenshot.
- Terms cover the catalogue and enquiry process only; no unapproved sales, payment, warranty or jurisdiction clauses were invented.

## Required owner review before publishing

The old page is a reference, not the source of current company identity. Its privacy notice names Kraus Paper Company GmbH, Gelnhäuser Str.9, 63867 Johannesberg. The screenshot uses Kraus Papierverarbeitung GmbH. Neither has been substituted for the new site's Kraus Papers brand and user-supplied Duisburg address.

Confirm the full registered legal entity, authorised representative, register court and number, and VAT/business identification number where applicable. Confirm that the supplied address is the appropriate establishment/service address. German DDG section 5 requires legal-entity identification beyond a brand and email.

Confirm Hostinger's contracting entity, processor agreement, server/mail locations, subprocessors and international transfer safeguards from the actual account. Confirm hosting log retention, PHP session cleanup, mailbox deletion and backup retention. Establish the enquiry retention schedule and applicable statutory retention rules. Confirm any DPO designation and applicable dispute-resolution information. Update the draft text with these facts, obtain appropriate legal review, and remove the shared draft banner only after completion. The privacy notice currently openly marks these gaps rather than presenting guesses as facts.

## Research

- Old imprint URL supplied by user: https://www.paperhousecompany.com/en/imprint.html (repeated fetches failed; not treated as verified).
- Accessible old privacy notice: https://www.paperhousecompany.com/en/privacy-policy.html (structure/reference only; not copied).
- DDG section 5: https://www.gesetze-im-internet.de/ddg/__5.html
- GDPR: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- NRW regulator website privacy guidance: https://www.ldi.nrw.de/system/files/media/document/file/muster-fur-datenschutzhinweise-fur-websites.pdf
- Hostinger provider policy: https://www.hostinger.com/legal/privacy-policy

The new notice is primarily based on the actual app/bootstrap.php, app/contact.php, public/contact-submit.php and local JavaScript, not the old site's generic tracking descriptions.

## Hostinger upload after review

Upload app/data/legal-pages.php and app/views/legal-page.php to their corresponding private app directories. Replace app/views/header.php, footer.php and contact-section.php. Upload the three new public PHP files directly into public_html and replace public_html/assets/css/styles.css. No new Composer dependencies, DNS changes, mailbox changes or .env updates are required. Keep the existing private configuration intact.
