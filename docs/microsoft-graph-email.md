# Microsoft 365 email on Netlify

The contact form now supports `MAIL_TRANSPORT=graph` using Microsoft's maintained MSAL Node library and an RSA certificate. It sends from and to info@krauspapersgmbh.com, puts the validated visitor in Reply-To, and saves to Sent Items. Only HTTP 202 counts as acceptance, not proof of inbox delivery. Existing validation, CSRF, honeypot, rate limits and preview restrictions remain in place. SMTP is still supported explicitly; Graph never falls back to it.

## Configuration already completed locally

The uploaded public certificate matches the private key. The ignored root `.env` contains the tenant ID, client ID, SHA-256 certificate fingerprint and base64 private key. No mailbox password is needed for Graph. Old SMTP variables are inactive while `MAIL_TRANSPORT=graph`.

Exchange's `KrausWebsiteSendMail` assignment grants `Application Mail.Send` within `KrausWebsiteMailbox`; the user verified InScope True. Do not add a separate tenant-wide Entra Mail.Send permission, because its access would be additive to this scoped grant.

## Deploy manually

1. Commit and push the code and package-lock.json. Do not upload `.env` or `storage/` to GitHub. Netlify installs dependencies during its normal build.
2. In Netlify, open Project configuration > Environment variables. Add the following names, copying their values privately from the local `.env`:
   - MAIL_TRANSPORT (`graph`)
   - MAIL_FROM_ADDRESS (`info@krauspapersgmbh.com`)
   - MAIL_FROM_NAME (`Kraus Papers`)
   - MAIL_GRAPH_TENANT_ID
   - MAIL_GRAPH_CLIENT_ID
   - MAIL_GRAPH_CERT_THUMBPRINT_SHA256
   - MAIL_GRAPH_PRIVATE_KEY_BASE64
3. Make these available to Functions in the production context only. Treat the private-key value as a secret. Do not use NEXT_PUBLIC_ prefixes. Remove obsolete Hostinger SMTP variables from Netlify once switching to Graph.
4. Deploy production after these variables are saved. A local `.env` does not automatically configure Netlify.
5. Submit one enquiry and verify the inbox and Sent Items. No real email or remote authentication was performed during implementation. Exchange permission propagation may delay initial use.

The private key file must stay outside public/. Keep a secure backup. The current certificate expires 5 November 2027: upload a replacement and update the private key/fingerprint in Netlify before then, redeploy and verify, then retire the old certificate. Base64 is encoding, not encryption.

## Local testing

`npm.cmd ci`, then `npm.cmd run dev`. Submitting with configured Graph credentials sends real mail; use `npm.cmd test` for offline mock tests instead. Tests use generated disposable keys and mock both token acquisition and Graph responses.

Sources: [MSAL certificate configuration](https://learn.microsoft.com/en-us/entra/msal/javascript/node/initialize-confidential-client-application), [Graph sendMail](https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0), [Exchange application RBAC](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac).
