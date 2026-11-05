import fs from 'node:fs';
const names = ['APP_ORIGIN', 'MAIL_TRANSPORT', 'MAIL_FROM_ADDRESS', 'MAIL_FROM_NAME', 'MAIL_GRAPH_TENANT_ID', 'MAIL_GRAPH_CLIENT_ID', 'MAIL_GRAPH_CERT_THUMBPRINT_SHA256', 'MAIL_GRAPH_PRIVATE_KEY_BASE64'];
const entries = new Map();
for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
 const match = line.match(/^\s*(?:export\s+)?([A-Z_][A-Z0-9_]*)\s*=(.*)$/);
 if (match && names.includes(match[1])) entries.set(match[1], match[2]);
}
entries.set('MAIL_TRANSPORT', 'graph');
if (!entries.has('APP_ORIGIN')) entries.set('APP_ORIGIN', 'https://krauspapersgmbh.com');
if (!entries.has('MAIL_FROM_NAME')) entries.set('MAIL_FROM_NAME', '"Kraus Papers"');
for (const name of names) if (!entries.get(name)?.trim()) throw Error('Required configuration missing: ' + name);
fs.writeFileSync('.env', '# Private Netlify production Functions configuration. Never commit this file.\n' + names.map(name => name + '=' + entries.get(name)).join('\n') + '\n');
console.log('Cleaned .env: 8 required variables retained; obsolete settings removed. No values displayed.');
