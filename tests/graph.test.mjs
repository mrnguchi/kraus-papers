import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { createGraphSender } from '../src/lib/contact-graph.mjs';
import { Unconfigured } from '../src/lib/contact-core.mjs';
const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
const env = { MAIL_GRAPH_TENANT_ID: '11111111-1111-1111-1111-111111111111', MAIL_GRAPH_CLIENT_ID: '22222222-2222-2222-2222-222222222222', MAIL_GRAPH_CERT_THUMBPRINT_SHA256: 'ab'.repeat(32), MAIL_GRAPH_PRIVATE_KEY_BASE64: Buffer.from(privateKey).toString('base64'), MAIL_FROM_ADDRESS: 'info@krauspapersgmbh.com' };
const message = { name: 'Buyer', email: 'buyer@example.test', message: 'Please quote.', product: 'Paper' };
test('Graph certificate auth, fixed recipient and Reply-To; only 202 succeeds', async () => {
 for (const status of [202, 200, 400, 401, 403, 429, 500]) {
  let calls = 0;
  const send = createGraphSender(env, { makeClient: config => {
   assert.equal(config.auth.clientCertificate.privateKey, privateKey);
   assert.equal(config.auth.clientSecret, undefined);
   return { acquireTokenByClientCredential: async options => { assert.deepEqual(options.scopes, ['https://graph.microsoft.com/.default']); return { accessToken: 'mock-token' }; } };
  }, request: async (url, options) => {
   calls++;
   assert.equal(url, 'https://graph.microsoft.com/v1.0/users/info%40krauspapersgmbh.com/sendMail');
   const body = JSON.parse(options.body);
   assert.equal(body.message.toRecipients[0].emailAddress.address, env.MAIL_FROM_ADDRESS);
   assert.equal(body.message.from.emailAddress.address, env.MAIL_FROM_ADDRESS);
   assert.equal(body.message.replyTo[0].emailAddress.address, message.email);
   assert.equal(body.saveToSentItems, true);
   return { status };
  } });
  assert.equal(await send(message), status === 202);
  assert.equal(calls, 1);
 }
});
test('Graph missing or invalid config fails closed', () => {
 for (const change of [{ MAIL_GRAPH_TENANT_ID: '' }, { MAIL_GRAPH_CLIENT_ID: 'bad' }, { MAIL_GRAPH_PRIVATE_KEY_BASE64: '' }, { MAIL_GRAPH_PRIVATE_KEY_BASE64: 'bad' }, { MAIL_GRAPH_CERT_THUMBPRINT_SHA256: '' }, { MAIL_FROM_ADDRESS: 'other@example.test' }]) assert.throws(() => createGraphSender({ ...env, ...change }), Unconfigured);
});
test('Graph auth failure prevents sending; network failure is not retried', async () => {
 let calls = 0;
 const request = async () => { calls++; throw Error('mock failure'); };
 const send = createGraphSender(env, { makeClient: () => ({ acquireTokenByClientCredential: async () => null }), request });
 await assert.rejects(send(message)); assert.equal(calls, 0);
 const failed = createGraphSender(env, { makeClient: () => ({ acquireTokenByClientCredential: async () => ({ accessToken: 'mock' }) }), request });
 await assert.rejects(failed(message)); assert.equal(calls, 1);
});
