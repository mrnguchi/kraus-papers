# Contact form and email setup

The form posts to `contact-submit.php`. It sends only after validation and spam checks. The recipient is fixed in application code to **info@krauspapersgmbh.com**. A validated visitor address is used only as Reply-To, never From. Mail bodies are plain text.

## Current configuration state

The mailbox has moved to **Hostinger Email**. The project-root `.env` is prepared with `smtp.hostinger.com`, port **465**, implicit TLS (`smtps`), authenticated LOGIN, and `info@krauspapersgmbh.com` as both the username and From address. `MAIL_PASSWORD` is blank; sending fails safely until you fill it in. No real delivery test has been performed. PHPMailer and phpdotenv are installed through Composer and pinned in `composer.lock`.

These settings match [Hostinger's official mail configuration](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/). The alternative is port 587 with `MAIL_ENCRYPTION=starttls`, if required. Do not mix port 465 with STARTTLS. Only outgoing SMTP is needed by the contact form; no IMAP configuration is necessary.

For any future provider change, confirm:

- Whether this mailbox can send through authenticated SMTP, or instead needs a provider API.
- The permitted authentication method and any account/tenant permissions that must already be enabled.
- The authorized From address and whether it must match the authenticated account.
- For SMTP: the hostname, TLS mode, port and username, plus the approved credential or OAuth setup.

The former GoDaddy authentication uncertainty no longer applies to the selected Hostinger Email configuration. This implementation does not change the mailbox or its DNS.

## Private configuration

Edit **`.env` in the project root**, adding the mailbox password to `MAIL_PASSWORD`. Keep the value quoted so characters such as `#` and `$` are preserved. Single-quoted values are literal; if the password contains a single quote, use a double-quoted value and escape embedded double quotes, backslashes and dollar signs with a backslash. Do not share the password in chat. `.env` is excluded from Git; `.env.example` is the safe, blank-password template.

On Hostinger, put **`.env` beside `public_html/`**, not inside it. Upload updated `app/mail-config.php`, `public/contact-submit.php` (to `public_html/contact-submit.php`) and the complete updated `vendor/` directory as well. Alternatively install the updated lock file via Composer. Keep writable `storage/contact/` beside `public_html/`. No live `config/contact.php` is needed for this Hostinger setup.

When `.env` exists, it takes precedence over `config/contact.php`. Without `.env`, the older private PHP configuration remains supported for custom/OAuth adapters. Missing configuration stays disabled; an empty password or invalid SMTP configuration never produces success. Secret values are parsed without placing them into process globals or displaying them. Keep additional provider secret files in ignored `config/private/` or another private server location.

The older PHP example retains empty placeholders and `transport => disabled` for optional alternative adapters:

- `transport => smtp`: uses PHPMailer with TLS certificate verification, authenticated SMTP and debug output disabled. Supported adapters are LOGIN, PLAIN and XOAUTH2. Choosing LOGIN/PLAIN is appropriate only if explicitly supported and enabled by the provider.
- XOAUTH2 requires `smtp.oauth_provider_factory`, a private callable returning a PHPMailer `OAuthTokenProvider`. Provider-specific token acquisition, scopes, client registration and refresh are **not implemented** because the provider is unconfirmed. Additional OAuth packages may be required once that integration is chosen.
- `transport => custom`: a private `transport_factory` can return a `Kraus\Contact\Transport` implementation for a provider API. No API-specific adapter is bundled. The adapter must return true only after provider acceptance and throw or return false otherwise.

`from_address` must be a provider-authorized address. No fallback From address is guessed. The recipient cannot be overridden through the form or private configuration. A provider's acceptance means accepted for delivery, not guaranteed inbox placement.

## Hostinger deployment

The previous upload instructions change because mail now has dependencies. The final layout is:

```text
domain-directory/
├── .env                       # Private Hostinger settings and mailbox password
├── app/
├── config/
│   └── contact.php             # Private real configuration; never commit
├── vendor/                     # Composer dependencies, including autoload.php
├── storage/
│   └── contact/                # Writable private rate-limit storage
├── composer.json
├── composer.lock
└── public_html/
    ├── contact-submit.php
    ├── index.php
    ├── ...other public PHP pages
    ├── .htaccess
    └── assets/
        ├── js/contact.js
        ├── js/main.js
        └── css/styles.css
```

1. Back up the hosted files. Keep the project folder mapping: local `public/` contents go directly inside `public_html/`; `app/`, `config/`, `vendor/` and `storage/` are siblings outside it.
2. Use PHP 8.2 or newer; PHP 8.4 is used for local checks. Enable OpenSSL for authenticated TLS mail. PHP sessions must be enabled with a writable session-save directory. No database is required.
3. Install locked dependencies using `composer install --no-dev --prefer-dist --optimize-autoloader` from the project root. With Hostinger SSH, run it from the domain directory outside `public_html`, after uploading `composer.json` and `composer.lock`.
4. If using File Manager only, run the same command locally and upload the resulting **whole vendor folder**, including `vendor/autoload.php`. Composer needs ZIP support or unzip/7z for `--prefer-dist`; this Windows environment used `--prefer-source` because ZIP support was absent. `composer install --no-dev --prefer-source --optimize-autoloader` is an alternative when Git is available. Do not run `composer update` on production to deploy an existing lock file.
5. Upload all changed `app/` and public files, including the endpoint and `assets/js/contact.js`. Upload the private `.env` beside `public_html/` and enter the Hostinger mailbox password there. Use `.env.example` if creating it afresh. Sending remains unavailable while the password is blank.
6. Create private `storage/contact/` and ensure the hosting PHP user can read and write it. The application tries to create it with owner-only permissions if needed. Keep it outside `public_html`; do not use world-writable permissions. Configuration should be readable only by the account/PHP user (typically 600 for the file and 700 for private directories, where supported by the hosting ownership setup).
7. Serve the live site over HTTPS. Session cookies are HttpOnly and SameSite=Lax, and are Secure when PHP sees HTTPS. Exclude PHP form pages and the submission endpoint from any Hostinger/CDN full-page cache. Responses already send `Cache-Control: private, no-store`; shared caching must not reuse a visitor's CSRF token. Static CSS/JS/images can remain cached.
8. After uploading, verify the UI and private-file isolation. **No live delivery test has been performed.** Send a real test enquiry only after configuration is confirmed and you authorize it. Confirm receipt, Reply-To, mobile feedback and error handling then.

The HTTP endpoint handles GET with 405 and only sends on validated POST. Missing configuration returns a useful 503, not success. Never disable TLS certificate checks to fix a transport error.

## Protection and feedback

- Required name, email and message: 120, 254 and 5,000 Unicode characters maximum; invalid UTF-8, header-injection characters and malformed arrays are rejected. Maximum request body is 32 KiB. Visitor fields remain in the browser on failure; the non-JavaScript fallback keeps bounded values in the private PHP session and redirects back to the contact section with escaped output.
- Session-bound 256-bit CSRF and submission tokens. Cookies are required. A stale token returns fresh form tokens for a retry; no sending takes place on that attempt.
- An off-screen, inaccessible honeypot must remain empty.
- Ten POST attempts per remote address per 15-minute window, including invalid submissions. Rate limits use file locking and persist across sessions. Storage holds hashed addresses, counts and expiry timestamps only. Expired entries are removed on subsequent requests; the file is capped at 10,000 active entries. Storage failure fails closed.
- The rate limiter uses `REMOTE_ADDR`, not user-supplied X-Forwarded-For headers. If deployment places a reverse proxy in front of PHP, confirm its trusted client-IP handling before changing this. Users behind the same address share the limit. This is application-level abuse protection, not DDoS protection.
- The session stays locked during a send; accepted submission IDs are remembered (last 20 per session) to avoid duplicate sends on retries. The client disables repeated clicks, keeps entered text until acceptance and displays loading, success or error feedback. A plain POST also works without JavaScript using POST/Redirect/GET.
- No provider exception messages, SMTP debug output, submitted content or credentials are returned to visitors or intentionally logged. Network ambiguity is reported as unconfirmed delivery. If SMTP accepted a message but its response was lost, a later retry can still duplicate it; SMTP does not provide end-to-end exactly-once delivery.

## Tests (no real messages)

```powershell
composer test
node tests/contact-client.cjs
node --check public/assets/js/contact.js
```

`tests/contact.php` uses mock transports and builds PHPMailer messages without connecting to SMTP. `tests/contact-http.php` creates an isolated temporary deployment, private test configuration and local PHP server with a fake transport. It never reads production credentials. Tests cover validation and length limits, CSRF, honeypot, rate limits, fixed recipient/authorized From/Reply-To, acceptance and failure, duplicate retry, no-JavaScript preservation/escaping and response codes. Temporary data is cleaned up after the test.

`tests/contact-client.cjs` exercises loading, duplicate-click prevention, success, validation errors, network failure and malformed responses with a mocked DOM and fetch. Node is needed only for this development test, not on Hostinger. Visual browser QA remains separate.

Library reference: [official PHPMailer documentation](https://github.com/PHPMailer/PHPMailer). No real email was sent during implementation.
