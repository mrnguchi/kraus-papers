import { ConfidentialClientApplication } from '@azure/msal-node';
import { createPrivateKey } from 'node:crypto';
import { Unconfigured, recipient } from './contact-core.mjs';

// Dependency injection keeps tests completely offline, including token acquisition.
export function createGraphSender(env, { makeClient = config => new ConfidentialClientApplication(config), request = fetch } = {}) {
 const guid = /^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
 const thumbprint = env.MAIL_GRAPH_CERT_THUMBPRINT_SHA256?.replaceAll(':', '');
 const privateKey = env.MAIL_GRAPH_PRIVATE_KEY_BASE64 ? Buffer.from(env.MAIL_GRAPH_PRIVATE_KEY_BASE64, 'base64').toString('utf8') : '';
 if (!guid.test(env.MAIL_GRAPH_TENANT_ID || '') || !guid.test(env.MAIL_GRAPH_CLIENT_ID || '') || !/^[a-f\d]{64}$/i.test(thumbprint || '') || env.MAIL_FROM_ADDRESS?.toLowerCase() !== recipient || !privateKey) throw new Unconfigured();
 try { if (createPrivateKey(privateKey).asymmetricKeyType !== 'rsa') throw new Error(); } catch { throw new Unconfigured(); }
 const client = makeClient({
  auth: { clientId: env.MAIL_GRAPH_CLIENT_ID, authority: `https://login.microsoftonline.com/${env.MAIL_GRAPH_TENANT_ID}`, clientCertificate: { thumbprintSha256: thumbprint, privateKey } },
  system: { loggerOptions: { loggerCallback: () => {}, piiLoggingEnabled: false }, networkClient: {
   sendGetRequestAsync: (url, options) => tokenRequest(url, options, 'GET'),
   sendPostRequestAsync: (url, options) => tokenRequest(url, options, 'POST'),
  } },
 });
 async function tokenRequest(url, options, method) {
  const response = await request(url, { method, headers: options?.headers, body: method === 'POST' ? options?.body : undefined, redirect: 'error', signal: AbortSignal.timeout(15000) });
  return { status: response.status, headers: Object.fromEntries(response.headers), body: await response.json() };
 }
 return async message => {
  const token = await client.acquireTokenByClientCredential({ scopes: ['https://graph.microsoft.com/.default'] });
  if (!token?.accessToken) throw new Error('Mail authentication unavailable');
  const response = await request(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(recipient)}/sendMail`, {
   method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000),
   headers: { Authorization: `Bearer ${token.accessToken}`, 'Content-Type': 'application/json' },
   body: JSON.stringify({ message: {
    subject: 'Kraus Papers website enquiry',
    from: { emailAddress: { address: recipient, name: env.MAIL_FROM_NAME || 'Kraus Papers' } },
    toRecipients: [{ emailAddress: { address: recipient } }],
    replyTo: [{ emailAddress: { address: message.email, name: message.name } }],
    body: { contentType: 'Text', content: `Name: ${message.name}\nEmail: ${message.email}\n${message.product ? 'Product: ' + message.product + '\n' : ''}\nMessage:\n${message.message}\n` },
   }, saveToSentItems: true }),
  });
  // No automatic send retries: acceptance is not final inbox delivery.
  return response.status === 202;
 };
}
