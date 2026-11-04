# Hostinger deployment

This project requires PHP 8.2 or newer, OpenSSL, PHP sessions and the Composer-installed PHPMailer dependency. No database or asset build is required. Follow [contact email setup](contact-email-setup.md) for dependency installation, private transport configuration and writable storage.

## Upload layout

Hostinger serves a site's web files from `public_html`. Upload the **contents** of the local `public/` folder there, including the hidden `.htaccess` file. Upload `app/` alongside `public_html/`, not inside it:

```text
your-domain-directory/
├── .env                        # Private Hostinger SMTP settings; add mailbox password
├── config/                     # Private contact.php
├── vendor/                     # Composer-installed dependencies
├── storage/contact/            # Writable private rate limits
├── app/
│   ├── bootstrap.php
│   ├── data/
│   └── views/
└── public_html/
    ├── .htaccess
    ├── index.php
    ├── contact-submit.php
    ├── about.php
    ├── product-details.php
    ├── printing-paper.php
    ├── thermal-paper.php
    ├── jumbo-paper-rolls.php
    ├── adhesive-tape.php
    ├── 404.php
    └── assets/
```

1. Back up the existing website before replacing its files.
2. In the domain's File Manager, place `app/` in the parent directory of `public_html/`. Both folders must belong to this website. If the initial view only shows web files, use the file manager view that gives access to their parent directory.
3. Upload everything inside local `public/` to `public_html/`. Do not nest it under `public_html/public/`.
4. Select PHP 8.2 or newer with OpenSSL and sessions. Install the locked Composer dependencies or upload `vendor/`. Set up private configuration and writable storage as described in the email setup guide. No database is needed.
5. Visit the homepage, all four categories, a product detail page and an Enquire link. Confirm that images load and the enquiry summary shows the selected product.

The public entry points resolve `../app/bootstrap.php`. The bootstrap receives the entry point's directory, so the change from local `public/` to hosted `public_html/` needs no code edits. Existing `.php` URLs and relative asset URLs remain unchanged. `.htaccess` chooses `index.php` as the directory index and disables directory listings; the site does not require rewrite rules.

Keep `docs/`, `scripts/`, `tests/`, `README.md`, `composer.json`, `composer.lock`, `.git/` and development files outside `public_html/`. Composer files are needed there if installing dependencies through SSH. If your hosting setup uses a custom document root, point it directly to local `public/` and keep the sibling private folders. The development router is only for PHP's built-in server, which otherwise falls back to the homepage for missing URLs.

The enquiry form has a protected submission handler. Hostinger SMTP settings are prepared in the private project-root `.env`. Add the mailbox password to `MAIL_PASSWORD`, upload `.env` beside `public_html/`, and install/upload the updated dependencies including phpdotenv. An empty password fails safely. No real mail has been sent during setup; no DNS or mailbox changes are part of this implementation.

Sources: [Hostinger file uploads](https://www.hostinger.com/support/1869164-how-to-upload-backups-with-ftp-in-hostinger/) and [Hostinger File Manager](https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/). DNS changes require the specific records supplied for your hosting account.
