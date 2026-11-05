// Run locally after generating the certificate. Never prints credentials.
import fs from 'node:fs';
import { X509Certificate, createPrivateKey, createPublicKey } from 'node:crypto';
const cert = new X509Certificate(fs.readFileSync('storage/mail-auth/kraus-graph-public.crt'));
const key = fs.readFileSync('storage/mail-auth/kraus-graph-private.pem');
if (!cert.publicKey.export({type:'spki',format:'der'}).equals(createPublicKey(createPrivateKey(key)).export({type:'spki',format:'der'}))) throw Error('Certificate/key mismatch');
let text = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
const values = {
 MAIL_TRANSPORT: 'graph', MAIL_FROM_ADDRESS: 'info@krauspapersgmbh.com',
 MAIL_GRAPH_TENANT_ID: '4a1f4089-8afd-436e-a88b-1cbbd7cb75b4',
 MAIL_GRAPH_CLIENT_ID: '9eb42277-854a-4b11-ae02-1c4784e6291d',
 MAIL_GRAPH_CERT_THUMBPRINT_SHA256: cert.fingerprint256.replaceAll(':',''),
 MAIL_GRAPH_PRIVATE_KEY_BASE64: key.toString('base64'),
};
for (const [name,value] of Object.entries(values)) {
 const re = new RegExp('^' + name + '=.*$', 'm');
 text = re.test(text) ? text.replace(re, name + '=' + value) : text.trimEnd() + '\n' + name + '=' + value + '\n';
}
fs.writeFileSync('.env', text);
console.log('Private Graph configuration saved; certificate/key match verified. No credentials displayed.');
